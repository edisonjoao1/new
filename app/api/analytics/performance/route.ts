import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase/admin'

// Cache for performance data (10 min TTL)
let performanceCache: { data: any; timestamp: number } | null = null
const CACHE_TTL = 10 * 60 * 1000 // 10 minutes

interface PerformanceMetrics {
  responseTime: {
    average: number
    p50: number
    p90: number
    p99: number
    slowCount: number      // 3-8 seconds
    verySlowCount: number  // 8+ seconds
  }
  voice: {
    connectionSuccessRate: number
    avgSessionDuration: number
    reconnectRate: number
    totalSessions: number
    successfulSessions: number
    failedSessions: number
  }
  images: {
    successRate: number
    totalGenerated: number
    totalFailed: number
    avgPerUser: number
  }
  errors: {
    totalErrors: number
    errorRate: number
    topErrorTypes: { type: string; count: number }[]
  }
  engagement: {
    avgMessagesPerUser: number
    avgSessionsPerUser: number
    activeUserRate: number
  }
  timeline: {
    date: string
    responseTime: number
    errorRate: number
    voiceSuccessRate: number
  }[]
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')
  const days = parseInt(searchParams.get('days') || '14')

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check cache
  if (performanceCache && Date.now() - performanceCache.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...performanceCache.data, cached: true })
  }

  try {
    const db = getFirestoreDb()
    const now = new Date()
    const cutoffDate = new Date(now)
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Get all users
    const usersSnapshot = await db.collection('users').get()

    // Initialize counters
    let totalVoiceSessions = 0
    let successfulVoiceSessions = 0
    let failedVoiceSessions = 0
    let totalVoiceDuration = 0
    let voiceReconnects = 0

    let totalImages = 0
    let failedImages = 0

    let totalMessages = 0
    let totalErrors = 0
    let totalVoiceErrors = 0
    let totalImageErrors = 0

    const errorTypeCounts: Map<string, number> = new Map()
    const dailyMetrics: Map<string, {
      responses: number[]
      errors: number
      voiceAttempts: number
      voiceSuccesses: number
    }> = new Map()

    // Process each user
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data()

      // Voice metrics
      const voiceSessions = userData.total_voice_sessions || 0
      const voiceFailures = userData.voice_failure_count || 0
      totalVoiceSessions += voiceSessions
      successfulVoiceSessions += Math.max(0, voiceSessions - voiceFailures)
      failedVoiceSessions += voiceFailures
      totalVoiceErrors += voiceFailures

      // Get voice failure details for reconnect tracking
      if (voiceFailures > 0) {
        const voiceFailuresSnapshot = await db
          .collection('users')
          .doc(userDoc.id)
          .collection('voice_failures')
          .orderBy('created_at', 'desc')
          .limit(20)
          .get()

        voiceFailuresSnapshot.docs.forEach(doc => {
          const failure = doc.data()
          if (failure.reconnect_attempts && failure.reconnect_attempts > 0) {
            voiceReconnects++
          }

          // Track error types
          const errorType = failure.failure_type || failure.error_type || 'voice_unknown'
          errorTypeCounts.set(errorType, (errorTypeCounts.get(errorType) || 0) + 1)

          // Track daily metrics
          const timestamp = failure.created_at?.toDate?.() ||
                           (failure.created_at ? new Date(failure.created_at) : null)
          if (timestamp && timestamp > cutoffDate) {
            const dateKey = timestamp.toISOString().split('T')[0]
            if (!dailyMetrics.has(dateKey)) {
              dailyMetrics.set(dateKey, { responses: [], errors: 0, voiceAttempts: 0, voiceSuccesses: 0 })
            }
            const dayData = dailyMetrics.get(dateKey)!
            dayData.errors++
            dayData.voiceAttempts++
          }
        })
      }

      // Get voice sessions for duration tracking
      if (voiceSessions > 0) {
        const voiceSessionsSnapshot = await db
          .collection('users')
          .doc(userDoc.id)
          .collection('voice_conversations')
          .orderBy('created_at', 'desc')
          .limit(10)
          .get()

        voiceSessionsSnapshot.docs.forEach(doc => {
          const session = doc.data()
          if (session.session_duration_seconds) {
            totalVoiceDuration += session.session_duration_seconds
          }

          // Track successful voice sessions per day
          const timestamp = session.created_at?.toDate?.() ||
                           (session.created_at ? new Date(session.created_at) : null)
          if (timestamp && timestamp > cutoffDate) {
            const dateKey = timestamp.toISOString().split('T')[0]
            if (!dailyMetrics.has(dateKey)) {
              dailyMetrics.set(dateKey, { responses: [], errors: 0, voiceAttempts: 0, voiceSuccesses: 0 })
            }
            const dayData = dailyMetrics.get(dateKey)!
            dayData.voiceAttempts++
            dayData.voiceSuccesses++
          }
        })
      }

      // Image metrics
      const imagesGenerated = userData.total_images_generated || 0
      const imageFailures = userData.image_failure_count || 0
      totalImages += imagesGenerated
      failedImages += imageFailures
      totalImageErrors += imageFailures

      // Get image failure types
      if (imageFailures > 0) {
        const imageFailuresSnapshot = await db
          .collection('users')
          .doc(userDoc.id)
          .collection('image_failures')
          .limit(10)
          .get()

        imageFailuresSnapshot.docs.forEach(doc => {
          const failure = doc.data()
          const errorType = `image_${failure.failure_type || 'error'}`
          errorTypeCounts.set(errorType, (errorTypeCounts.get(errorType) || 0) + 1)
        })
      }

      // Message metrics
      totalMessages += userData.total_messages_sent || 0
    }

    totalErrors = totalVoiceErrors + totalImageErrors

    // Calculate metrics
    const voiceSuccessRate = totalVoiceSessions > 0
      ? Math.round((successfulVoiceSessions / totalVoiceSessions) * 100 * 10) / 10
      : 0

    const imageSuccessRate = totalImages > 0
      ? Math.round(((totalImages - failedImages) / totalImages) * 100 * 10) / 10
      : 0

    const avgVoiceDuration = successfulVoiceSessions > 0
      ? Math.round(totalVoiceDuration / successfulVoiceSessions)
      : 0

    const reconnectRate = totalVoiceSessions > 0
      ? Math.round((voiceReconnects / totalVoiceSessions) * 100 * 10) / 10
      : 0

    const activeUsers = usersSnapshot.docs.filter(doc => {
      const userData = doc.data()
      return (userData.total_messages_sent || 0) > 0 ||
             (userData.total_voice_sessions || 0) > 0 ||
             (userData.total_images_generated || 0) > 0
    }).length

    // Build top error types
    const topErrorTypes = Array.from(errorTypeCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }))

    // Build timeline
    const timeline: PerformanceMetrics['timeline'] = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]

      const dayData = dailyMetrics.get(dateKey)
      timeline.push({
        date: dateKey,
        responseTime: 0, // We don't have response time data from Firestore
        errorRate: dayData ? Math.round((dayData.errors / Math.max(1, dayData.voiceAttempts)) * 100) : 0,
        voiceSuccessRate: dayData && dayData.voiceAttempts > 0
          ? Math.round((dayData.voiceSuccesses / dayData.voiceAttempts) * 100)
          : 100,
      })
    }

    const result: PerformanceMetrics & { generatedAt: string; cached: boolean } = {
      responseTime: {
        average: 0, // Not tracked in Firestore
        p50: 0,
        p90: 0,
        p99: 0,
        slowCount: 0,
        verySlowCount: 0,
      },
      voice: {
        connectionSuccessRate: voiceSuccessRate,
        avgSessionDuration: avgVoiceDuration,
        reconnectRate,
        totalSessions: totalVoiceSessions,
        successfulSessions: successfulVoiceSessions,
        failedSessions: failedVoiceSessions,
      },
      images: {
        successRate: imageSuccessRate,
        totalGenerated: totalImages,
        totalFailed: failedImages,
        avgPerUser: usersSnapshot.size > 0 ? Math.round((totalImages / usersSnapshot.size) * 10) / 10 : 0,
      },
      errors: {
        totalErrors,
        errorRate: usersSnapshot.size > 0 ? Math.round((totalErrors / usersSnapshot.size) * 100 * 10) / 10 : 0,
        topErrorTypes,
      },
      engagement: {
        avgMessagesPerUser: usersSnapshot.size > 0 ? Math.round((totalMessages / usersSnapshot.size) * 10) / 10 : 0,
        avgSessionsPerUser: usersSnapshot.size > 0 ? Math.round((totalVoiceSessions / usersSnapshot.size) * 10) / 10 : 0,
        activeUserRate: usersSnapshot.size > 0 ? Math.round((activeUsers / usersSnapshot.size) * 100 * 10) / 10 : 0,
      },
      timeline,
      generatedAt: new Date().toISOString(),
      cached: false,
    }

    // Update cache
    performanceCache = { data: result, timestamp: Date.now() }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Performance API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch performance data' },
      { status: 500 }
    )
  }
}
