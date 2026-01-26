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

// Fetch realtime data - lightweight endpoint for frequent polling
async function fetchRealtimeData(
  client: BetaAnalyticsDataClient,
  properties: Array<{ id: string; name: string }>
) {
  let totalActiveUsers = 0
  const countryData: { [country: string]: number } = {}
  const appData: { [appName: string]: number } = {}
  const minuteData: number[] = new Array(30).fill(0) // Last 30 minutes breakdown

  await Promise.all(
    properties.map(async ({ id: propertyId, name: propertyName }) => {
      try {
        // Get active users by country
        const [countryResponse] = await client.runRealtimeReport({
          property: `properties/${propertyId}`,
          dimensions: [{ name: 'country' }],
          metrics: [{ name: 'activeUsers' }],
        })

        let propertyUsers = 0
        if (countryResponse.rows) {
          countryResponse.rows.forEach((row) => {
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

        // Get minute-level breakdown for activity graph
        try {
          const [minuteResponse] = await client.runRealtimeReport({
            property: `properties/${propertyId}`,
            dimensions: [{ name: 'minutesAgo' }],
            metrics: [{ name: 'activeUsers' }],
          })

          if (minuteResponse.rows) {
            minuteResponse.rows.forEach((row) => {
              const minutesAgo = parseInt(row.dimensionValues?.[0]?.value || '0')
              const users = parseInt(row.metricValues?.[0]?.value || '0')
              if (minutesAgo >= 0 && minutesAgo < 30) {
                minuteData[minutesAgo] += users
              }
            })
          }
        } catch {
          // Minute-level data might not be available for all properties
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
    minuteData: minuteData.reverse(), // Oldest first for charting
    updatedAt: new Date().toISOString(),
  }
}

export async function GET(request: Request) {
  // Simple password protection via query param or header
  const { searchParams } = new URL(request.url)
  const password = searchParams.get('key') || request.headers.get('x-analytics-key')

  if (password !== process.env.ANALYTICS_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const authClient = createAuthClient()

    const analyticsClient = new BetaAnalyticsDataClient({
      authClient: authClient as any,
    })

    // Auto-discover all properties (cached)
    const allProperties = await discoverProperties(authClient)

    // Filter to app properties only (exclude website)
    const appProperties = allProperties.filter(p => !p.isWebsite)

    // Fetch realtime data
    const realtimeData = await fetchRealtimeData(analyticsClient, appProperties)

    return NextResponse.json(realtimeData, {
      headers: {
        // Allow caching for 10 seconds to reduce API calls
        'Cache-Control': 'public, max-age=10, stale-while-revalidate=20',
      },
    })
  } catch (error) {
    console.error('Realtime API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch realtime data' },
      { status: 500 }
    )
  }
}
