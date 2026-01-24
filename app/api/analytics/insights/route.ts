import { NextRequest, NextResponse } from 'next/server'
import { getAppContext, getAllAppContexts, getCategoryBenchmark, getPortfolioSummary } from '@/lib/analytics/app-contexts'

// In-memory cache for insights (30 min TTL)
const insightsCache = new Map<string, { data: InsightsResponse; timestamp: number }>()
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

interface TrendItem {
  type: 'positive' | 'negative' | 'neutral'
  metric: string
  description: string
  percentChange?: number
}

interface AnomalyItem {
  severity: 'high' | 'medium' | 'low'
  metric: string
  description: string
  possibleCause: string
}

interface ProjectionItem {
  metric: string
  current: number
  projected7d: number
  projected30d: number
  confidence: 'high' | 'medium' | 'low'
  trend: 'up' | 'down' | 'stable'
}

interface ActionItem {
  id: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: 'retention' | 'acquisition' | 'engagement' | 'monetization' | 'technical' | 'content'
  action: string
  expectedImpact: string
  effort: 'low' | 'medium' | 'high'
  deadline?: string
  status: 'pending' | 'in_progress' | 'completed'
  kpiTarget?: string
}

interface InsightsResponse {
  summary: string
  appContext?: {
    displayName: string
    category: string
    targetAudience: string
  }
  trends: TrendItem[]
  anomalies: AnomalyItem[]
  projections: ProjectionItem[]
  actionItems: ActionItem[]
  benchmarkComparison?: {
    metric: string
    appValue: number
    categoryAvg: number
    status: 'above' | 'below' | 'at'
  }[]
  generatedAt: string
  cached: boolean
}

async function callOpenAI(prompt: string, systemPrompt: string): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY not configured')
  }

  // Using OpenAI Responses API with gpt-5-mini (cost-effective)
  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-5-mini',
      input: prompt,
      instructions: systemPrompt,
      store: false, // Don't store for cost savings
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`OpenAI API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.output_text || data.output || ''
}

function generateCacheKey(propertyId: string | null, period: string): string {
  return `${propertyId || 'all'}_${period}_${new Date().toISOString().split('T')[0]}`
}

function getCachedInsights(key: string): InsightsResponse | null {
  const cached = insightsCache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return { ...cached.data, cached: true }
  }
  return null
}

function setCachedInsights(key: string, data: InsightsResponse): void {
  insightsCache.set(key, { data, timestamp: Date.now() })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { key, propertyId, period = '30d', analyticsData } = body

    // Validate auth key
    const validKey = process.env.ANALYTICS_PASSWORD
    if (!key || key !== validKey) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check cache first
    const cacheKey = generateCacheKey(propertyId, period)
    const cached = getCachedInsights(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // Get app context
    const appContext = propertyId ? getAppContext(propertyId) : null
    const categoryBenchmark = appContext ? getCategoryBenchmark(appContext.category) : null

    // Build the analysis prompt
    const systemPrompt = `You are an expert mobile app analytics consultant for AI4U Labs.
Your job is to analyze Google Analytics 4 data and provide actionable insights.

${appContext ? `
APP CONTEXT:
- App: ${appContext.displayName}
- Category: ${appContext.category}
- Description: ${appContext.description}
- Target Audience: ${appContext.targetAudience}
- Key Features: ${appContext.keyFeatures.join(', ')}
- Monetization: ${appContext.monetization}
- KPI Targets: DAU/MAU ${appContext.kpiTargets?.dauMau || 15}%, D1 Retention ${appContext.kpiTargets?.d1Retention || 30}%, D7 Retention ${appContext.kpiTargets?.d7Retention || 15}%

CATEGORY BENCHMARKS (${appContext.category}):
- Avg DAU/MAU: ${categoryBenchmark?.avgDauMau || 15}%
- Avg D1 Retention: ${categoryBenchmark?.avgD1Retention || 30}%
- Avg D7 Retention: ${categoryBenchmark?.avgD7Retention || 15}%
` : `
PORTFOLIO OVERVIEW:
${getPortfolioSummary()}
Analyzing aggregate data across all apps.
`}

IMPORTANT GUIDELINES:
1. Be specific with numbers and percentages
2. Prioritize actionable recommendations over observations
3. Consider the app's specific context and target audience
4. Flag any metrics that deviate significantly from benchmarks
5. Provide realistic projections based on current trends
6. Each action item should have a clear expected impact

Respond with valid JSON only, no markdown code blocks.`

    const userPrompt = `Analyze this analytics data and provide insights:

DATA:
${JSON.stringify(analyticsData, null, 2)}

Provide your analysis as a JSON object with this exact structure:
{
  "summary": "2-3 sentence executive summary of the app's current state and key insight",
  "trends": [
    {
      "type": "positive|negative|neutral",
      "metric": "metric name",
      "description": "what's happening",
      "percentChange": 12.5
    }
  ],
  "anomalies": [
    {
      "severity": "high|medium|low",
      "metric": "metric name",
      "description": "what's unusual",
      "possibleCause": "likely explanation"
    }
  ],
  "projections": [
    {
      "metric": "MAU|DAU|Retention|etc",
      "current": 1000,
      "projected7d": 1050,
      "projected30d": 1200,
      "confidence": "high|medium|low",
      "trend": "up|down|stable"
    }
  ],
  "actionItems": [
    {
      "id": "action-1",
      "priority": "critical|high|medium|low",
      "category": "retention|acquisition|engagement|monetization|technical|content",
      "action": "specific action to take",
      "expectedImpact": "e.g., +5% D7 retention",
      "effort": "low|medium|high",
      "deadline": "this week|next 2 weeks|this month",
      "status": "pending",
      "kpiTarget": "specific metric to track"
    }
  ],
  "benchmarkComparison": [
    {
      "metric": "DAU/MAU Ratio",
      "appValue": 18,
      "categoryAvg": 15,
      "status": "above|below|at"
    }
  ]
}

Include 3-5 trends, 0-3 anomalies (only if present), 3-5 projections, 5-8 prioritized action items, and benchmark comparisons if app context is available.`

    let insights: InsightsResponse

    try {
      const aiResponse = await callOpenAI(userPrompt, systemPrompt)

      // Parse the AI response
      const cleanedResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
      const parsed = JSON.parse(cleanedResponse)

      insights = {
        summary: parsed.summary || 'Analysis completed.',
        appContext: appContext ? {
          displayName: appContext.displayName,
          category: appContext.category,
          targetAudience: appContext.targetAudience,
        } : undefined,
        trends: parsed.trends || [],
        anomalies: parsed.anomalies || [],
        projections: parsed.projections || [],
        actionItems: parsed.actionItems || [],
        benchmarkComparison: parsed.benchmarkComparison,
        generatedAt: new Date().toISOString(),
        cached: false,
      }
    } catch (aiError) {
      console.error('AI analysis error:', aiError)

      // Fallback to rule-based analysis if AI fails
      insights = generateFallbackInsights(analyticsData, appContext, categoryBenchmark)
    }

    // Cache the result
    setCachedInsights(cacheKey, insights)

    return NextResponse.json(insights)
  } catch (error) {
    console.error('Insights API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate insights' },
      { status: 500 }
    )
  }
}

// Fallback analysis when AI is unavailable
function generateFallbackInsights(
  data: any,
  appContext: any,
  benchmark: any
): InsightsResponse {
  const trends: TrendItem[] = []
  const anomalies: AnomalyItem[] = []
  const projections: ProjectionItem[] = []
  const actionItems: ActionItem[] = []

  // Get growth rates from comparison data
  const userGrowth = parseFloat(data?.comparison?.changes?.users || '0')
  const sessionGrowth = parseFloat(data?.comparison?.changes?.sessions || '0')
  const newUserGrowth = parseFloat(data?.comparison?.changes?.newUsers || '0')

  // Current metrics
  const currentDAU = data?.totals?.dau || 0
  const currentMAU = data?.totals?.mau || 0
  const currentSessions = data?.totals?.totalSessions || 0
  const currentNewUsers = data?.totals?.totalNewUsers || 0

  // Add trends
  if (userGrowth !== 0) {
    trends.push({
      type: userGrowth > 5 ? 'positive' : userGrowth < -5 ? 'negative' : 'neutral',
      metric: 'User Growth',
      description: `Active users ${userGrowth > 0 ? 'grew' : 'declined'} by ${Math.abs(userGrowth).toFixed(1)}% vs previous period`,
      percentChange: userGrowth,
    })
  }

  if (newUserGrowth !== 0) {
    trends.push({
      type: newUserGrowth > 10 ? 'positive' : newUserGrowth < -10 ? 'negative' : 'neutral',
      metric: 'New User Acquisition',
      description: `New user signups ${newUserGrowth > 0 ? 'increased' : 'decreased'} by ${Math.abs(newUserGrowth).toFixed(1)}%`,
      percentChange: newUserGrowth,
    })
  }

  // Calculate realistic projections based on growth rate
  // Weekly growth = monthly growth / 4 (roughly)
  const weeklyGrowthRate = userGrowth / 4 / 100
  const monthlyGrowthRate = userGrowth / 100

  // DAU Projections
  projections.push({
    metric: 'DAU',
    current: currentDAU,
    projected7d: Math.round(currentDAU * (1 + weeklyGrowthRate)),
    projected30d: Math.round(currentDAU * (1 + monthlyGrowthRate)),
    confidence: Math.abs(userGrowth) < 30 ? 'high' : 'medium',
    trend: userGrowth > 5 ? 'up' : userGrowth < -5 ? 'down' : 'stable',
  })

  // MAU Projections
  projections.push({
    metric: 'MAU',
    current: currentMAU,
    projected7d: Math.round(currentMAU * (1 + weeklyGrowthRate)),
    projected30d: Math.round(currentMAU * (1 + monthlyGrowthRate)),
    confidence: Math.abs(userGrowth) < 30 ? 'high' : 'medium',
    trend: userGrowth > 5 ? 'up' : userGrowth < -5 ? 'down' : 'stable',
  })

  // Sessions Projections
  const sessionWeeklyRate = sessionGrowth / 4 / 100
  projections.push({
    metric: 'Sessions',
    current: currentSessions,
    projected7d: Math.round(currentSessions * (1 + sessionWeeklyRate)),
    projected30d: Math.round(currentSessions * (1 + sessionGrowth / 100)),
    confidence: Math.abs(sessionGrowth) < 30 ? 'high' : 'medium',
    trend: sessionGrowth > 5 ? 'up' : sessionGrowth < -5 ? 'down' : 'stable',
  })

  // Analyze DAU/MAU ratio (comes as string like "10.5" from API)
  const dauMauStr = data?.ratios?.dauMau || data?.ratios?.dauMauRatio
  if (dauMauStr !== undefined) {
    const ratio = parseFloat(dauMauStr)
    const targetRatio = appContext?.kpiTargets?.dauMau || benchmark?.avgDauMau || 15

    // Add stickiness trend
    trends.push({
      type: ratio >= targetRatio ? 'positive' : ratio >= targetRatio * 0.7 ? 'neutral' : 'negative',
      metric: 'Stickiness (DAU/MAU)',
      description: `${ratio.toFixed(1)}% of monthly users return daily${ratio >= targetRatio ? ' (above target)' : ` (target: ${targetRatio}%)`}`,
      percentChange: ratio,
    })

    if (ratio < targetRatio * 0.8) {
      anomalies.push({
        severity: 'medium',
        metric: 'DAU/MAU Ratio',
        description: `Current ratio of ${ratio.toFixed(1)}% is below target of ${targetRatio}%`,
        possibleCause: 'Users may not be finding daily value in the app',
      })

      actionItems.push({
        id: 'action-engagement-1',
        priority: 'high',
        category: 'engagement',
        action: 'Implement push notification strategy for daily engagement hooks',
        expectedImpact: `+${Math.round((targetRatio - ratio) * 0.5)}% DAU/MAU ratio`,
        effort: 'medium',
        deadline: 'next 2 weeks',
        status: 'pending',
        kpiTarget: `DAU/MAU ratio >= ${targetRatio}%`,
      })
    }
  }

  // Analyze retention
  if (data?.retention) {
    const d1 = data.retention.d1 || 0
    const d7 = data.retention.d7 || 0
    const targetD1 = appContext?.kpiTargets?.d1Retention || benchmark?.avgD1Retention || 30
    const targetD7 = appContext?.kpiTargets?.d7Retention || benchmark?.avgD7Retention || 15

    if (d1 < targetD1 * 0.8) {
      actionItems.push({
        id: 'action-retention-1',
        priority: 'critical',
        category: 'retention',
        action: 'Improve onboarding flow to demonstrate core value within first session',
        expectedImpact: `+${Math.round((targetD1 - d1) * 0.3)}% D1 retention`,
        effort: 'high',
        deadline: 'this month',
        status: 'pending',
        kpiTarget: `D1 retention >= ${targetD1}%`,
      })
    }

    projections.push({
      metric: 'D1 Retention',
      current: d1,
      projected7d: d1,
      projected30d: d1,
      confidence: 'medium',
      trend: 'stable',
    })
  }

  // Default action items
  actionItems.push({
    id: 'action-analytics-1',
    priority: 'medium',
    category: 'technical',
    action: 'Set up custom event tracking for key user actions',
    expectedImpact: 'Better visibility into user behavior',
    effort: 'low',
    deadline: 'this week',
    status: 'pending',
    kpiTarget: 'Event coverage for all key flows',
  })

  return {
    summary: `Based on rule-based analysis${appContext ? ` for ${appContext.displayName}` : ''}, the app shows ${trends[0]?.type === 'positive' ? 'positive momentum' : trends[0]?.type === 'negative' ? 'areas needing attention' : 'stable performance'}. ${actionItems.length} action items identified.`,
    appContext: appContext ? {
      displayName: appContext.displayName,
      category: appContext.category,
      targetAudience: appContext.targetAudience,
    } : undefined,
    trends,
    anomalies,
    projections,
    actionItems,
    generatedAt: new Date().toISOString(),
    cached: false,
  }
}

// GET endpoint for retrieving cached insights
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')
  const propertyId = searchParams.get('propertyId')
  const period = searchParams.get('period') || '30d'

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const cacheKey = generateCacheKey(propertyId, period)
  const cached = getCachedInsights(cacheKey)

  if (cached) {
    return NextResponse.json(cached)
  }

  return NextResponse.json({ cached: false, message: 'No cached insights available' })
}
