'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from 'recharts'

// Types
interface TrendDataPoint {
  date: string
  displayDate: string
  qualityScore: number
  conversations: number
  avgResponseLength: number
  deepConversations: number
  issues: number
  previousScore?: number
}

interface QualityTrendsChartProps {
  historyData: {
    id: string
    generatedAt: string
    createdAt?: string
    aiMetrics: {
      totalConversations: number
      avgResponseLength: number
      conversationDepth: {
        shallow: number
        moderate: number
        deep: number
      }
    }
    insights: {
      type: 'positive' | 'negative' | 'neutral'
    }[]
    // AI Quality Score (if available from GPT analysis)
    qualityScore?: number
  }[]
  isDark: boolean
  onPointClick?: (dataPoint: TrendDataPoint) => void
}

// Calculate a quality score from metrics if not provided
function calculateQualityScore(item: QualityTrendsChartProps['historyData'][0]): number {
  if (item.qualityScore) return item.qualityScore

  // Derive score from available metrics
  const { aiMetrics, insights } = item
  let score = 50 // Base score

  // Conversation depth bonus (deeper = better)
  const totalDepth = aiMetrics.conversationDepth.shallow + aiMetrics.conversationDepth.moderate + aiMetrics.conversationDepth.deep
  if (totalDepth > 0) {
    const deepRatio = aiMetrics.conversationDepth.deep / totalDepth
    const moderateRatio = aiMetrics.conversationDepth.moderate / totalDepth
    score += deepRatio * 25 + moderateRatio * 15
  }

  // Response length scoring (optimal is 100-400 chars)
  const avgLen = aiMetrics.avgResponseLength
  if (avgLen >= 100 && avgLen <= 400) {
    score += 15
  } else if (avgLen >= 50 && avgLen <= 600) {
    score += 8
  }

  // Insights impact
  const positiveInsights = insights.filter(i => i.type === 'positive').length
  const negativeInsights = insights.filter(i => i.type === 'negative').length
  score += positiveInsights * 3
  score -= negativeInsights * 5

  return Math.min(100, Math.max(0, Math.round(score)))
}

export default function QualityTrendsChart({
  historyData,
  isDark,
  onPointClick,
}: QualityTrendsChartProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d')
  const [hoveredPoint, setHoveredPoint] = useState<TrendDataPoint | null>(null)
  const [showInsightBands, setShowInsightBands] = useState(true)

  // Transform history data into chart format
  const chartData = useMemo(() => {
    const sorted = [...historyData].sort(
      (a, b) => new Date(a.createdAt || a.generatedAt).getTime() - new Date(b.createdAt || b.generatedAt).getTime()
    )

    // Filter by time range
    const now = new Date()
    const filtered = sorted.filter(item => {
      const date = new Date(item.createdAt || item.generatedAt)
      if (timeRange === '7d') {
        return now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000
      }
      if (timeRange === '30d') {
        return now.getTime() - date.getTime() <= 30 * 24 * 60 * 60 * 1000
      }
      return true
    })

    return filtered.map((item, index) => {
      const date = new Date(item.createdAt || item.generatedAt)
      const qualityScore = calculateQualityScore(item)
      const negativeIssues = item.insights.filter(i => i.type === 'negative').length

      return {
        date: date.toISOString(),
        displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        qualityScore,
        conversations: item.aiMetrics.totalConversations,
        avgResponseLength: Math.round(item.aiMetrics.avgResponseLength),
        deepConversations: item.aiMetrics.conversationDepth.deep,
        issues: negativeIssues,
        previousScore: index > 0 ? calculateQualityScore(filtered[index - 1]) : undefined,
      }
    })
  }, [historyData, timeRange])

  // Calculate trend statistics
  const trendStats = useMemo(() => {
    if (chartData.length < 2) return null

    const latest = chartData[chartData.length - 1]
    const previous = chartData[chartData.length - 2]
    const first = chartData[0]

    const recentChange = latest.qualityScore - previous.qualityScore
    const overallChange = latest.qualityScore - first.qualityScore
    const avgScore = chartData.reduce((sum, d) => sum + d.qualityScore, 0) / chartData.length

    // Calculate volatility (standard deviation)
    const variance = chartData.reduce((sum, d) => sum + Math.pow(d.qualityScore - avgScore, 2), 0) / chartData.length
    const volatility = Math.sqrt(variance)

    // Trend direction
    let trend: 'improving' | 'declining' | 'stable' = 'stable'
    if (overallChange > 5) trend = 'improving'
    else if (overallChange < -5) trend = 'declining'

    return {
      currentScore: latest.qualityScore,
      recentChange,
      overallChange,
      avgScore: Math.round(avgScore),
      volatility: Math.round(volatility),
      trend,
      dataPoints: chartData.length,
    }
  }, [chartData])

  // Score color based on value
  const getScoreColor = (score: number) => {
    if (score >= 80) return isDark ? '#22c55e' : '#16a34a' // Green
    if (score >= 60) return isDark ? '#eab308' : '#ca8a04' // Yellow
    return isDark ? '#ef4444' : '#dc2626' // Red
  }

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0].payload as TrendDataPoint
    const changeFromPrevious = data.previousScore !== undefined
      ? data.qualityScore - data.previousScore
      : null

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg shadow-xl border ${
          isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
        }`}
      >
        <p className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {data.displayDate}
        </p>
        <div className="space-y-1.5 text-sm">
          <div className="flex items-center justify-between gap-4">
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Quality Score</span>
            <span className="font-bold" style={{ color: getScoreColor(data.qualityScore) }}>
              {data.qualityScore}
              {changeFromPrevious !== null && (
                <span className={`ml-1 text-xs ${changeFromPrevious >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ({changeFromPrevious >= 0 ? '+' : ''}{changeFromPrevious})
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Conversations</span>
            <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>{data.conversations}</span>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Deep Convos</span>
            <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>{data.deepConversations}</span>
          </div>
          {data.issues > 0 && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-red-400">Issues Found</span>
              <span className="text-red-500 font-medium">{data.issues}</span>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  if (chartData.length === 0) {
    return (
      <div className={`rounded-xl border p-8 text-center ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className="text-4xl mb-3">📈</p>
        <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
          Not enough data to show trends. Run more evaluations over time.
        </p>
      </div>
    )
  }

  return (
    <div className={`rounded-xl border overflow-hidden ${
      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Quality Score Trends
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Track AI performance over time
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Insight bands toggle */}
            <button
              onClick={() => setShowInsightBands(!showInsightBands)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showInsightBands
                  ? (isDark ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
                  : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')
              }`}
            >
              {showInsightBands ? 'Hide' : 'Show'} Zones
            </button>

            {/* Time range selector */}
            <div className={`flex rounded-lg overflow-hidden ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              {(['7d', '30d', 'all'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    timeRange === range
                      ? (isDark ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
                      : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800')
                  }`}
                >
                  {range === 'all' ? 'All' : range}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Trend Summary */}
        {trendStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-3"
          >
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Current Score</p>
              <p className="text-xl font-bold" style={{ color: getScoreColor(trendStats.currentScore) }}>
                {trendStats.currentScore}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Recent Change</p>
              <p className={`text-xl font-bold ${trendStats.recentChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trendStats.recentChange >= 0 ? '+' : ''}{trendStats.recentChange}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Period Change</p>
              <p className={`text-xl font-bold ${trendStats.overallChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {trendStats.overallChange >= 0 ? '+' : ''}{trendStats.overallChange}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Average</p>
              <p className={`text-xl font-bold ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                {trendStats.avgScore}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Trend</p>
              <p className={`text-lg font-bold ${
                trendStats.trend === 'improving' ? 'text-green-500' :
                trendStats.trend === 'declining' ? 'text-red-500' :
                isDark ? 'text-gray-400' : 'text-gray-500'
              }`}>
                {trendStats.trend === 'improving' ? '↑ Improving' :
                 trendStats.trend === 'declining' ? '↓ Declining' : '→ Stable'}
              </p>
            </div>
          </motion.div>
        )}
      </div>

      {/* Chart */}
      <div className="p-4" style={{ height: 350 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
            onMouseMove={(e: any) => {
              if (e?.activePayload?.[0]) {
                setHoveredPoint(e.activePayload[0].payload)
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
            onClick={(e: any) => {
              if (e?.activePayload?.[0] && onPointClick) {
                onPointClick(e.activePayload[0].payload)
              }
            }}
          >
            <defs>
              <linearGradient id="qualityGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke={isDark ? '#374151' : '#e5e7eb'}
              vertical={false}
            />

            {/* Quality zone bands */}
            {showInsightBands && (
              <>
                {/* Excellent zone */}
                <ReferenceLine
                  y={80}
                  stroke="#22c55e"
                  strokeDasharray="5 5"
                  strokeOpacity={0.5}
                  label={{
                    value: 'Excellent',
                    position: 'right',
                    fill: isDark ? '#22c55e' : '#16a34a',
                    fontSize: 10,
                  }}
                />
                {/* Warning zone */}
                <ReferenceLine
                  y={60}
                  stroke="#eab308"
                  strokeDasharray="5 5"
                  strokeOpacity={0.5}
                  label={{
                    value: 'Good',
                    position: 'right',
                    fill: isDark ? '#eab308' : '#ca8a04',
                    fontSize: 10,
                  }}
                />
                {/* Needs work zone */}
                <ReferenceLine
                  y={40}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  strokeOpacity={0.5}
                  label={{
                    value: 'Needs Work',
                    position: 'right',
                    fill: isDark ? '#ef4444' : '#dc2626',
                    fontSize: 10,
                  }}
                />
              </>
            )}

            <XAxis
              dataKey="displayDate"
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
              tickLine={false}
              width={35}
            />

            <Tooltip content={<CustomTooltip />} />

            {/* Area under the line */}
            <Area
              type="monotone"
              dataKey="qualityScore"
              stroke="transparent"
              fill="url(#qualityGradient)"
            />

            {/* Main quality line */}
            <Line
              type="monotone"
              dataKey="qualityScore"
              stroke="#8b5cf6"
              strokeWidth={3}
              dot={(props) => {
                const { cx, cy, payload } = props
                const isHovered = hoveredPoint?.date === payload.date
                const hasIssues = payload.issues > 0

                return (
                  <g key={payload.date}>
                    {/* Outer glow for hovered */}
                    {isHovered && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={12}
                        fill="#8b5cf6"
                        fillOpacity={0.2}
                      />
                    )}
                    {/* Issue indicator */}
                    {hasIssues && (
                      <circle
                        cx={cx}
                        cy={cy}
                        r={10}
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth={2}
                        strokeDasharray="3 2"
                      />
                    )}
                    {/* Main dot */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isHovered ? 8 : 5}
                      fill={getScoreColor(payload.qualityScore)}
                      stroke={isDark ? '#1f2937' : '#ffffff'}
                      strokeWidth={2}
                      style={{ cursor: 'pointer' }}
                    />
                  </g>
                )
              }}
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className={`px-4 pb-4 flex items-center justify-center gap-6 text-xs ${
        isDark ? 'text-gray-400' : 'text-gray-500'
      }`}>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span>Excellent (80+)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span>Good (60-79)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span>Needs Work (&lt;60)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full border-2 border-red-500 border-dashed" />
          <span>Has Issues</span>
        </div>
      </div>
    </div>
  )
}
