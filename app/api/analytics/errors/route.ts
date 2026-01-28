import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase/admin'

// Cache for error data (15 min TTL)
let errorsCache: { data: any; timestamp: number } | null = null
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

interface ErrorSummary {
  errorType: string
  count: number
  uniqueUsers: number
  avgReconnectAttempts: number
  firstSeen: string | null
  lastSeen: string | null
  trend: 'increasing' | 'stable' | 'decreasing'
}

interface UserWithErrors {
  userId: string
  userIdShort: string
  errorCount: number
  voiceErrors: number
  imageErrors: number
  chatErrors: number
  nsfwAttempts: number
  lastError: string | null
  errorTypes: string[]
  deviceModel: string
  appVersion: string
  locale: string
}

interface VoiceFailure {
  userId: string
  userIdShort: string
  errorType: string
  errorMessage: string
  reconnectAttempts: number
  sessionDuration: number
  timestamp: string
  deviceModel: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')
  const days = parseInt(searchParams.get('days') || '30')

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check cache
  if (errorsCache && Date.now() - errorsCache.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...errorsCache.data, cached: true })
  }

  try {
    const db = getFirestoreDb()
    const now = new Date()
    const cutoffDate = new Date(now)
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Get all users with any errors
    const usersSnapshot = await db.collection('users').get()

    let totalVoiceErrors = 0
    let totalImageErrors = 0
    let totalChatErrors = 0
    let totalNsfwAttempts = 0
    const usersWithErrors: UserWithErrors[] = []
    const errorsByType: Map<string, {
      count: number
      users: Set<string>
      reconnectAttempts: number[]
      timestamps: Date[]
      errorCodes: number[]
    }> = new Map()
    const errorTimeline: Map<string, number> = new Map()
    const recentErrors: VoiceFailure[] = []

    // Process each user
    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data()
      const voiceFailureCount = userData.voice_failure_count || 0
      const imageFailureCount = userData.image_failure_count || 0
      const chatErrorCount = userData.error_count || 0  // NEW: Generic errors
      const nsfwAttemptCount = userData.nsfw_attempt_count || 0

      totalVoiceErrors += voiceFailureCount
      totalImageErrors += imageFailureCount
      totalChatErrors += chatErrorCount
      totalNsfwAttempts += nsfwAttemptCount

      if (voiceFailureCount > 0 || imageFailureCount > 0 || chatErrorCount > 0 || nsfwAttemptCount > 0) {
        const userErrorTypes = new Set<string>()
        let lastErrorTime: Date | null = null

        // Get voice_failures subcollection for detailed errors
        if (voiceFailureCount > 0) {
          const voiceFailuresSnapshot = await db
            .collection('users')
            .doc(userDoc.id)
            .collection('voice_failures')
            .orderBy('created_at', 'desc')
            .limit(20)
            .get()

          voiceFailuresSnapshot.docs.forEach(failureDoc => {
            const failure = failureDoc.data()
            const errorType = failure.failure_type || failure.error_type || 'voice_unknown'
            const timestamp = failure.created_at?.toDate?.() ||
                             failure.timestamp?.toDate?.() ||
                             (failure.created_at ? new Date(failure.created_at) : null)

            userErrorTypes.add(errorType)

            if (timestamp && (!lastErrorTime || timestamp > lastErrorTime)) {
              lastErrorTime = timestamp
            }

            // Aggregate by error type
            if (!errorsByType.has(errorType)) {
              errorsByType.set(errorType, {
                count: 0,
                users: new Set(),
                reconnectAttempts: [],
                timestamps: [],
              })
            }
            const typeData = errorsByType.get(errorType)!
            typeData.count++
            typeData.users.add(userDoc.id)
            if (failure.reconnect_attempts) {
              typeData.reconnectAttempts.push(failure.reconnect_attempts)
            }
            if (timestamp) {
              typeData.timestamps.push(timestamp)
              const dateKey = timestamp.toISOString().split('T')[0]
              errorTimeline.set(dateKey, (errorTimeline.get(dateKey) || 0) + 1)
            }

            // Collect recent errors
            if (timestamp && timestamp > cutoffDate && recentErrors.length < 50) {
              recentErrors.push({
                userId: userDoc.id,
                userIdShort: userDoc.id.substring(0, 8) + '...',
                errorType,
                errorMessage: failure.error || failure.error_message || 'No message',
                reconnectAttempts: failure.reconnect_attempts || 0,
                sessionDuration: failure.session_duration || 0,
                timestamp: timestamp.toISOString(),
                deviceModel: userData.device_model || 'Unknown',
              })
            }
          })
        }

        // Get image_failures subcollection for detailed errors
        if (imageFailureCount > 0) {
          const imageFailuresSnapshot = await db
            .collection('users')
            .doc(userDoc.id)
            .collection('image_failures')
            .orderBy('created_at', 'desc')
            .limit(20)
            .get()

          imageFailuresSnapshot.docs.forEach(failureDoc => {
            const failure = failureDoc.data()
            const errorType = `image_${failure.failure_type || 'error'}`
            const timestamp = failure.created_at?.toDate?.() ||
                             (failure.created_at ? new Date(failure.created_at) : null)

            userErrorTypes.add(errorType)

            if (timestamp && (!lastErrorTime || timestamp > lastErrorTime)) {
              lastErrorTime = timestamp
            }

            // Aggregate by error type
            if (!errorsByType.has(errorType)) {
              errorsByType.set(errorType, {
                count: 0,
                users: new Set(),
                reconnectAttempts: [],
                timestamps: [],
              })
            }
            const typeData = errorsByType.get(errorType)!
            typeData.count++
            typeData.users.add(userDoc.id)
            if (timestamp) {
              typeData.timestamps.push(timestamp)
              const dateKey = timestamp.toISOString().split('T')[0]
              errorTimeline.set(dateKey, (errorTimeline.get(dateKey) || 0) + 1)
            }

            // Collect recent errors
            if (timestamp && timestamp > cutoffDate && recentErrors.length < 50) {
              recentErrors.push({
                userId: userDoc.id,
                userIdShort: userDoc.id.substring(0, 8) + '...',
                errorType,
                errorMessage: failure.error || 'Image generation failed',
                reconnectAttempts: 0,
                sessionDuration: 0,
                timestamp: timestamp.toISOString(),
                deviceModel: userData.device_model || 'Unknown',
              })
            }
          })
        }

        // Get generic errors subcollection (chat errors, API errors, etc.)
        if (chatErrorCount > 0) {
          const errorsSnapshot = await db
            .collection('users')
            .doc(userDoc.id)
            .collection('errors')
            .orderBy('created_at', 'desc')
            .limit(20)
            .get()

          errorsSnapshot.docs.forEach(errorDoc => {
            const errorData = errorDoc.data()
            const category = errorData.category || 'unknown'
            const errorCode = errorData.error_code
            const errorType = errorCode ? `${category}_${errorCode}` : category
            const timestamp = errorData.created_at?.toDate?.() ||
                             (errorData.created_at ? new Date(errorData.created_at) : null)

            userErrorTypes.add(errorType)

            if (timestamp && (!lastErrorTime || timestamp > lastErrorTime)) {
              lastErrorTime = timestamp
            }

            // Aggregate by error type
            if (!errorsByType.has(errorType)) {
              errorsByType.set(errorType, {
                count: 0,
                users: new Set(),
                reconnectAttempts: [],
                timestamps: [],
                errorCodes: [],
              })
            }
            const typeData = errorsByType.get(errorType)!
            typeData.count++
            typeData.users.add(userDoc.id)
            if (errorCode) {
              typeData.errorCodes.push(errorCode)
            }
            if (timestamp) {
              typeData.timestamps.push(timestamp)
              const dateKey = timestamp.toISOString().split('T')[0]
              errorTimeline.set(dateKey, (errorTimeline.get(dateKey) || 0) + 1)
            }

            // Collect recent errors
            if (timestamp && timestamp > cutoffDate && recentErrors.length < 50) {
              recentErrors.push({
                userId: userDoc.id,
                userIdShort: userDoc.id.substring(0, 8) + '...',
                errorType,
                errorMessage: errorData.error_message || 'No message',
                reconnectAttempts: 0,
                sessionDuration: 0,
                timestamp: timestamp.toISOString(),
                deviceModel: errorData.device_model || userData.device_model || 'Unknown',
              })
            }
          })
        }

        // Add NSFW as error type if applicable
        if (nsfwAttemptCount > 0) {
          userErrorTypes.add('nsfw_attempt')
          if (!errorsByType.has('nsfw_attempt')) {
            errorsByType.set('nsfw_attempt', {
              count: 0,
              users: new Set(),
              reconnectAttempts: [],
              timestamps: [],
              errorCodes: [],
            })
          }
          const nsfwData = errorsByType.get('nsfw_attempt')!
          nsfwData.count += nsfwAttemptCount
          nsfwData.users.add(userDoc.id)
        }

        usersWithErrors.push({
          userId: userDoc.id,
          userIdShort: userDoc.id.substring(0, 8) + '...',
          errorCount: voiceFailureCount + imageFailureCount + chatErrorCount + nsfwAttemptCount,
          voiceErrors: voiceFailureCount,
          imageErrors: imageFailureCount,
          chatErrors: chatErrorCount,
          nsfwAttempts: nsfwAttemptCount,
          lastError: lastErrorTime ? (lastErrorTime as Date).toISOString() : null,
          errorTypes: Array.from(userErrorTypes),
          deviceModel: userData.device_model || 'Unknown',
          appVersion: userData.app_version || 'Unknown',
          locale: userData.locale || 'Unknown',
        })
      }
    }

    // Sort users by error count
    usersWithErrors.sort((a, b) => b.errorCount - a.errorCount)

    // Build error type summaries
    const errorSummaries: ErrorSummary[] = []
    errorsByType.forEach((data, errorType) => {
      const avgReconnect = data.reconnectAttempts.length > 0
        ? Math.round(data.reconnectAttempts.reduce((a, b) => a + b, 0) / data.reconnectAttempts.length * 10) / 10
        : 0

      // Calculate trend based on recent vs older errors
      const now = new Date()
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

      const recentCount = data.timestamps.filter(t => t >= sevenDaysAgo).length
      const olderCount = data.timestamps.filter(t => t >= fourteenDaysAgo && t < sevenDaysAgo).length

      let trend: 'increasing' | 'stable' | 'decreasing' = 'stable'
      if (recentCount > olderCount * 1.5) trend = 'increasing'
      else if (recentCount < olderCount * 0.5) trend = 'decreasing'

      const sortedTimestamps = data.timestamps.sort((a, b) => a.getTime() - b.getTime())

      errorSummaries.push({
        errorType,
        count: data.count,
        uniqueUsers: data.users.size,
        avgReconnectAttempts: avgReconnect,
        firstSeen: sortedTimestamps.length > 0 ? sortedTimestamps[0].toISOString() : null,
        lastSeen: sortedTimestamps.length > 0 ? sortedTimestamps[sortedTimestamps.length - 1].toISOString() : null,
        trend,
      })
    })

    // Sort by count
    errorSummaries.sort((a, b) => b.count - a.count)

    // Build timeline array (last N days)
    const timelineArray: { date: string; count: number }[] = []
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dateKey = date.toISOString().split('T')[0]
      timelineArray.push({
        date: dateKey,
        count: errorTimeline.get(dateKey) || 0,
      })
    }

    // Sort recent errors by timestamp
    recentErrors.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

    const result = {
      summary: {
        totalErrors: totalVoiceErrors + totalImageErrors + totalChatErrors + totalNsfwAttempts,
        voiceErrors: totalVoiceErrors,
        imageErrors: totalImageErrors,
        chatErrors: totalChatErrors,
        nsfwAttempts: totalNsfwAttempts,
        usersAffected: usersWithErrors.length,
        errorRate: usersSnapshot.size > 0
          ? Math.round((usersWithErrors.length / usersSnapshot.size) * 100 * 10) / 10
          : 0,
      },
      errorsByType: errorSummaries,
      errorTimeline: timelineArray,
      usersWithMostErrors: usersWithErrors.slice(0, 20),
      recentErrors: recentErrors.slice(0, 20),
      totalUsers: usersSnapshot.size,
      generatedAt: new Date().toISOString(),
      cached: false,
    }

    // Update cache
    errorsCache = { data: result, timestamp: Date.now() }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Errors API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch error data' },
      { status: 500 }
    )
  }
}
