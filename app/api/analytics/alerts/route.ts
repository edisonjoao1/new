import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase/admin'

// Cache for alerts (5 min TTL - short for near real-time)
let alertsCache: { data: any; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

interface Alert {
  id: string
  type: 'error_spike' | 'nsfw_spike' | 'engagement_drop' | 'retention_drop' | 'new_users_drop'
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  metric: string
  currentValue: number
  baselineValue: number
  percentChange: number
  affectedUsers?: number
  triggeredAt: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check cache
  if (alertsCache && Date.now() - alertsCache.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...alertsCache.data, cached: true })
  }

  try {
    const db = getFirestoreDb()
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000)
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)
    const fourteenDaysAgo = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000)

    const usersSnapshot = await db.collection('users').get()

    // Calculate current metrics
    let currentVoiceErrors = 0
    let currentNsfwAttempts = 0
    let baselineVoiceErrors = 0
    let baselineNsfwAttempts = 0

    let activeToday = 0
    let activeYesterday = 0
    let activeThisWeek = 0
    let activeLastWeek = 0

    let newUsersThisWeek = 0
    let newUsersLastWeek = 0

    // Track errors from voice_failures subcollection
    const recentErrorUsers: string[] = []

    for (const doc of usersSnapshot.docs) {
      const data = doc.data()

      const lastActive = data.last_active?.toDate?.() ||
                        (data.last_active ? new Date(data.last_active) : null)
      const firstOpen = data.first_open_date?.toDate?.() ||
                       (data.first_open_date ? new Date(data.first_open_date) : null) ||
                       data.created_at?.toDate?.() ||
                       (data.created_at ? new Date(data.created_at) : null)

      // Voice errors (current = last 24h, baseline = 7-day avg)
      const voiceFailureCount = data.voice_failure_count || 0
      const nsfwCount = data.nsfw_attempt_count || 0

      // For errors, we need to check the voice_failures subcollection timestamps
      // But for simplicity, we'll use last_voice_failure timestamp
      const lastVoiceFailure = data.last_voice_failure?.toDate?.() ||
                               (data.last_voice_failure ? new Date(data.last_voice_failure) : null)

      if (lastVoiceFailure) {
        if (lastVoiceFailure >= yesterday) {
          currentVoiceErrors += voiceFailureCount > 0 ? 1 : 0
          recentErrorUsers.push(doc.id)
        }
        if (lastVoiceFailure >= sevenDaysAgo && lastVoiceFailure < yesterday) {
          baselineVoiceErrors++
        }
      }

      // NSFW attempts
      const lastNsfwAttempt = data.last_nsfw_attempt?.toDate?.() ||
                             (data.last_nsfw_attempt ? new Date(data.last_nsfw_attempt) : null)

      if (lastNsfwAttempt) {
        if (lastNsfwAttempt >= yesterday) {
          currentNsfwAttempts += nsfwCount > 0 ? 1 : 0
        }
        if (lastNsfwAttempt >= sevenDaysAgo && lastNsfwAttempt < yesterday) {
          baselineNsfwAttempts++
        }
      }

      // Activity metrics
      if (lastActive) {
        if (lastActive >= today) activeToday++
        if (lastActive >= yesterday && lastActive < today) activeYesterday++
        if (lastActive >= sevenDaysAgo) activeThisWeek++
        if (lastActive >= fourteenDaysAgo && lastActive < sevenDaysAgo) activeLastWeek++
      }

      // New users
      if (firstOpen) {
        if (firstOpen >= sevenDaysAgo) newUsersThisWeek++
        if (firstOpen >= fourteenDaysAgo && firstOpen < sevenDaysAgo) newUsersLastWeek++
      }
    }

    const alerts: Alert[] = []
    const alertId = () => `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Check for error spike (50% increase)
    const baselineErrorsDaily = baselineVoiceErrors / 6 // 6-day baseline
    if (currentVoiceErrors > baselineErrorsDaily * 1.5 && currentVoiceErrors >= 3) {
      const percentChange = baselineErrorsDaily > 0
        ? Math.round(((currentVoiceErrors - baselineErrorsDaily) / baselineErrorsDaily) * 100)
        : 100

      alerts.push({
        id: alertId(),
        type: 'error_spike',
        severity: percentChange > 100 ? 'critical' : 'warning',
        title: 'Voice Error Spike Detected',
        description: `Voice failures increased ${percentChange}% in the last 24 hours compared to the 7-day average.`,
        metric: 'voice_failure_count',
        currentValue: currentVoiceErrors,
        baselineValue: Math.round(baselineErrorsDaily),
        percentChange,
        affectedUsers: recentErrorUsers.length,
        triggeredAt: now.toISOString(),
      })
    }

    // Check for NSFW spike (100% increase)
    const baselineNsfwDaily = baselineNsfwAttempts / 6
    if (currentNsfwAttempts > baselineNsfwDaily * 2 && currentNsfwAttempts >= 2) {
      const percentChange = baselineNsfwDaily > 0
        ? Math.round(((currentNsfwAttempts - baselineNsfwDaily) / baselineNsfwDaily) * 100)
        : 100

      alerts.push({
        id: alertId(),
        type: 'nsfw_spike',
        severity: 'warning',
        title: 'NSFW Attempt Spike',
        description: `NSFW filter violations increased ${percentChange}% in the last 24 hours.`,
        metric: 'nsfw_attempt_count',
        currentValue: currentNsfwAttempts,
        baselineValue: Math.round(baselineNsfwDaily),
        percentChange,
        triggeredAt: now.toISOString(),
      })
    }

    // Check for engagement drop (DAU dropped 30% from yesterday)
    // Only check after 10 AM to avoid false alerts early in the day
    const currentHour = now.getHours()
    if (currentHour >= 10 && activeYesterday > 0 && activeToday < activeYesterday * 0.7 && activeYesterday >= 10) {
      const percentChange = Math.round(((activeYesterday - activeToday) / activeYesterday) * 100)

      alerts.push({
        id: alertId(),
        type: 'engagement_drop',
        severity: percentChange > 50 ? 'critical' : 'warning',
        title: 'Engagement Drop Detected',
        description: `Daily active users dropped ${percentChange}% compared to yesterday (${activeYesterday} → ${activeToday}).`,
        metric: 'daily_active_users',
        currentValue: activeToday,
        baselineValue: activeYesterday,
        percentChange: -percentChange,
        triggeredAt: now.toISOString(),
      })
    }

    // Check for weekly engagement drop (WAU dropped 20%)
    if (activeLastWeek > 0 && activeThisWeek < activeLastWeek * 0.8 && activeLastWeek >= 20) {
      const percentChange = Math.round(((activeLastWeek - activeThisWeek) / activeLastWeek) * 100)

      alerts.push({
        id: alertId(),
        type: 'engagement_drop',
        severity: 'warning',
        title: 'Weekly Engagement Declining',
        description: `Weekly active users dropped ${percentChange}% compared to last week.`,
        metric: 'weekly_active_users',
        currentValue: activeThisWeek,
        baselineValue: activeLastWeek,
        percentChange: -percentChange,
        triggeredAt: now.toISOString(),
      })
    }

    // Check for new user drop (30% fewer signups)
    if (newUsersLastWeek > 0 && newUsersThisWeek < newUsersLastWeek * 0.7 && newUsersLastWeek >= 10) {
      const percentChange = Math.round(((newUsersLastWeek - newUsersThisWeek) / newUsersLastWeek) * 100)

      alerts.push({
        id: alertId(),
        type: 'new_users_drop',
        severity: 'info',
        title: 'New User Signups Decreasing',
        description: `New user signups dropped ${percentChange}% this week compared to last week.`,
        metric: 'new_users',
        currentValue: newUsersThisWeek,
        baselineValue: newUsersLastWeek,
        percentChange: -percentChange,
        triggeredAt: now.toISOString(),
      })
    }

    // Sort alerts by severity
    const severityOrder = { critical: 0, warning: 1, info: 2 }
    alerts.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity])

    const result = {
      alerts,
      alertCount: {
        critical: alerts.filter(a => a.severity === 'critical').length,
        warning: alerts.filter(a => a.severity === 'warning').length,
        info: alerts.filter(a => a.severity === 'info').length,
        total: alerts.length,
      },
      metrics: {
        activeToday,
        activeYesterday,
        activeThisWeek,
        activeLastWeek,
        newUsersThisWeek,
        newUsersLastWeek,
        currentVoiceErrors,
        baselineVoiceErrors: Math.round(baselineErrorsDaily),
      },
      generatedAt: now.toISOString(),
      cached: false,
    }

    // Update cache
    alertsCache = { data: result, timestamp: Date.now() }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Alerts API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to check alerts' },
      { status: 500 }
    )
  }
}
