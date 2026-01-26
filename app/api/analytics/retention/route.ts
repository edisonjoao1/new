import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase/admin'

// Cache for retention data (1 hour TTL)
let retentionCache: { data: any; timestamp: number } | null = null
const CACHE_TTL = 60 * 60 * 1000 // 1 hour

interface CohortData {
  cohortWeek: string
  cohortStart: string
  cohortSize: number
  day1: number
  day7: number
  day30: number
  day1Count: number
  day7Count: number
  day30Count: number
}

function getWeekNumber(date: Date): string {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const dayNum = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - dayNum)
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
  const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)
  return `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`
}

function getWeekStart(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Adjust when day is Sunday
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')
  const weeks = parseInt(searchParams.get('weeks') || '8')

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check cache
  if (retentionCache && Date.now() - retentionCache.timestamp < CACHE_TTL) {
    return NextResponse.json({ ...retentionCache.data, cached: true })
  }

  try {
    const db = getFirestoreDb()
    const usersSnapshot = await db.collection('users').get()

    const now = new Date()
    const cutoffDate = new Date(now)
    cutoffDate.setDate(cutoffDate.getDate() - (weeks * 7))

    // Group users by signup week
    const cohortMap = new Map<string, {
      users: Array<{ firstOpen: Date; lastActive: Date | null }>
      weekStart: Date
    }>()

    usersSnapshot.docs.forEach(doc => {
      const data = doc.data()
      const firstOpen = data.first_open_date?.toDate?.() ||
                        (data.first_open_date ? new Date(data.first_open_date) : null) ||
                        data.created_at?.toDate?.() ||
                        (data.created_at ? new Date(data.created_at) : null)

      if (!firstOpen || firstOpen < cutoffDate) return

      const lastActive = data.last_active?.toDate?.() ||
                        (data.last_active ? new Date(data.last_active) : null)

      const weekKey = getWeekNumber(firstOpen)
      const weekStart = getWeekStart(firstOpen)

      if (!cohortMap.has(weekKey)) {
        cohortMap.set(weekKey, { users: [], weekStart })
      }
      cohortMap.get(weekKey)!.users.push({ firstOpen, lastActive })
    })

    // Calculate retention for each cohort
    const cohorts: CohortData[] = []

    cohortMap.forEach((cohort, weekKey) => {
      const { users, weekStart } = cohort
      const cohortSize = users.length

      if (cohortSize === 0) return

      let day1Count = 0
      let day7Count = 0
      let day30Count = 0

      users.forEach(({ firstOpen, lastActive }) => {
        if (!lastActive) return

        const daysSinceFirstOpen = Math.floor(
          (lastActive.getTime() - firstOpen.getTime()) / (1000 * 60 * 60 * 24)
        )

        // User returned at least N days after first open
        if (daysSinceFirstOpen >= 1) day1Count++
        if (daysSinceFirstOpen >= 7) day7Count++
        if (daysSinceFirstOpen >= 30) day30Count++
      })

      // Only include cohorts that are old enough for each metric
      const cohortAgeInDays = Math.floor(
        (now.getTime() - weekStart.getTime()) / (1000 * 60 * 60 * 24)
      )

      cohorts.push({
        cohortWeek: weekKey,
        cohortStart: weekStart.toISOString().split('T')[0],
        cohortSize,
        day1: cohortAgeInDays >= 1 ? Math.round((day1Count / cohortSize) * 100) : -1,
        day7: cohortAgeInDays >= 7 ? Math.round((day7Count / cohortSize) * 100) : -1,
        day30: cohortAgeInDays >= 30 ? Math.round((day30Count / cohortSize) * 100) : -1,
        day1Count,
        day7Count,
        day30Count,
      })
    })

    // Sort by week (newest first)
    cohorts.sort((a, b) => b.cohortWeek.localeCompare(a.cohortWeek))

    // Calculate averages (only for cohorts with valid data)
    const validDay1 = cohorts.filter(c => c.day1 >= 0)
    const validDay7 = cohorts.filter(c => c.day7 >= 0)
    const validDay30 = cohorts.filter(c => c.day30 >= 0)

    const averages = {
      day1: validDay1.length > 0
        ? Math.round(validDay1.reduce((sum, c) => sum + c.day1, 0) / validDay1.length)
        : 0,
      day7: validDay7.length > 0
        ? Math.round(validDay7.reduce((sum, c) => sum + c.day7, 0) / validDay7.length)
        : 0,
      day30: validDay30.length > 0
        ? Math.round(validDay30.reduce((sum, c) => sum + c.day30, 0) / validDay30.length)
        : 0,
    }

    // Calculate trend (compare recent 4 weeks vs previous 4 weeks)
    const recentCohorts = validDay7.slice(0, 4)
    const olderCohorts = validDay7.slice(4, 8)

    let trend: 'improving' | 'declining' | 'stable' = 'stable'
    if (recentCohorts.length >= 2 && olderCohorts.length >= 2) {
      const recentAvg = recentCohorts.reduce((sum, c) => sum + c.day7, 0) / recentCohorts.length
      const olderAvg = olderCohorts.reduce((sum, c) => sum + c.day7, 0) / olderCohorts.length

      if (recentAvg > olderAvg + 5) trend = 'improving'
      else if (recentAvg < olderAvg - 5) trend = 'declining'
    }

    const result = {
      cohorts,
      averages,
      trend,
      totalUsers: usersSnapshot.size,
      generatedAt: new Date().toISOString(),
      cached: false,
    }

    // Update cache
    retentionCache = { data: result, timestamp: Date.now() }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Retention API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to calculate retention' },
      { status: 500 }
    )
  }
}
