import { NextRequest, NextResponse } from 'next/server'
import { getFirestoreDb } from '@/lib/firebase/admin'

/**
 * Voice Diagnostics API
 * Fetches actual voice failure data from Firestore to understand WHY connections fail
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')
  const days = parseInt(searchParams.get('days') || '7')

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getFirestoreDb()
    const now = new Date()
    const cutoffDate = new Date(now)
    cutoffDate.setDate(cutoffDate.getDate() - days)

    // Query global voice_failures collection for recent failures
    // First try with date filter, then without if empty
    let failuresSnapshot = await db
      .collection('voice_failures')
      .orderBy('created_at', 'desc')
      .limit(500)
      .get()

    // If empty, check per-user subcollections (try without ordering first)
    if (failuresSnapshot.empty) {
      console.log('Global voice_failures empty, checking user subcollections...')
      const usersSnap = await db.collection('users').limit(100).get()
      const allFailures: FirebaseFirestore.QueryDocumentSnapshot[] = []

      for (const userDoc of usersSnap.docs) {
        try {
          // Try without orderBy first (in case created_at is missing)
          const userFailures = await db
            .collection('users')
            .doc(userDoc.id)
            .collection('voice_failures')
            .limit(30)
            .get()
          allFailures.push(...userFailures.docs)
        } catch (e) {
          console.log(`Error fetching failures for ${userDoc.id}: ${e}`)
        }
      }

      // Create a fake snapshot-like structure
      failuresSnapshot = {
        docs: allFailures,
        size: allFailures.length,
        empty: allFailures.length === 0
      } as any
    }

    // Also try global collection without date filter
    if (failuresSnapshot.empty) {
      console.log('User subcollections also empty, trying global without date filter...')
      failuresSnapshot = await db
        .collection('voice_failures')
        .limit(500)
        .get()
    }

    // Aggregate failure data
    const failuresByType: Map<string, {
      count: number
      errors: Map<string, number>
      devices: Set<string>
      appVersions: Set<string>
      osVersions: Set<string>
      recentErrors: string[]
    }> = new Map()

    const failuresByHour: Map<string, number> = new Map()
    const failuresByDevice: Map<string, number> = new Map()
    const failuresByAppVersion: Map<string, number> = new Map()
    const allErrors: { type: string; error: string; device: string; time: string; appVersion: string }[] = []

    failuresSnapshot.docs.forEach(doc => {
      const data = doc.data()
      const failureType = data.failure_type || 'unknown'
      const error = data.error || 'no_error_message'
      const deviceModel = data.device_model || 'unknown'
      const appVersion = data.app_version || 'unknown'
      const osVersion = data.os_version || 'unknown'
      const timestamp = data.created_at?.toDate?.() || new Date()

      // By type
      if (!failuresByType.has(failureType)) {
        failuresByType.set(failureType, {
          count: 0,
          errors: new Map(),
          devices: new Set(),
          appVersions: new Set(),
          osVersions: new Set(),
          recentErrors: []
        })
      }
      const typeData = failuresByType.get(failureType)!
      typeData.count++
      typeData.errors.set(error, (typeData.errors.get(error) || 0) + 1)
      typeData.devices.add(deviceModel)
      typeData.appVersions.add(appVersion)
      typeData.osVersions.add(osVersion)
      if (typeData.recentErrors.length < 5) {
        typeData.recentErrors.push(error)
      }

      // By hour
      const hourKey = timestamp.toISOString().slice(0, 13) + ':00'
      failuresByHour.set(hourKey, (failuresByHour.get(hourKey) || 0) + 1)

      // By device
      failuresByDevice.set(deviceModel, (failuresByDevice.get(deviceModel) || 0) + 1)

      // By app version
      failuresByAppVersion.set(appVersion, (failuresByAppVersion.get(appVersion) || 0) + 1)

      // Collect recent errors for detail view
      if (allErrors.length < 50) {
        allErrors.push({
          type: failureType,
          error: error,
          device: deviceModel,
          time: timestamp.toISOString(),
          appVersion: appVersion
        })
      }
    })

    // Convert to serializable format
    const failureTypeSummary = Array.from(failuresByType.entries()).map(([type, data]) => ({
      type,
      count: data.count,
      percentage: Math.round((data.count / failuresSnapshot.size) * 100 * 10) / 10,
      topErrors: Array.from(data.errors.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([error, count]) => ({ error, count })),
      deviceCount: data.devices.size,
      devices: Array.from(data.devices).slice(0, 5),
      appVersions: Array.from(data.appVersions),
      recentErrors: data.recentErrors
    })).sort((a, b) => b.count - a.count)

    const hourlyTimeline = Array.from(failuresByHour.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([hour, count]) => ({ hour, count }))

    const deviceBreakdown = Array.from(failuresByDevice.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([device, count]) => ({ device, count }))

    const versionBreakdown = Array.from(failuresByAppVersion.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([version, count]) => ({ version, count }))

    // Get voice success data for comparison
    const usersSnapshot = await db.collection('users').get()
    let totalVoiceSessions = 0
    let totalVoiceFailures = 0

    // Track users with voice failures for debugging
    const usersWithFailures: {
      id: string
      sessions: number
      failures: number
      lastFailureType: string
      device: string
      appVersion: string
    }[] = []

    usersSnapshot.docs.forEach(doc => {
      const userData = doc.data()
      const sessions = userData.total_voice_sessions || 0
      const failures = userData.voice_failure_count || 0
      totalVoiceSessions += sessions
      totalVoiceFailures += failures

      if (failures > 0) {
        usersWithFailures.push({
          id: doc.id.substring(0, 8) + '...',
          sessions,
          failures,
          lastFailureType: userData.last_voice_failure_type || 'unknown',
          device: userData.device_model || 'unknown',
          appVersion: userData.app_version || 'unknown'
        })
      }
    })

    // Sort by failures desc
    usersWithFailures.sort((a, b) => b.failures - a.failures)

    const successRate = totalVoiceSessions > 0
      ? Math.round(((totalVoiceSessions - totalVoiceFailures) / totalVoiceSessions) * 100 * 10) / 10
      : 0

    return NextResponse.json({
      summary: {
        totalFailures: failuresSnapshot.size,
        totalVoiceSessions,
        totalVoiceFailures,
        successRate,
        dateRange: {
          from: cutoffDate.toISOString(),
          to: now.toISOString()
        }
      },
      failuresByType: failureTypeSummary,
      hourlyTimeline,
      deviceBreakdown,
      versionBreakdown,
      recentErrors: allErrors,
      usersWithFailures: usersWithFailures.slice(0, 20),
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('Voice diagnostics error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch diagnostics' },
      { status: 500 }
    )
  }
}
