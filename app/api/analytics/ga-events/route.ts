import { NextRequest, NextResponse } from 'next/server'

/**
 * Google Analytics 4 Data API - Detailed Event Analytics
 * Fetches event parameters with full detail (latency, endpoints, errors, etc.)
 */

// GA4 Property ID for Inteligencia Artificial Gratis (Spanish app)
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || '488396770'

interface GACredentials {
  access_token: string
  expires_in: number
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

  const data: GACredentials = await response.json()
  return data.access_token
}

async function runGAReport(accessToken: string, request: any) {
  const response = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`,
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

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')
  const eventName = searchParams.get('event') || 'api_latency'
  const days = parseInt(searchParams.get('days') || '7')

  const validKey = process.env.ANALYTICS_PASSWORD
  if (!key || key !== validKey) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const accessToken = await getAccessToken()

    // Calculate date range
    const endDate = new Date()
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const formatDate = (d: Date) => d.toISOString().split('T')[0]

    // Fetch event counts by parameter value
    const eventReport = await runGAReport(accessToken, {
      dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
      dimensions: [
        { name: 'eventName' },
        { name: 'customEvent:endpoint' }, // For api_latency events
      ],
      metrics: [
        { name: 'eventCount' },
        { name: 'eventValue' }, // Often contains latency
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: eventName,
            matchType: 'EXACT',
          },
        },
      },
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 100,
    })

    // Fetch latency distribution if it's api_latency event
    let latencyReport = null
    if (eventName === 'api_latency') {
      latencyReport = await runGAReport(accessToken, {
        dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
        dimensions: [
          { name: 'customEvent:endpoint' },
        ],
        metrics: [
          { name: 'eventCount' },
          { name: 'eventValue' }, // Sum of latency values
        ],
        dimensionFilter: {
          filter: {
            fieldName: 'eventName',
            stringFilter: {
              value: 'api_latency',
              matchType: 'EXACT',
            },
          },
        },
        orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
        limit: 50,
      })
    }

    // Fetch timeline data
    const timelineReport = await runGAReport(accessToken, {
      dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
      dimensions: [
        { name: 'date' },
        { name: 'eventName' },
      ],
      metrics: [
        { name: 'eventCount' },
      ],
      dimensionFilter: {
        filter: {
          fieldName: 'eventName',
          stringFilter: {
            value: eventName,
            matchType: 'EXACT',
          },
        },
      },
      orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
    })

    // Process results
    const byEndpoint = eventReport.rows?.map((row: any) => ({
      endpoint: row.dimensionValues?.[1]?.value || 'unknown',
      count: parseInt(row.metricValues?.[0]?.value || '0'),
      totalLatency: parseInt(row.metricValues?.[1]?.value || '0'),
    })) || []

    const timeline = timelineReport.rows?.map((row: any) => ({
      date: row.dimensionValues?.[0]?.value,
      count: parseInt(row.metricValues?.[0]?.value || '0'),
    })) || []

    // Calculate avg latency per endpoint
    const endpointStats = byEndpoint.map((e: any) => ({
      ...e,
      avgLatency: e.count > 0 ? Math.round(e.totalLatency / e.count) : 0,
    }))

    return NextResponse.json({
      event: eventName,
      dateRange: {
        start: formatDate(startDate),
        end: formatDate(endDate),
      },
      summary: {
        totalEvents: byEndpoint.reduce((sum: number, e: any) => sum + e.count, 0),
        uniqueEndpoints: byEndpoint.length,
      },
      byEndpoint: endpointStats,
      timeline,
      generatedAt: new Date().toISOString(),
    })

  } catch (error) {
    console.error('GA Events API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch GA data' },
      { status: 500 }
    )
  }
}
