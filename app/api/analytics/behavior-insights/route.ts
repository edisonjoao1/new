import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase/admin'
import OpenAI from 'openai'

// Cache for insights (1 hour TTL - expensive operation)
let insightsCache: { data: any; timestamp: number } | null = null
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

interface Pattern {
  pattern: string
  affectedUsers: string
  impact: 'high' | 'medium' | 'low'
  recommendation: string
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low'
  action: string
  expectedImpact: string
  effort: 'low' | 'medium' | 'high'
}

interface Trend {
  metric: string
  direction: 'increasing' | 'decreasing' | 'stable'
  change: string
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const key = body.key

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check cache
  if (insightsCache && Date.now() - insightsCache.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...insightsCache.data, cached: true })
  }

  try {
    const db = getFirestoreDb()
    const now = new Date()
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const usersSnapshot = await db.collection('users').get()
    const totalUsers = usersSnapshot.size

    // Aggregate metrics for GPT analysis (no PII)
    let activeThisWeek = 0
    let activeLastWeek = 0
    let newUsersThisWeek = 0
    let newUsersLastWeek = 0

    let totalMessages = 0
    let totalImages = 0
    let totalVoice = 0
    let totalAppOpens = 0

    let usersWithMessages = 0
    let usersWithImages = 0
    let usersWithVoice = 0
    let usersWithMultipleFeatures = 0
    let powerUsers = 0

    let voiceErrors = 0
    let nsfwAttempts = 0

    // Retention tracking
    let day1Retained = 0
    let day7Retained = 0
    let day30Retained = 0
    let eligibleDay1 = 0
    let eligibleDay7 = 0
    let eligibleDay30 = 0

    // Feature correlation tracking
    let imageUsersRetained7Day = 0
    let nonImageUsersRetained7Day = 0
    let imageUsersTotal = 0
    let nonImageUsersTotal = 0

    for (const doc of usersSnapshot.docs) {
      const data = doc.data()

      const lastActive = data.last_active?.toDate?.() ||
                        (data.last_active ? new Date(data.last_active) : null)
      const firstOpen = data.first_open_date?.toDate?.() ||
                       (data.first_open_date ? new Date(data.first_open_date) : null) ||
                       data.created_at?.toDate?.() ||
                       (data.created_at ? new Date(data.created_at) : null)

      // Activity tracking
      if (lastActive) {
        if (lastActive >= sevenDaysAgo) activeThisWeek++
        if (lastActive >= fourteenDaysAgo && lastActive < sevenDaysAgo) activeLastWeek++
      }

      if (firstOpen) {
        if (firstOpen >= sevenDaysAgo) newUsersThisWeek++
        if (firstOpen >= fourteenDaysAgo && firstOpen < sevenDaysAgo) newUsersLastWeek++
      }

      // Feature usage
      const messages = data.total_messages_sent || 0
      const images = data.total_images_generated || 0
      const voice = data.total_voice_sessions || 0
      const appOpens = data.total_app_opens || 0

      totalMessages += messages
      totalImages += images
      totalVoice += voice
      totalAppOpens += appOpens

      const hasMessages = messages > 0
      const hasImages = images > 0
      const hasVoice = voice > 0

      if (hasMessages) usersWithMessages++
      if (hasImages) usersWithImages++
      if (hasVoice) usersWithVoice++

      const featuresUsed = [hasMessages, hasImages, hasVoice].filter(Boolean).length
      if (featuresUsed >= 2) usersWithMultipleFeatures++
      if (featuresUsed === 3) powerUsers++

      // Errors
      voiceErrors += data.voice_failure_count || 0
      nsfwAttempts += data.nsfw_attempt_count || 0

      // Retention calculations
      if (firstOpen && lastActive) {
        const daysSinceFirstOpen = Math.floor(
          (lastActive.getTime() - firstOpen.getTime()) / (1000 * 60 * 60 * 24)
        )
        const userAgeInDays = Math.floor(
          (now.getTime() - firstOpen.getTime()) / (1000 * 60 * 60 * 24)
        )

        if (userAgeInDays >= 1) {
          eligibleDay1++
          if (daysSinceFirstOpen >= 1) day1Retained++
        }
        if (userAgeInDays >= 7) {
          eligibleDay7++
          if (daysSinceFirstOpen >= 7) day7Retained++
        }
        if (userAgeInDays >= 30) {
          eligibleDay30++
          if (daysSinceFirstOpen >= 30) day30Retained++
        }

        // Feature correlation with retention
        if (userAgeInDays >= 7) {
          if (hasImages) {
            imageUsersTotal++
            if (daysSinceFirstOpen >= 7) imageUsersRetained7Day++
          } else {
            nonImageUsersTotal++
            if (daysSinceFirstOpen >= 7) nonImageUsersRetained7Day++
          }
        }
      }
    }

    // Calculate percentages for GPT
    const metrics = {
      totalUsers,
      activeThisWeek,
      activeLastWeek,
      activeWeekChange: activeLastWeek > 0
        ? Math.round(((activeThisWeek - activeLastWeek) / activeLastWeek) * 100)
        : 0,
      newUsersThisWeek,
      newUsersLastWeek,
      newUserChange: newUsersLastWeek > 0
        ? Math.round(((newUsersThisWeek - newUsersLastWeek) / newUsersLastWeek) * 100)
        : 0,
      featureAdoption: {
        messaging: totalUsers > 0 ? Math.round((usersWithMessages / totalUsers) * 100) : 0,
        imageGeneration: totalUsers > 0 ? Math.round((usersWithImages / totalUsers) * 100) : 0,
        voiceChat: totalUsers > 0 ? Math.round((usersWithVoice / totalUsers) * 100) : 0,
        multiFeature: totalUsers > 0 ? Math.round((usersWithMultipleFeatures / totalUsers) * 100) : 0,
        powerUsers: totalUsers > 0 ? Math.round((powerUsers / totalUsers) * 100) : 0,
      },
      avgPerUser: {
        messages: totalUsers > 0 ? Math.round(totalMessages / totalUsers * 10) / 10 : 0,
        images: totalUsers > 0 ? Math.round(totalImages / totalUsers * 10) / 10 : 0,
        voiceSessions: totalUsers > 0 ? Math.round(totalVoice / totalUsers * 10) / 10 : 0,
        appOpens: totalUsers > 0 ? Math.round(totalAppOpens / totalUsers * 10) / 10 : 0,
      },
      retention: {
        day1: eligibleDay1 > 0 ? Math.round((day1Retained / eligibleDay1) * 100) : 0,
        day7: eligibleDay7 > 0 ? Math.round((day7Retained / eligibleDay7) * 100) : 0,
        day30: eligibleDay30 > 0 ? Math.round((day30Retained / eligibleDay30) * 100) : 0,
      },
      featureRetentionCorrelation: {
        imageUsersDay7Retention: imageUsersTotal > 0
          ? Math.round((imageUsersRetained7Day / imageUsersTotal) * 100)
          : 0,
        nonImageUsersDay7Retention: nonImageUsersTotal > 0
          ? Math.round((nonImageUsersRetained7Day / nonImageUsersTotal) * 100)
          : 0,
      },
      errors: {
        voiceErrors,
        nsfwAttempts,
        errorRate: totalUsers > 0 ? Math.round((voiceErrors / totalUsers) * 100 * 10) / 10 : 0,
      },
    }

    // Call OpenAI for analysis
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

    const prompt = `You are an analytics expert analyzing mobile app user behavior data. Based on the following aggregated metrics (no personal data), provide actionable insights.

METRICS:
${JSON.stringify(metrics, null, 2)}

Provide your analysis in this exact JSON format:
{
  "patterns": [
    {
      "pattern": "Brief description of a behavioral pattern you noticed",
      "affectedUsers": "percentage of users affected",
      "impact": "high|medium|low",
      "recommendation": "Specific action to take"
    }
  ],
  "recommendations": [
    {
      "priority": "high|medium|low",
      "action": "Specific action to implement",
      "expectedImpact": "Expected result (e.g., '+15% D7 retention')",
      "effort": "low|medium|high"
    }
  ],
  "trends": [
    {
      "metric": "Name of metric",
      "direction": "increasing|decreasing|stable",
      "change": "Description of change (e.g., '+12% this week')"
    }
  ]
}

Focus on:
1. Identifying the strongest predictors of retention
2. Finding feature adoption gaps
3. Spotting concerning trends (errors, engagement drops)
4. Providing 3-5 high-impact, actionable recommendations

Keep insights specific to this data. Be concise. Only return valid JSON.`

    const response = await openai.responses.create({
      model: 'gpt-5-mini',
      input: prompt,
    })

    let analysis: {
      patterns: Pattern[]
      recommendations: Recommendation[]
      trends: Trend[]
    }

    try {
      // Extract JSON from response
      const responseText = response.output_text || ''
      const jsonMatch = responseText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch {
      // Fallback if parsing fails
      analysis = {
        patterns: [{
          pattern: 'Unable to parse AI response',
          affectedUsers: 'N/A',
          impact: 'low',
          recommendation: 'Try generating insights again',
        }],
        recommendations: [],
        trends: [],
      }
    }

    const result = {
      patterns: analysis.patterns || [],
      recommendations: analysis.recommendations || [],
      trends: analysis.trends || [],
      metrics, // Include raw metrics for transparency
      generatedAt: now.toISOString(),
      cached: false,
    }

    // Update cache
    insightsCache = { data: result, timestamp: Date.now() }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Behavior Insights API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate insights' },
      { status: 500 }
    )
  }
}

// Also support GET for cache check
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (insightsCache && Date.now() - insightsCache.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...insightsCache.data, cached: true })
  }

  return NextResponse.json({
    message: 'No cached insights available. Use POST to generate new insights.',
    cached: false,
  })
}
