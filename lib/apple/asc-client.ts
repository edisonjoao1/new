import * as crypto from 'crypto'
import * as zlib from 'zlib'

// ASC API configuration
const ASC_BASE_URL = 'https://api.appstoreconnect.apple.com'

interface ASCConfig {
  keyId: string
  issuerId: string
  privateKey: string
  vendorNumber: string
}

function getASCConfig(): ASCConfig {
  const keyId = process.env.ASC_KEY_ID
  const issuerId = process.env.ASC_ISSUER_ID
  const privateKey = process.env.ASC_PRIVATE_KEY
  const vendorNumber = process.env.ASC_VENDOR_NUMBER

  if (!keyId || !issuerId || !privateKey || !vendorNumber) {
    throw new Error('Missing ASC environment variables: ASC_KEY_ID, ASC_ISSUER_ID, ASC_PRIVATE_KEY, ASC_VENDOR_NUMBER')
  }

  return { keyId, issuerId, privateKey, vendorNumber }
}

// Generate ASC JWT token (ES256)
function generateASCToken(config: ASCConfig): string {
  const now = Math.floor(Date.now() / 1000)

  const header = {
    alg: 'ES256',
    kid: config.keyId,
    typ: 'JWT',
  }

  const payload = {
    iss: config.issuerId,
    aud: 'appstoreconnect-v1',
    exp: now + 20 * 60, // 20 minutes
    iat: now,
  }

  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64url')
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signingInput = `${headerB64}.${payloadB64}`

  // The private key may be stored as a single-line string with \n literals
  const formattedKey = config.privateKey.replace(/\\n/g, '\n')

  const sign = crypto.createSign('SHA256')
  sign.update(signingInput)
  const signature = sign.sign(
    { key: formattedKey, dsaEncoding: 'ieee-p1363' },
  )

  const signatureB64 = signature.toString('base64url')
  return `${headerB64}.${payloadB64}.${signatureB64}`
}

// Decompress gzip buffer
function gunzip(buffer: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    zlib.gunzip(buffer, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}

// Parse TSV string into array of objects
function parseTSV(tsv: string): Record<string, string>[] {
  const lines = tsv.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split('\t').map(h => h.trim())
  return lines.slice(1).map(line => {
    const values = line.split('\t')
    const record: Record<string, string> = {}
    headers.forEach((header, i) => {
      record[header] = (values[i] || '').trim()
    })
    return record
  })
}

export interface SalesRecord {
  provider: string
  sku: string
  title: string
  productTypeIdentifier: string
  units: number
  developerProceeds: number
  customerPrice: number
  customerCurrency: string
  countryCode: string
  subscription: string // "New" | "Renewal" | ""
  period: string // "7 Days" | "1 Month" | "1 Year" | ""
  beginDate: string
  endDate: string
}

export interface RevenueData {
  date: string
  mrr: number
  revenueThisMonth: number
  activeSubscribers: number
  trialConversions: number
  refunds: number
  newSubscriptions: number
  renewals: number
  byProduct: Record<string, { revenue: number; units: number }>
  byPeriod: Record<string, { revenue: number; units: number }>
  dailyTimeline: { date: string; revenue: number; units: number }[]
}

// Fetch a sales report from ASC
async function fetchSalesReport(
  config: ASCConfig,
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY',
  reportDate?: string
): Promise<SalesRecord[]> {
  const token = generateASCToken(config)

  const params = new URLSearchParams({
    'filter[reportType]': 'SALES',
    'filter[reportSubType]': 'SUMMARY',
    'filter[frequency]': frequency,
    'filter[vendorNumber]': config.vendorNumber,
    'filter[version]': '1_3',
  })

  if (reportDate) {
    params.set('filter[reportDate]', reportDate)
  }

  const response = await fetch(`${ASC_BASE_URL}/v1/salesReports?${params}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/a-gzip',
    },
  })

  if (!response.ok) {
    const text = await response.text()
    // 404 means no data for that date (common for today)
    if (response.status === 404) return []
    throw new Error(`ASC API error ${response.status}: ${text}`)
  }

  const buffer = Buffer.from(await response.arrayBuffer())
  const decompressed = await gunzip(buffer)
  const tsv = decompressed.toString('utf8')
  const records = parseTSV(tsv)

  return records.map(r => ({
    provider: r['Provider'] || '',
    sku: r['SKU'] || '',
    title: r['Title'] || '',
    productTypeIdentifier: r['Product Type Identifier'] || '',
    units: parseFloat(r['Units'] || '0'),
    developerProceeds: parseFloat(r['Developer Proceeds'] || '0'),
    customerPrice: parseFloat(r['Customer Price'] || '0'),
    customerCurrency: r['Customer Currency'] || 'USD',
    countryCode: r['Country Code'] || '',
    subscription: r['Subscription'] || '',
    period: r['Period'] || '',
    beginDate: r['Begin Date'] || '',
    endDate: r['End Date'] || '',
  }))
}

// Calculate revenue metrics from sales records
function calculateRevenue(records: SalesRecord[]): {
  totalRevenue: number
  totalUnits: number
  newSubs: number
  renewals: number
  refunds: number
  byProduct: Record<string, { revenue: number; units: number }>
  byPeriod: Record<string, { revenue: number; units: number }>
} {
  let totalRevenue = 0
  let totalUnits = 0
  let newSubs = 0
  let renewals = 0
  let refunds = 0
  const byProduct: Record<string, { revenue: number; units: number }> = {}
  const byPeriod: Record<string, { revenue: number; units: number }> = {}

  for (const r of records) {
    // Only count auto-renewable subscription types (IA1, IA9, IAY)
    // Product Type Identifier: IA1 = auto-renewable sub (new), IA9 = renewal, IAY = free trial
    const isSubscription = ['IA1', 'IA9', 'IAY', '1F'].includes(r.productTypeIdentifier) || r.subscription !== ''

    if (!isSubscription) continue

    const revenue = r.developerProceeds * r.units
    totalRevenue += revenue
    totalUnits += r.units

    if (r.units < 0) {
      refunds += Math.abs(r.units)
    } else if (r.subscription === 'New') {
      newSubs += r.units
    } else if (r.subscription === 'Renewal') {
      renewals += r.units
    }

    // By product (SKU)
    if (!byProduct[r.sku]) byProduct[r.sku] = { revenue: 0, units: 0 }
    byProduct[r.sku].revenue += revenue
    byProduct[r.sku].units += r.units

    // By period
    const period = r.period || 'Unknown'
    if (!byPeriod[period]) byPeriod[period] = { revenue: 0, units: 0 }
    byPeriod[period].revenue += revenue
    byPeriod[period].units += r.units
  }

  return { totalRevenue, totalUnits, newSubs, renewals, refunds, byProduct, byPeriod }
}

// Estimate MRR from subscription period breakdown
function estimateMRR(byPeriod: Record<string, { revenue: number; units: number }>): number {
  let mrr = 0
  for (const [period, data] of Object.entries(byPeriod)) {
    const monthlyEquivalent = data.revenue > 0 ? data.revenue : 0
    if (period.includes('7 Days') || period.includes('Week')) {
      mrr += monthlyEquivalent * 4.33 // Weekly → monthly
    } else if (period.includes('1 Month') || period.includes('Month')) {
      mrr += monthlyEquivalent // Monthly as-is
    } else if (period.includes('1 Year') || period.includes('Year')) {
      mrr += monthlyEquivalent / 12 // Yearly → monthly
    } else if (period.includes('3 Month')) {
      mrr += monthlyEquivalent / 3
    } else if (period.includes('6 Month')) {
      mrr += monthlyEquivalent / 6
    } else {
      mrr += monthlyEquivalent // Unknown, treat as monthly
    }
  }
  return Math.round(mrr * 100) / 100
}

// Fetch revenue data for a date range
export async function fetchRevenueData(days: number = 30): Promise<RevenueData> {
  const config = getASCConfig()

  const now = new Date()
  const dailyTimeline: { date: string; revenue: number; units: number }[] = []
  let totalRevenue = 0
  let totalNewSubs = 0
  let totalRenewals = 0
  let totalRefunds = 0
  let activeSubscribers = 0
  const allByProduct: Record<string, { revenue: number; units: number }> = {}
  const allByPeriod: Record<string, { revenue: number; units: number }> = {}

  // Fetch daily reports for the range
  // ASC daily reports are available next day, so start from 2 days ago
  const fetchDays = Math.min(days, 30) // Limit to 30 days to avoid rate limits
  const errors: string[] = []

  for (let i = 2; i <= fetchDays + 1; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split('T')[0]

    try {
      const records = await fetchSalesReport(config, 'DAILY', dateStr)
      const metrics = calculateRevenue(records)

      dailyTimeline.push({
        date: dateStr,
        revenue: Math.round(metrics.totalRevenue * 100) / 100,
        units: metrics.totalUnits,
      })

      totalRevenue += metrics.totalRevenue
      totalNewSubs += metrics.newSubs
      totalRenewals += metrics.renewals
      totalRefunds += metrics.refunds

      for (const [sku, data] of Object.entries(metrics.byProduct)) {
        if (!allByProduct[sku]) allByProduct[sku] = { revenue: 0, units: 0 }
        allByProduct[sku].revenue += data.revenue
        allByProduct[sku].units += data.units
      }
      for (const [period, data] of Object.entries(metrics.byPeriod)) {
        if (!allByPeriod[period]) allByPeriod[period] = { revenue: 0, units: 0 }
        allByPeriod[period].revenue += data.revenue
        allByPeriod[period].units += data.units
      }
    } catch (err) {
      // Skip dates with no data (weekends, too recent, etc.)
      errors.push(`${dateStr}: ${err instanceof Error ? err.message : 'Unknown'}`)
    }
  }

  // Sort timeline chronologically
  dailyTimeline.sort((a, b) => a.date.localeCompare(b.date))

  // Estimate MRR from the last available period data
  const mrr = estimateMRR(allByPeriod)

  // Active subscribers = new + renewals - refunds (rough estimate)
  activeSubscribers = totalNewSubs + totalRenewals - totalRefunds

  // Revenue this month = filter to current month only
  const currentMonth = now.toISOString().slice(0, 7) // YYYY-MM
  const revenueThisMonth = dailyTimeline
    .filter(d => d.date.startsWith(currentMonth))
    .reduce((sum, d) => sum + d.revenue, 0)

  return {
    date: now.toISOString(),
    mrr,
    revenueThisMonth: Math.round(revenueThisMonth * 100) / 100,
    activeSubscribers,
    trialConversions: totalNewSubs,
    refunds: totalRefunds,
    newSubscriptions: totalNewSubs,
    renewals: totalRenewals,
    byProduct: allByProduct,
    byPeriod: allByPeriod,
    dailyTimeline,
  }
}
