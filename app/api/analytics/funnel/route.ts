import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase/admin'

// Cache for funnel data (30 min TTL)
let funnelCache: { data: any; timestamp: number } | null = null
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

interface FunnelStep {
  step: string
  description: string
  count: number
  percentage: number
  conversionFromPrevious: number
  dropoffFromPrevious: number
  icon: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check cache
  if (funnelCache && Date.now() - funnelCache.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...funnelCache.data, cached: true })
  }

  try {
    const db = getFirestoreDb()
    const usersSnapshot = await db.collection('users').get()

    const totalUsers = usersSnapshot.size

    // Count users at each funnel step
    let appOpenUsers = 0       // total_app_opens > 0
    let messageSentUsers = 0   // total_messages_sent > 0
    let imageGenUsers = 0      // total_images_generated > 0
    let voiceUsers = 0         // total_voice_sessions > 0

    // Additional metrics for insights
    let multiFeatureUsers = 0  // Used 2+ features
    let powerUsers = 0         // All 4 features

    usersSnapshot.docs.forEach(doc => {
      const data = doc.data()

      const hasAppOpens = (data.total_app_opens || 0) > 0
      const hasMessages = (data.total_messages_sent || 0) > 0
      const hasImages = (data.total_images_generated || 0) > 0
      const hasVoice = (data.total_voice_sessions || 0) > 0

      if (hasAppOpens) appOpenUsers++
      if (hasMessages) messageSentUsers++
      if (hasImages) imageGenUsers++
      if (hasVoice) voiceUsers++

      // Feature depth
      const featuresUsed = [hasMessages, hasImages, hasVoice].filter(Boolean).length
      if (featuresUsed >= 2) multiFeatureUsers++
      if (featuresUsed === 3) powerUsers++
    })

    // Build funnel steps
    const steps: FunnelStep[] = [
      {
        step: 'App Open',
        description: 'Users who opened the app',
        count: appOpenUsers,
        percentage: totalUsers > 0 ? Math.round((appOpenUsers / totalUsers) * 100 * 10) / 10 : 0,
        conversionFromPrevious: 100,
        dropoffFromPrevious: 0,
        icon: 'smartphone',
      },
      {
        step: 'Message Sent',
        description: 'Users who sent at least one message',
        count: messageSentUsers,
        percentage: totalUsers > 0 ? Math.round((messageSentUsers / totalUsers) * 100 * 10) / 10 : 0,
        conversionFromPrevious: appOpenUsers > 0
          ? Math.round((messageSentUsers / appOpenUsers) * 100 * 10) / 10
          : 0,
        dropoffFromPrevious: appOpenUsers > 0
          ? Math.round(((appOpenUsers - messageSentUsers) / appOpenUsers) * 100 * 10) / 10
          : 0,
        icon: 'message-square',
      },
      {
        step: 'Image Generated',
        description: 'Users who generated at least one image',
        count: imageGenUsers,
        percentage: totalUsers > 0 ? Math.round((imageGenUsers / totalUsers) * 100 * 10) / 10 : 0,
        conversionFromPrevious: messageSentUsers > 0
          ? Math.round((imageGenUsers / messageSentUsers) * 100 * 10) / 10
          : 0,
        dropoffFromPrevious: messageSentUsers > 0
          ? Math.round(((messageSentUsers - imageGenUsers) / messageSentUsers) * 100 * 10) / 10
          : 0,
        icon: 'image',
      },
      {
        step: 'Voice Used',
        description: 'Users who used voice chat',
        count: voiceUsers,
        percentage: totalUsers > 0 ? Math.round((voiceUsers / totalUsers) * 100 * 10) / 10 : 0,
        conversionFromPrevious: imageGenUsers > 0
          ? Math.round((voiceUsers / imageGenUsers) * 100 * 10) / 10
          : 0,
        dropoffFromPrevious: imageGenUsers > 0
          ? Math.round(((imageGenUsers - voiceUsers) / imageGenUsers) * 100 * 10) / 10
          : 0,
        icon: 'mic',
      },
    ]

    // Find biggest dropoff
    let biggestDropoff = ''
    let maxDropoff = 0
    steps.forEach(step => {
      if (step.dropoffFromPrevious > maxDropoff) {
        maxDropoff = step.dropoffFromPrevious
        biggestDropoff = step.step
      }
    })

    // Calculate overall conversion (first to last step)
    const overallConversion = appOpenUsers > 0
      ? Math.round((voiceUsers / appOpenUsers) * 100 * 10) / 10
      : 0

    // Feature adoption breakdown (alternative view)
    const featureAdoption = {
      messaging: {
        total: messageSentUsers,
        percentage: totalUsers > 0 ? Math.round((messageSentUsers / totalUsers) * 100) : 0,
      },
      imageGeneration: {
        total: imageGenUsers,
        percentage: totalUsers > 0 ? Math.round((imageGenUsers / totalUsers) * 100) : 0,
      },
      voiceChat: {
        total: voiceUsers,
        percentage: totalUsers > 0 ? Math.round((voiceUsers / totalUsers) * 100) : 0,
      },
      multiFeature: {
        total: multiFeatureUsers,
        percentage: totalUsers > 0 ? Math.round((multiFeatureUsers / totalUsers) * 100) : 0,
      },
      powerUsers: {
        total: powerUsers,
        percentage: totalUsers > 0 ? Math.round((powerUsers / totalUsers) * 100) : 0,
      },
    }

    const result = {
      steps,
      overallConversion,
      biggestDropoff,
      biggestDropoffRate: maxDropoff,
      featureAdoption,
      totalUsers,
      generatedAt: new Date().toISOString(),
      cached: false,
    }

    // Update cache
    funnelCache = { data: result, timestamp: Date.now() }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Funnel API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to calculate funnel' },
      { status: 500 }
    )
  }
}
