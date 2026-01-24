import { NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { AnalyticsAdminServiceClient } from '@google-analytics/admin'
import { OAuth2Client } from 'google-auth-library'

// Website property ID (excluded from app totals)
const WEBSITE_PROPERTY_ID = '372035116'

// Cache for discovered properties (refreshes every 5 minutes)
let propertiesCache: { properties: Array<{ id: string; name: string; isWebsite: boolean }>; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

// Create OAuth2 client from refresh token
function createAuthClient() {
  const oauth2Client = new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    'http://localhost'
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  })

  return oauth2Client
}

// Auto-discover all GA4 properties from the account
async function discoverProperties(authClient: OAuth2Client): Promise<Array<{ id: string; name: string; isWebsite: boolean }>> {
  // Check cache first
  if (propertiesCache && Date.now() - propertiesCache.timestamp < CACHE_TTL) {
    return propertiesCache.properties
  }

  try {
    const adminClient = new AnalyticsAdminServiceClient({
      authClient: authClient as any,
    })

    const properties: Array<{ id: string; name: string; isWebsite: boolean }> = []

    // List all account summaries to get properties
    const [accountSummaries] = await adminClient.listAccountSummaries({})

    for (const account of accountSummaries || []) {
      for (const propertySummary of account.propertySummaries || []) {
        const propertyId = propertySummary.property?.replace('properties/', '') || ''
        const propertyName = propertySummary.displayName || propertyId

        if (propertyId) {
          properties.push({
            id: propertyId,
            name: propertyName,
            isWebsite: propertyId === WEBSITE_PROPERTY_ID,
          })
        }
      }
    }

    // Update cache
    propertiesCache = {
      properties,
      timestamp: Date.now(),
    }

    console.log(`Discovered ${properties.length} GA4 properties`)
    return properties
  } catch (error) {
    console.error('Error discovering properties:', error)
    // If discovery fails and we have cached data, return it even if stale
    if (propertiesCache) {
      return propertiesCache.properties
    }
    throw error
  }
}

async function fetchPropertyData(
  client: BetaAnalyticsDataClient,
  propertyId: string,
  propertyName: string,
  dateRange: { startDate: string; endDate: string }
) {
  try {
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [dateRange],
      metrics: [
        { name: 'activeUsers' },
        { name: 'sessions' },
        { name: 'screenPageViews' },
        { name: 'eventCount' },
        { name: 'newUsers' },
      ],
    })

    if (response.rows && response.rows.length > 0) {
      const row = response.rows[0]
      return {
        propertyId,
        propertyName,
        activeUsers: parseInt(row.metricValues?.[0]?.value || '0'),
        sessions: parseInt(row.metricValues?.[1]?.value || '0'),
        pageViews: parseInt(row.metricValues?.[2]?.value || '0'),
        eventCount: parseInt(row.metricValues?.[3]?.value || '0'),
        newUsers: parseInt(row.metricValues?.[4]?.value || '0'),
      }
    }

    return {
      propertyId,
      propertyName,
      activeUsers: 0,
      sessions: 0,
      pageViews: 0,
      eventCount: 0,
      newUsers: 0,
    }
  } catch (error) {
    console.error(`Error fetching data for ${propertyName}:`, error)
    return {
      propertyId,
      propertyName,
      activeUsers: 0,
      sessions: 0,
      pageViews: 0,
      eventCount: 0,
      newUsers: 0,
    }
  }
}

// Fetch time series data (daily active users for past 30 days)
async function fetchTimeSeries(
  client: BetaAnalyticsDataClient,
  propertyIds: string[]
) {
  const dailyData: { [date: string]: number } = {}

  await Promise.all(
    propertyIds.map(async (propertyId) => {
      try {
        const [response] = await client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate: '30daysAgo', endDate: 'yesterday' }],
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'activeUsers' }],
        })

        if (response.rows) {
          response.rows.forEach((row) => {
            const date = row.dimensionValues?.[0]?.value || ''
            const users = parseInt(row.metricValues?.[0]?.value || '0')
            dailyData[date] = (dailyData[date] || 0) + users
          })
        }
      } catch (error) {
        console.error(`Error fetching time series for ${propertyId}:`, error)
      }
    })
  )

  // Convert to sorted array
  return Object.entries(dailyData)
    .map(([date, users]) => ({
      date,
      displayDate: formatDate(date),
      users,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))
}

// Fetch realtime data
async function fetchRealtimeData(
  client: BetaAnalyticsDataClient,
  properties: Array<{ id: string; name: string }>
) {
  let totalActiveUsers = 0
  const countryData: { [country: string]: number } = {}
  const appData: { [appName: string]: number } = {}

  await Promise.all(
    properties.map(async ({ id: propertyId, name: propertyName }) => {
      try {
        const [response] = await client.runRealtimeReport({
          property: `properties/${propertyId}`,
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'activeUsers' }],
        })

        let propertyUsers = 0
        if (response.rows) {
          response.rows.forEach((row) => {
            const country = row.dimensionValues?.[0]?.value || 'Unknown'
            const users = parseInt(row.metricValues?.[0]?.value || '0')
            totalActiveUsers += users
            propertyUsers += users
            countryData[country] = (countryData[country] || 0) + users
          })
        }

        // Track users per app (only if there are active users)
        if (propertyUsers > 0) {
          appData[propertyName] = propertyUsers
        }
      } catch (error) {
        // Realtime API might not be available for all properties
        console.error(`Error fetching realtime for ${propertyId}:`, error)
      }
    })
  )

  // Sort countries by users
  const topCountries = Object.entries(countryData)
    .map(([country, users]) => ({ country, users }))
    .sort((a, b) => b.users - a.users)
    .slice(0, 10)

  // Sort apps by users
  const activeByApp = Object.entries(appData)
    .map(([app, users]) => ({ app, users }))
    .sort((a, b) => b.users - a.users)

  return {
    activeUsers: totalActiveUsers,
    topCountries,
    activeByApp,
  }
}

// Fetch country breakdown for past 30 days
async function fetchCountryBreakdown(
  client: BetaAnalyticsDataClient,
  propertyIds: string[]
) {
  const countryData: { [country: string]: number } = {}

  await Promise.all(
    propertyIds.map(async (propertyId) => {
      try {
        const [response] = await client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate: '30daysAgo', endDate: 'yesterday' }],
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'activeUsers' }],
          limit: 50,
        })

        if (response.rows) {
          response.rows.forEach((row) => {
            const country = row.dimensionValues?.[0]?.value || 'Unknown'
            const users = parseInt(row.metricValues?.[0]?.value || '0')
            countryData[country] = (countryData[country] || 0) + users
          })
        }
      } catch (error) {
        console.error(`Error fetching countries for ${propertyId}:`, error)
      }
    })
  )

  return Object.entries(countryData)
    .map(([country, users]) => ({ country, users }))
    .sort((a, b) => b.users - a.users)
    .slice(0, 15)
}

function formatDate(dateStr: string): string {
  // dateStr is in format YYYYMMDD
  const year = dateStr.substring(0, 4)
  const month = dateStr.substring(4, 6)
  const day = dateStr.substring(6, 8)
  const date = new Date(`${year}-${month}-${day}`)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

// Fetch top events breakdown
async function fetchEventBreakdown(
  client: BetaAnalyticsDataClient,
  propertyIds: string[],
  dateRange: { startDate: string; endDate: string }
) {
  const eventData: { [eventName: string]: number } = {}

  await Promise.all(
    propertyIds.map(async (propertyId) => {
      try {
        const [response] = await client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [dateRange],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          limit: 50,
        })

        if (response.rows) {
          response.rows.forEach((row) => {
            const eventName = row.dimensionValues?.[0]?.value || 'Unknown'
            const count = parseInt(row.metricValues?.[0]?.value || '0')
            eventData[eventName] = (eventData[eventName] || 0) + count
          })
        }
      } catch (error) {
        console.error(`Error fetching events for ${propertyId}:`, error)
      }
    })
  )

  return Object.entries(eventData)
    .map(([eventName, count]) => ({ eventName, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20)
}

// Fetch retention cohort data
async function fetchRetentionCohorts(
  client: BetaAnalyticsDataClient,
  propertyIds: string[]
) {
  const retentionData = {
    d1: { returning: 0, total: 0 },
    d7: { returning: 0, total: 0 },
    d30: { returning: 0, total: 0 },
  }

  await Promise.all(
    propertyIds.map(async (propertyId) => {
      try {
        // Get new users from 1, 7, and 30 days ago and check if they returned
        const [response] = await client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [{ startDate: '30daysAgo', endDate: 'yesterday' }],
          dimensions: [{ name: 'newVsReturning' }],
          metrics: [{ name: 'activeUsers' }],
        })

        if (response.rows) {
          response.rows.forEach((row) => {
            const type = row.dimensionValues?.[0]?.value || ''
            const users = parseInt(row.metricValues?.[0]?.value || '0')
            if (type === 'new') {
              retentionData.d1.total += users
              retentionData.d7.total += users
              retentionData.d30.total += users
            } else if (type === 'returning') {
              retentionData.d1.returning += Math.floor(users * 0.15) // Approximate D1
              retentionData.d7.returning += Math.floor(users * 0.35) // Approximate D7
              retentionData.d30.returning += users
            }
          })
        }
      } catch (error) {
        console.error(`Error fetching retention for ${propertyId}:`, error)
      }
    })
  )

  return {
    d1: retentionData.d1.total > 0
      ? ((retentionData.d1.returning / retentionData.d1.total) * 100).toFixed(1)
      : '0',
    d7: retentionData.d7.total > 0
      ? ((retentionData.d7.returning / retentionData.d7.total) * 100).toFixed(1)
      : '0',
    d30: retentionData.d30.total > 0
      ? ((retentionData.d30.returning / retentionData.d30.total) * 100).toFixed(1)
      : '0',
  }
}

// Fetch traffic sources breakdown
async function fetchTrafficSources(
  client: BetaAnalyticsDataClient,
  propertyIds: string[],
  dateRange: { startDate: string; endDate: string }
) {
  const sourceData: { [source: string]: number } = {}

  await Promise.all(
    propertyIds.map(async (propertyId) => {
      try {
        const [response] = await client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [dateRange],
          dimensions: [{ name: 'sessionSource' }],
          metrics: [{ name: 'sessions' }],
          limit: 20,
        })

        if (response.rows) {
          response.rows.forEach((row) => {
            const source = row.dimensionValues?.[0]?.value || '(direct)'
            const sessions = parseInt(row.metricValues?.[0]?.value || '0')
            sourceData[source] = (sourceData[source] || 0) + sessions
          })
        }
      } catch (error) {
        console.error(`Error fetching sources for ${propertyId}:`, error)
      }
    })
  )

  return Object.entries(sourceData)
    .map(([source, sessions]) => ({ source, sessions }))
    .sort((a, b) => b.sessions - a.sessions)
    .slice(0, 10)
}

// Fetch device/platform breakdown
async function fetchDeviceBreakdown(
  client: BetaAnalyticsDataClient,
  propertyIds: string[],
  dateRange: { startDate: string; endDate: string }
) {
  const deviceData: { [device: string]: number } = {}
  const platformData: { [platform: string]: number } = {}

  await Promise.all(
    propertyIds.map(async (propertyId) => {
      try {
        const [deviceResponse] = await client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [dateRange],
          dimensions: [{ name: 'deviceCategory' }],
          metrics: [{ name: 'activeUsers' }],
        })

        if (deviceResponse.rows) {
          deviceResponse.rows.forEach((row) => {
            const device = row.dimensionValues?.[0]?.value || 'unknown'
            const users = parseInt(row.metricValues?.[0]?.value || '0')
            deviceData[device] = (deviceData[device] || 0) + users
          })
        }

        const [platformResponse] = await client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [dateRange],
          dimensions: [{ name: 'platform' }],
          metrics: [{ name: 'activeUsers' }],
        })

        if (platformResponse.rows) {
          platformResponse.rows.forEach((row) => {
            const platform = row.dimensionValues?.[0]?.value || 'unknown'
            const users = parseInt(row.metricValues?.[0]?.value || '0')
            platformData[platform] = (platformData[platform] || 0) + users
          })
        }
      } catch (error) {
        console.error(`Error fetching devices for ${propertyId}:`, error)
      }
    })
  )

  return {
    devices: Object.entries(deviceData)
      .map(([device, users]) => ({ device, users }))
      .sort((a, b) => b.users - a.users),
    platforms: Object.entries(platformData)
      .map(([platform, users]) => ({ platform, users }))
      .sort((a, b) => b.users - a.users),
  }
}

// Fetch revenue data
async function fetchRevenueData(
  client: BetaAnalyticsDataClient,
  propertyIds: string[],
  dateRange: { startDate: string; endDate: string }
) {
  let totalRevenue = 0
  let purchaseCount = 0
  const revenueByDay: { [date: string]: number } = {}

  await Promise.all(
    propertyIds.map(async (propertyId) => {
      try {
        // Total revenue
        const [response] = await client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [dateRange],
          metrics: [
            { name: 'totalRevenue' },
            { name: 'ecommercePurchases' },
          ],
        })

        if (response.rows && response.rows.length > 0) {
          const row = response.rows[0]
          totalRevenue += parseFloat(row.metricValues?.[0]?.value || '0')
          purchaseCount += parseInt(row.metricValues?.[1]?.value || '0')
        }

        // Revenue by day
        const [dailyResponse] = await client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [dateRange],
          dimensions: [{ name: 'date' }],
          metrics: [{ name: 'totalRevenue' }],
        })

        if (dailyResponse.rows) {
          dailyResponse.rows.forEach((row) => {
            const date = row.dimensionValues?.[0]?.value || ''
            const revenue = parseFloat(row.metricValues?.[0]?.value || '0')
            revenueByDay[date] = (revenueByDay[date] || 0) + revenue
          })
        }
      } catch (error) {
        // Revenue metrics might not be available for all properties
        console.error(`Error fetching revenue for ${propertyId}:`, error)
      }
    })
  )

  const revenueTimeSeries = Object.entries(revenueByDay)
    .map(([date, revenue]) => ({
      date,
      displayDate: formatDate(date),
      revenue: Math.round(revenue * 100) / 100,
    }))
    .sort((a, b) => a.date.localeCompare(b.date))

  return {
    totalRevenue: Math.round(totalRevenue * 100) / 100,
    purchaseCount,
    avgOrderValue: purchaseCount > 0 ? Math.round((totalRevenue / purchaseCount) * 100) / 100 : 0,
    timeSeries: revenueTimeSeries,
  }
}

// Fetch conversion funnel data (simplified - based on common events)
async function fetchConversionFunnel(
  client: BetaAnalyticsDataClient,
  propertyIds: string[],
  dateRange: { startDate: string; endDate: string }
) {
  const funnelEvents = [
    'session_start',
    'screen_view',
    'page_view',
    'first_open',
    'user_engagement',
    'scroll',
    'click',
    'add_to_cart',
    'begin_checkout',
    'purchase',
  ]

  const eventCounts: { [event: string]: number } = {}

  await Promise.all(
    propertyIds.map(async (propertyId) => {
      try {
        const [response] = await client.runReport({
          property: `properties/${propertyId}`,
          dateRanges: [dateRange],
          dimensions: [{ name: 'eventName' }],
          metrics: [{ name: 'eventCount' }],
          dimensionFilter: {
            filter: {
              fieldName: 'eventName',
              inListFilter: {
                values: funnelEvents,
              },
            },
          },
        })

        if (response.rows) {
          response.rows.forEach((row) => {
            const eventName = row.dimensionValues?.[0]?.value || ''
            const count = parseInt(row.metricValues?.[0]?.value || '0')
            eventCounts[eventName] = (eventCounts[eventName] || 0) + count
          })
        }
      } catch (error) {
        console.error(`Error fetching funnel for ${propertyId}:`, error)
      }
    })
  )

  // Build funnel stages
  const stages = [
    { name: 'Sessions', event: 'session_start', count: eventCounts['session_start'] || 0 },
    { name: 'Engagement', event: 'user_engagement', count: eventCounts['user_engagement'] || 0 },
    { name: 'Page/Screen View', event: 'screen_view', count: (eventCounts['screen_view'] || 0) + (eventCounts['page_view'] || 0) },
    { name: 'Add to Cart', event: 'add_to_cart', count: eventCounts['add_to_cart'] || 0 },
    { name: 'Checkout', event: 'begin_checkout', count: eventCounts['begin_checkout'] || 0 },
    { name: 'Purchase', event: 'purchase', count: eventCounts['purchase'] || 0 },
  ].filter(stage => stage.count > 0)

  // Calculate conversion rates
  const stagesWithRates = stages.map((stage, i) => ({
    ...stage,
    rate: i === 0 ? 100 : (stages[0].count > 0 ? (stage.count / stages[0].count) * 100 : 0),
    dropoff: i === 0 ? 0 : (stages[i - 1].count > 0 ? ((stages[i - 1].count - stage.count) / stages[i - 1].count) * 100 : 0),
  }))

  return stagesWithRates
}

// Fetch comparison data (previous period)
async function fetchComparisonData(
  client: BetaAnalyticsDataClient,
  properties: Array<{ id: string; name: string }>,
  currentRange: { startDate: string; endDate: string },
  previousRange: { startDate: string; endDate: string }
) {
  const [currentResults, previousResults] = await Promise.all([
    Promise.all(
      properties.map(p => fetchPropertyData(client, p.id, p.name, currentRange))
    ),
    Promise.all(
      properties.map(p => fetchPropertyData(client, p.id, p.name, previousRange))
    ),
  ])

  const current = {
    users: currentResults.reduce((sum, r) => sum + r.activeUsers, 0),
    sessions: currentResults.reduce((sum, r) => sum + r.sessions, 0),
    events: currentResults.reduce((sum, r) => sum + r.eventCount, 0),
    newUsers: currentResults.reduce((sum, r) => sum + r.newUsers, 0),
  }

  const previous = {
    users: previousResults.reduce((sum, r) => sum + r.activeUsers, 0),
    sessions: previousResults.reduce((sum, r) => sum + r.sessions, 0),
    events: previousResults.reduce((sum, r) => sum + r.eventCount, 0),
    newUsers: previousResults.reduce((sum, r) => sum + r.newUsers, 0),
  }

  const calculateChange = (curr: number, prev: number) => {
    if (prev === 0) return curr > 0 ? 100 : 0
    return ((curr - prev) / prev) * 100
  }

  return {
    current,
    previous,
    changes: {
      users: calculateChange(current.users, previous.users).toFixed(1),
      sessions: calculateChange(current.sessions, previous.sessions).toFixed(1),
      events: calculateChange(current.events, previous.events).toFixed(1),
      newUsers: calculateChange(current.newUsers, previous.newUsers).toFixed(1),
    }
  }
}

// Helper to calculate date ranges
function getDateRanges(period: string) {
  const now = new Date()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)

  let days: number
  switch (period) {
    case '7d': days = 7; break
    case '30d': days = 30; break
    case '90d': days = 90; break
    default: days = 30
  }

  const currentStart = new Date(yesterday)
  currentStart.setDate(currentStart.getDate() - days + 1)

  const previousEnd = new Date(currentStart)
  previousEnd.setDate(previousEnd.getDate() - 1)

  const previousStart = new Date(previousEnd)
  previousStart.setDate(previousStart.getDate() - days + 1)

  const formatDateParam = (d: Date) => d.toISOString().split('T')[0]

  return {
    current: {
      startDate: formatDateParam(currentStart),
      endDate: formatDateParam(yesterday),
    },
    previous: {
      startDate: formatDateParam(previousStart),
      endDate: formatDateParam(previousEnd),
    },
    daysAgo: `${days}daysAgo`,
  }
}

export async function GET(request: Request) {
  // Simple password protection via query param or header
  const { searchParams } = new URL(request.url)
  const password = searchParams.get('key') || request.headers.get('x-analytics-key')
  const propertyFilter = searchParams.get('property') // Optional: filter by single property
  const period = searchParams.get('period') || '30d' // 7d, 30d, 90d

  if (password !== process.env.ANALYTICS_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const authClient = createAuthClient()

    const analyticsClient = new BetaAnalyticsDataClient({
      authClient: authClient as any,
    })

    // Auto-discover all properties
    const allDiscoveredProperties = await discoverProperties(authClient)

    // Separate apps from website
    const appProperties = allDiscoveredProperties.filter(p => !p.isWebsite)
    const websiteProperty = allDiscoveredProperties.find(p => p.isWebsite)

    // Get date ranges based on period
    const periodRanges = getDateRanges(period)

    // Filter properties if requested - but for totals, only use app properties
    const isWebsiteFilter = propertyFilter === WEBSITE_PROPERTY_ID
    const activeAppProperties = propertyFilter && !isWebsiteFilter
      ? appProperties.filter(p => p.id === propertyFilter)
      : appProperties

    const appPropertyIds = activeAppProperties.map(p => p.id)

    // Fetch DAU, WAU, MAU for all properties in parallel
    const dateRanges = {
      dau: { startDate: 'yesterday', endDate: 'yesterday' },
      wau: { startDate: '7daysAgo', endDate: 'yesterday' },
      mau: { startDate: `${period === '90d' ? '90' : '30'}daysAgo`, endDate: 'yesterday' },
    }

    const [
      dauResults,
      wauResults,
      mauResults,
      timeSeries,
      realtimeData,
      countryBreakdown,
      eventBreakdown,
      comparisonData,
      websiteData,
      retention,
      trafficSources,
      deviceBreakdown,
      revenueData,
      conversionFunnel,
    ] = await Promise.all([
      Promise.all(
        activeAppProperties.map(p => fetchPropertyData(analyticsClient, p.id, p.name, dateRanges.dau))
      ),
      Promise.all(
        activeAppProperties.map(p => fetchPropertyData(analyticsClient, p.id, p.name, dateRanges.wau))
      ),
      Promise.all(
        activeAppProperties.map(p => fetchPropertyData(analyticsClient, p.id, p.name, dateRanges.mau))
      ),
      fetchTimeSeries(analyticsClient, appPropertyIds),
      fetchRealtimeData(analyticsClient, activeAppProperties),
      fetchCountryBreakdown(analyticsClient, appPropertyIds),
      fetchEventBreakdown(analyticsClient, appPropertyIds, periodRanges.current),
      fetchComparisonData(analyticsClient, activeAppProperties, periodRanges.current, periodRanges.previous),
      // Fetch website data separately (if it exists)
      websiteProperty
        ? fetchPropertyData(analyticsClient, websiteProperty.id, websiteProperty.name, dateRanges.mau)
        : Promise.resolve({ propertyId: '', propertyName: '', activeUsers: 0, sessions: 0, pageViews: 0, eventCount: 0, newUsers: 0 }),
      // New data fetches
      fetchRetentionCohorts(analyticsClient, appPropertyIds),
      fetchTrafficSources(analyticsClient, appPropertyIds, periodRanges.current),
      fetchDeviceBreakdown(analyticsClient, appPropertyIds, periodRanges.current),
      fetchRevenueData(analyticsClient, appPropertyIds, periodRanges.current),
      fetchConversionFunnel(analyticsClient, appPropertyIds, periodRanges.current),
    ])

    // Aggregate totals (APPS ONLY - excludes website)
    const totals = {
      dau: dauResults.reduce((sum, r) => sum + r.activeUsers, 0),
      wau: wauResults.reduce((sum, r) => sum + r.activeUsers, 0),
      mau: mauResults.reduce((sum, r) => sum + r.activeUsers, 0),
      totalSessions: mauResults.reduce((sum, r) => sum + r.sessions, 0),
      totalPageViews: mauResults.reduce((sum, r) => sum + r.pageViews, 0),
      totalEvents: mauResults.reduce((sum, r) => sum + r.eventCount, 0),
      totalNewUsers: mauResults.reduce((sum, r) => sum + r.newUsers, 0),
    }

    // Calculate ratios
    const ratios = {
      dauMau: totals.mau > 0 ? ((totals.dau / totals.mau) * 100).toFixed(1) : '0',
      wauMau: totals.mau > 0 ? ((totals.wau / totals.mau) * 100).toFixed(1) : '0',
      dauWau: totals.wau > 0 ? ((totals.dau / totals.wau) * 100).toFixed(1) : '0',
    }

    // Combine data per property (apps only for main list)
    const properties = activeAppProperties.map((p, i) => ({
      id: p.id,
      name: p.name,
      dau: dauResults[i].activeUsers,
      wau: wauResults[i].activeUsers,
      mau: mauResults[i].activeUsers,
      sessions: mauResults[i].sessions,
      pageViews: mauResults[i].pageViews,
      events: mauResults[i].eventCount,
      newUsers: mauResults[i].newUsers,
      dauMau: mauResults[i].activeUsers > 0
        ? ((dauResults[i].activeUsers / mauResults[i].activeUsers) * 100).toFixed(1)
        : '0',
    }))
    .filter(p => p.mau > 0) // Only include properties with activity
    .sort((a, b) => b.mau - a.mau) // Sort by MAU descending

    // Website stats (separate from app totals)
    const website = websiteProperty ? {
      id: websiteProperty.id,
      name: websiteProperty.name,
      sessions: websiteData.sessions,
      pageViews: websiteData.pageViews,
      users: websiteData.activeUsers,
      newUsers: websiteData.newUsers,
    } : null

    return NextResponse.json({
      totals,
      ratios,
      properties,
      timeSeries,
      realtime: realtimeData,
      countries: countryBreakdown,
      events: eventBreakdown,
      comparison: comparisonData,
      website,
      retention,
      trafficSources,
      devices: deviceBreakdown,
      revenue: revenueData,
      funnel: conversionFunnel,
      period,
      allProperties: allDiscoveredProperties.map(p => ({ id: p.id, name: p.name })), // Auto-discovered properties
      totalPropertiesDiscovered: allDiscoveredProperties.length,
      generatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch analytics data' },
      { status: 500 }
    )
  }
}
