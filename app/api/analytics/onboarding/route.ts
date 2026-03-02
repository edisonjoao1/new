import { NextRequest, NextResponse } from 'next/server'

/**
 * Onboarding & Churn Analytics API
 * Queries GA4 for onboarding funnel, per-user onboarding status, and churn/win-back events
 *
 * Modes:
 *   ?mode=funnel  — Aggregate onboarding funnel across all users
 *   ?mode=user&deviceId=X  — Per-user onboarding status
 *   ?mode=churn&deviceId=X — Per-user churn & win-back events
 */

const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '488396770'

// Cache
const cache = new Map<string, { data: any; expires: number }>()
const FUNNEL_CACHE_TTL = 30 * 60 * 1000 // 30 min
const USER_CACHE_TTL = 5 * 60 * 1000    // 5 min

function getCached(key: string) {
  const entry = cache.get(key)
  if (entry && Date.now() < entry.expires) return entry.data
  return null
}

function setCache(key: string, data: any, ttl: number) {
  cache.set(key, { data, expires: Date.now() + ttl })
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Google OAuth credentials')
  }

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Failed to refresh token: ${error}`)
  }

  const data = await response.json()
  return data.access_token
}

async function runGAReport(accessToken: string, propertyId: string, request: any) {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`GA API error: ${error}`)
  }

  return response.json()
}

// ─── Funnel Mode: Aggregate onboarding stats ───

async function getOnboardingFunnel(accessToken: string) {
  const cacheKey = 'onboarding_funnel'
  const cached = getCached(cacheKey)
  if (cached) return { ...cached, cached: true }

  const report = await runGAReport(accessToken, GA4_PROPERTY_ID, {
    dateRanges: [{ startDate: '2024-01-01', endDate: 'today' }],
    dimensions: [{ name: 'eventName' }],
    metrics: [{ name: 'eventCount' }],
    dimensionFilter: {
      orGroup: {
        expressions: [
          'onboarding_started', 'onboarding_step_1', 'onboarding_step_2',
          'onboarding_step_3', 'onboarding_step_4', 'onboarding_step_5',
          'onboarding_completed', 'onboarding_skipped',
          'onboarding_name_entered', 'onboarding_name_skipped',
          'onboarding_chat_exchange', 'onboarding_trial_tapped',
        ].map(event => ({
          filter: {
            fieldName: 'eventName',
            stringFilter: { value: event, matchType: 'EXACT' },
          },
        })),
      },
    },
    orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
  })

  const eventCounts: Record<string, number> = {}
  report.rows?.forEach((row: any) => {
    const name = row.dimensionValues?.[0]?.value
    const count = parseInt(row.metricValues?.[0]?.value || '0')
    if (name) eventCounts[name] = count
  })

  const started = eventCounts['onboarding_started'] || 0
  const completed = eventCounts['onboarding_completed'] || 0
  const skipped = eventCounts['onboarding_skipped'] || 0
  const nameEntered = eventCounts['onboarding_name_entered'] || 0
  const nameSkipped = eventCounts['onboarding_name_skipped'] || 0
  const trialTapped = eventCounts['onboarding_trial_tapped'] || 0

  const steps = [
    { step: 'Started', event: 'onboarding_started', count: started },
    { step: 'Step 1', event: 'onboarding_step_1', count: eventCounts['onboarding_step_1'] || 0 },
    { step: 'Step 2', event: 'onboarding_step_2', count: eventCounts['onboarding_step_2'] || 0 },
    { step: 'Step 3', event: 'onboarding_step_3', count: eventCounts['onboarding_step_3'] || 0 },
    { step: 'Step 4', event: 'onboarding_step_4', count: eventCounts['onboarding_step_4'] || 0 },
    { step: 'Step 5', event: 'onboarding_step_5', count: eventCounts['onboarding_step_5'] || 0 },
    { step: 'Completed', event: 'onboarding_completed', count: completed },
  ]

  // Add conversion rates
  const stepsWithRates = steps.map((step, i) => ({
    ...step,
    percentage: started > 0 ? Math.round((step.count / started) * 100) : 0,
    conversionFromPrevious: i > 0 && steps[i - 1].count > 0
      ? Math.round((step.count / steps[i - 1].count) * 100)
      : 100,
    dropoffFromPrevious: i > 0 && steps[i - 1].count > 0
      ? Math.round(((steps[i - 1].count - step.count) / steps[i - 1].count) * 100)
      : 0,
  }))

  const result = {
    steps: stepsWithRates,
    metrics: {
      completionRate: started > 0 ? Math.round((completed / started) * 100) : 0,
      skipRate: started > 0 ? Math.round((skipped / started) * 100) : 0,
      nameEntryRate: (nameEntered + nameSkipped) > 0
        ? Math.round((nameEntered / (nameEntered + nameSkipped)) * 100) : 0,
      trialTapRate: started > 0 ? Math.round((trialTapped / started) * 100) : 0,
    },
    totals: {
      started,
      completed,
      skipped,
      nameEntered,
      nameSkipped,
      trialTapped,
      chatExchanges: eventCounts['onboarding_chat_exchange'] || 0,
    },
    generatedAt: new Date().toISOString(),
  }

  setCache(cacheKey, result, FUNNEL_CACHE_TTL)
  return { ...result, cached: false }
}

// ─── User Mode: Per-user onboarding status ───

async function getUserOnboarding(accessToken: string, deviceId: string) {
  const cacheKey = `onboarding_user_${deviceId}`
  const cached = getCached(cacheKey)
  if (cached) return { ...cached, cached: true }

  try {
    const report = await runGAReport(accessToken, GA4_PROPERTY_ID, {
      dateRanges: [{ startDate: '2024-01-01', endDate: 'today' }],
      dimensions: [
        { name: 'eventName' },
        { name: 'customEvent:device_id' },
      ],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: 'customEvent:device_id',
                stringFilter: { value: deviceId, matchType: 'EXACT' },
              },
            },
            {
              orGroup: {
                expressions: [
                  'onboarding_started', 'onboarding_step_1', 'onboarding_step_2',
                  'onboarding_step_3', 'onboarding_step_4', 'onboarding_step_5',
                  'onboarding_completed', 'onboarding_skipped',
                  'onboarding_name_entered', 'onboarding_name_skipped',
                  'onboarding_chat_exchange', 'onboarding_trial_tapped',
                ].map(event => ({
                  filter: {
                    fieldName: 'eventName',
                    stringFilter: { value: event, matchType: 'EXACT' },
                  },
                })),
              },
            },
          ],
        },
      },
    })

    const events: Record<string, number> = {}
    report.rows?.forEach((row: any) => {
      const name = row.dimensionValues?.[0]?.value
      const count = parseInt(row.metricValues?.[0]?.value || '0')
      if (name) events[name] = count
    })

    // Determine highest step reached
    let stepsReached = 0
    for (let i = 5; i >= 1; i--) {
      if (events[`onboarding_step_${i}`]) {
        stepsReached = i
        break
      }
    }

    const result = {
      available: true,
      started: !!events['onboarding_started'],
      completed: !!events['onboarding_completed'],
      skipped: !!events['onboarding_skipped'],
      stepsReached,
      nameEntered: !!events['onboarding_name_entered'],
      nameSkipped: !!events['onboarding_name_skipped'],
      chatExchanges: events['onboarding_chat_exchange'] || 0,
      trialTapped: !!events['onboarding_trial_tapped'],
      generatedAt: new Date().toISOString(),
    }

    setCache(cacheKey, result, USER_CACHE_TTL)
    return { ...result, cached: false }
  } catch (error) {
    // If device_id custom dimension not registered, gracefully degrade
    return {
      available: false,
      error: 'device_id custom dimension may not be registered in GA4',
      generatedAt: new Date().toISOString(),
      cached: false,
    }
  }
}

// ─── Churn Mode: Per-user churn & win-back events ───

async function getUserChurn(accessToken: string, deviceId: string) {
  const cacheKey = `churn_user_${deviceId}`
  const cached = getCached(cacheKey)
  if (cached) return { ...cached, cached: true }

  try {
    const report = await runGAReport(accessToken, GA4_PROPERTY_ID, {
      dateRanges: [{ startDate: '2024-01-01', endDate: 'today' }],
      dimensions: [
        { name: 'eventName' },
        { name: 'customEvent:device_id' },
      ],
      metrics: [{ name: 'eventCount' }],
      dimensionFilter: {
        andGroup: {
          expressions: [
            {
              filter: {
                fieldName: 'customEvent:device_id',
                stringFilter: { value: deviceId, matchType: 'EXACT' },
              },
            },
            {
              orGroup: {
                expressions: [
                  'subscriber_churned', 'winback_banner_shown',
                  'winback_banner_tapped', 'winback_banner_dismissed',
                  'winback_resubscribed',
                ].map(event => ({
                  filter: {
                    fieldName: 'eventName',
                    stringFilter: { value: event, matchType: 'EXACT' },
                  },
                })),
              },
            },
          ],
        },
      },
    })

    const events: Record<string, number> = {}
    report.rows?.forEach((row: any) => {
      const name = row.dimensionValues?.[0]?.value
      const count = parseInt(row.metricValues?.[0]?.value || '0')
      if (name) events[name] = count
    })

    const result = {
      available: true,
      hasChurned: !!events['subscriber_churned'],
      churnCount: events['subscriber_churned'] || 0,
      winback: {
        bannerShown: events['winback_banner_shown'] || 0,
        bannerTapped: events['winback_banner_tapped'] || 0,
        bannerDismissed: events['winback_banner_dismissed'] || 0,
        resubscribed: events['winback_resubscribed'] || 0,
      },
      resubscribed: (events['winback_resubscribed'] || 0) > 0,
      generatedAt: new Date().toISOString(),
    }

    setCache(cacheKey, result, USER_CACHE_TTL)
    return { ...result, cached: false }
  } catch (error) {
    return {
      available: false,
      error: 'device_id custom dimension may not be registered in GA4',
      generatedAt: new Date().toISOString(),
      cached: false,
    }
  }
}

// ─── Route Handler ───

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')
  const mode = searchParams.get('mode') || 'funnel'
  const deviceId = searchParams.get('deviceId')

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const accessToken = await getAccessToken()

    switch (mode) {
      case 'funnel': {
        const data = await getOnboardingFunnel(accessToken)
        return NextResponse.json(data)
      }
      case 'user': {
        if (!deviceId) {
          return NextResponse.json({ error: 'deviceId required for user mode' }, { status: 400 })
        }
        const data = await getUserOnboarding(accessToken, deviceId)
        return NextResponse.json(data)
      }
      case 'churn': {
        if (!deviceId) {
          return NextResponse.json({ error: 'deviceId required for churn mode' }, { status: 400 })
        }
        const data = await getUserChurn(accessToken, deviceId)
        return NextResponse.json(data)
      }
      default:
        return NextResponse.json({ error: `Unknown mode: ${mode}` }, { status: 400 })
    }
  } catch (error) {
    console.error('Onboarding API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch onboarding data' },
      { status: 500 }
    )
  }
}
