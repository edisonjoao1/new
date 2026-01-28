import { NextRequest, NextResponse } from 'next/server'

/**
 * Google Analytics 4 Data API - Event Analytics
 * Fetches event data from GA4
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

async function getCustomDimensions(accessToken: string, propertyId: string) {
  const response = await fetch(
    `https://analyticsadmin.googleapis.com/v1beta/properties/${propertyId}/customDimensions`,
    {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    }
  )

  if (!response.ok) {
    return [] // Return empty if no custom dimensions
  }

  const data = await response.json()
  return data.customDimensions || []
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const key = searchParams.get('key')
  const eventName = searchParams.get('event')
  const days = parseInt(searchParams.get('days') || '7')
  const propertyId = searchParams.get('propertyId') || GA4_PROPERTY_ID

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

    // Get custom dimensions for this property
    const customDimensions = await getCustomDimensions(accessToken, propertyId)

    // Build dimensions array - use custom dimensions if available
    const dimensions: { name: string }[] = [{ name: 'eventName' }]

    // Check for endpoint custom dimension
    const endpointDim = customDimensions.find((d: any) =>
      d.parameterName === 'endpoint' || d.displayName?.toLowerCase().includes('endpoint')
    )
    if (endpointDim) {
      dimensions.push({ name: `customEvent:${endpointDim.parameterName}` })
    }

    // If a specific event is requested, filter by it
    const dimensionFilter = eventName ? {
      filter: {
        fieldName: 'eventName',
        stringFilter: {
          value: eventName,
          matchType: 'EXACT',
        },
      },
    } : undefined

    // Fetch event report
    const eventReport = await runGAReport(accessToken, propertyId, {
      dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
      dimensions,
      metrics: [
        { name: 'eventCount' },
        { name: 'eventValue' },
      ],
      dimensionFilter,
      orderBys: [{ metric: { metricName: 'eventCount' }, desc: true }],
      limit: 100,
    })

    // Fetch timeline data
    const timelineReport = await runGAReport(accessToken, propertyId, {
      dateRanges: [{ startDate: formatDate(startDate), endDate: formatDate(endDate) }],
      dimensions: [
        { name: 'date' },
        { name: 'eventName' },
      ],
      metrics: [
        { name: 'eventCount' },
        { name: 'eventValue' },
      ],
      dimensionFilter,
      orderBys: [{ dimension: { dimensionName: 'date' }, desc: false }],
      limit: 100,
    })

    // Process event results
    const events = eventReport.rows?.map((row: any) => {
      const result: any = {
        eventName: row.dimensionValues?.[0]?.value || 'unknown',
        count: parseInt(row.metricValues?.[0]?.value || '0'),
        totalValue: parseFloat(row.metricValues?.[1]?.value || '0'),
      }

      // Add endpoint if we have it
      if (dimensions.length > 1) {
        result.endpoint = row.dimensionValues?.[1]?.value || 'unknown'
      }

      // Calculate avg value (e.g., avg latency)
      result.avgValue = result.count > 0 ? Math.round(result.totalValue / result.count) : 0

      return result
    }) || []

    // Process timeline
    const timeline = timelineReport.rows?.map((row: any) => ({
      date: row.dimensionValues?.[0]?.value,
      eventName: row.dimensionValues?.[1]?.value,
      count: parseInt(row.metricValues?.[0]?.value || '0'),
      totalValue: parseFloat(row.metricValues?.[1]?.value || '0'),
    })) || []

    // Summary stats
    const totalEvents = events.reduce((sum: number, e: any) => sum + e.count, 0)
    const totalValue = events.reduce((sum: number, e: any) => sum + e.totalValue, 0)
    const uniqueEvents = new Set(events.map((e: any) => e.eventName)).size

    return NextResponse.json({
      propertyId,
      eventFilter: eventName || 'all',
      dateRange: {
        start: formatDate(startDate),
        end: formatDate(endDate),
      },
      summary: {
        totalEvents,
        totalValue: Math.round(totalValue),
        avgValuePerEvent: totalEvents > 0 ? Math.round(totalValue / totalEvents) : 0,
        uniqueEvents,
      },
      events,
      timeline,
      customDimensions: customDimensions.map((d: any) => ({
        name: d.displayName,
        parameterName: d.parameterName,
        scope: d.scope,
      })),
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
