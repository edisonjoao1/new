import { NextResponse } from 'next/server'
import { BetaAnalyticsDataClient } from '@google-analytics/data'
import { OAuth2Client } from 'google-auth-library'

// All your GA4 property IDs
const PROPERTY_IDS = [
  { id: '170914780', name: 'foxie' },
  { id: '207666379', name: 'ubss-8a0de' },
  { id: '212918036', name: 'foxiegram-36486' },
  { id: '238360078', name: 'foxie-s-gram' },
  { id: '338170824', name: 'backtoit-bd128' },
  { id: '355152962', name: 'acti-8078e' },
  { id: '372035116', name: 'foxie website - GA4' },
  { id: '454318012', name: 'budd-74c57' },
  { id: '459749735', name: 'flutter-66d7d' },
  { id: '470854408', name: 'live-5f8ee' },
  { id: '485516557', name: 'image-c34f8' },
  { id: '486642898', name: 'inteligencia-artificial-57923' },
  { id: '488396770', name: 'inteligencia-artificial-6a543' },
  { id: '489264320', name: 'meta-6cbb4' },
  { id: '489713800', name: 'ai-brasil-efbf1' },
  { id: '489973752', name: 'intelligence-artificiel-a25eb' },
  { id: '490607972', name: 'love-79ab4' },
  { id: '516377149', name: 'pet-health-scan' },
  { id: '516390325', name: 'pet-health-scan-30111' },
  { id: '516392560', name: 'days-together--love-tracker' },
  { id: '516587460', name: 'relationship-62b68' },
  { id: '517168745', name: 'unbiased-65e60' },
  { id: '517994143', name: 'health-anxiety-e3780' },
  { id: '518113043', name: 'new-year-new-you-f2e4e' },
]

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
  propertyIds: string[]
) {
  let totalActiveUsers = 0
  const countryData: { [country: string]: number } = {}

  await Promise.all(
    propertyIds.map(async (propertyId) => {
      try {
        const [response] = await client.runRealtimeReport({
          property: `properties/${propertyId}`,
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'activeUsers' }],
        })

        if (response.rows) {
          response.rows.forEach((row) => {
            const country = row.dimensionValues?.[0]?.value || 'Unknown'
            const users = parseInt(row.metricValues?.[0]?.value || '0')
            totalActiveUsers += users
            countryData[country] = (countryData[country] || 0) + users
          })
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

  return {
    activeUsers: totalActiveUsers,
    topCountries,
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

export async function GET(request: Request) {
  // Simple password protection via query param or header
  const { searchParams } = new URL(request.url)
  const password = searchParams.get('key') || request.headers.get('x-analytics-key')
  const propertyFilter = searchParams.get('property') // Optional: filter by single property

  if (password !== process.env.ANALYTICS_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const authClient = createAuthClient()

    const analyticsClient = new BetaAnalyticsDataClient({
      authClient: authClient as any,
    })

    // Filter properties if requested
    const activeProperties = propertyFilter
      ? PROPERTY_IDS.filter(p => p.id === propertyFilter)
      : PROPERTY_IDS

    const propertyIdList = activeProperties.map(p => p.id)

    // Fetch DAU, WAU, MAU for all properties in parallel
    const dateRanges = {
      dau: { startDate: 'yesterday', endDate: 'yesterday' },
      wau: { startDate: '7daysAgo', endDate: 'yesterday' },
      mau: { startDate: '30daysAgo', endDate: 'yesterday' },
    }

    const [dauResults, wauResults, mauResults, timeSeries, realtimeData, countryBreakdown] = await Promise.all([
      Promise.all(
        activeProperties.map(p => fetchPropertyData(analyticsClient, p.id, p.name, dateRanges.dau))
      ),
      Promise.all(
        activeProperties.map(p => fetchPropertyData(analyticsClient, p.id, p.name, dateRanges.wau))
      ),
      Promise.all(
        activeProperties.map(p => fetchPropertyData(analyticsClient, p.id, p.name, dateRanges.mau))
      ),
      fetchTimeSeries(analyticsClient, propertyIdList),
      fetchRealtimeData(analyticsClient, propertyIdList),
      fetchCountryBreakdown(analyticsClient, propertyIdList),
    ])

    // Aggregate totals
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

    // Combine data per property
    const properties = activeProperties.map((p, i) => ({
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

    return NextResponse.json({
      totals,
      ratios,
      properties,
      timeSeries,
      realtime: realtimeData,
      countries: countryBreakdown,
      allProperties: PROPERTY_IDS, // For the filter dropdown
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
