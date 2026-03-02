import { NextRequest, NextResponse } from 'next/server'
import { fetchRevenueData, RevenueData } from '@/lib/apple/asc-client'
import { getFirestoreDb } from '@/lib/firebase/admin'

const ANALYTICS_PASSWORD = process.env.ANALYTICS_PASSWORD

// Simple in-memory cache with 30-minute TTL
let cachedRevenue: RevenueData | null = null
let cacheTimestamp = 0
const CACHE_TTL = 30 * 60 * 1000 // 30 minutes

export async function GET(request: NextRequest) {
  const key = request.nextUrl.searchParams.get('key')
  if (key !== ANALYTICS_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const range = request.nextUrl.searchParams.get('range') || '30d'
  const days = parseInt(range.replace('d', '')) || 30

  try {
    // Check memory cache
    const now = Date.now()
    if (cachedRevenue && (now - cacheTimestamp) < CACHE_TTL) {
      return NextResponse.json(cachedRevenue)
    }

    // Check Firestore cache for today
    const db = getFirestoreDb()
    const today = new Date().toISOString().split('T')[0]
    const cacheDoc = await db.collection('asc_revenue').doc(today).get()

    if (cacheDoc.exists) {
      const data = cacheDoc.data() as RevenueData
      // If cached data is less than 30 min old, use it
      const cachedAt = new Date(data.date).getTime()
      if ((now - cachedAt) < CACHE_TTL) {
        cachedRevenue = data
        cacheTimestamp = now
        return NextResponse.json(data)
      }
    }

    // Fetch fresh data from ASC
    const revenue = await fetchRevenueData(days)

    // Cache to Firestore
    await db.collection('asc_revenue').doc(today).set(revenue)

    // Cache in memory
    cachedRevenue = revenue
    cacheTimestamp = now

    return NextResponse.json(revenue)
  } catch (error) {
    console.error('ASC revenue error:', error)

    // If we have stale cache, return it with a warning
    if (cachedRevenue) {
      return NextResponse.json({ ...cachedRevenue, warning: 'Using cached data due to fetch error' })
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch revenue data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const key = request.nextUrl.searchParams.get('key') || body?.key
    if (key !== ANALYTICS_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (body?.action === 'refresh') {
      // Force refresh — clear cache and re-fetch
      cachedRevenue = null
      cacheTimestamp = 0

      const days = body?.days || 30
      const revenue = await fetchRevenueData(days)

      const db = getFirestoreDb()
      const today = new Date().toISOString().split('T')[0]
      await db.collection('asc_revenue').doc(today).set(revenue)

      cachedRevenue = revenue
      cacheTimestamp = Date.now()

      return NextResponse.json({ refreshed: true, ...revenue })
    }

    return NextResponse.json({ error: 'Use action: refresh' }, { status: 400 })
  } catch (error) {
    console.error('ASC revenue refresh error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to refresh revenue data' },
      { status: 500 }
    )
  }
}
