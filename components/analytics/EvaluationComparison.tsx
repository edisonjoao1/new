'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

// Types
interface EvaluationSnapshot {
  id: string
  generatedAt: string
  createdAt?: string
  sampleSize: number
  userMetrics: {
    totalUsers: number
    activeUsers24h: number
    activeUsers7d: number
    avgConversationsPerUser: number
    avgMessagesPerConversation: number
  }
  aiMetrics: {
    totalConversations: number
    totalMessages: number
    avgConversationLength: number
    avgResponseLength: number
    conversationDepth: {
      shallow: number
      moderate: number
      deep: number
    }
    responseQuality: {
      tooShort: number
      appropriate: number
      tooLong: number
    }
  }
  insights: {
    type: 'positive' | 'negative' | 'neutral'
    category: string
    finding: string
  }[]
  qualityScore?: number
}

interface EvaluationComparisonProps {
  evaluations: EvaluationSnapshot[]
  isDark: boolean
}

interface MetricComparison {
  name: string
  label: string
  current: number
  previous: number
  change: number
  changePercent: number
  isPositiveGood: boolean
  format?: 'number' | 'percent' | 'decimal'
}

// Calculate quality score
function calculateQualityScore(eval_: EvaluationSnapshot): number {
  if (eval_.qualityScore) return eval_.qualityScore

  const { aiMetrics, insights } = eval_
  let score = 50

  const totalDepth = aiMetrics.conversationDepth.shallow + aiMetrics.conversationDepth.moderate + aiMetrics.conversationDepth.deep
  if (totalDepth > 0) {
    const deepRatio = aiMetrics.conversationDepth.deep / totalDepth
    const moderateRatio = aiMetrics.conversationDepth.moderate / totalDepth
    score += deepRatio * 25 + moderateRatio * 15
  }

  const avgLen = aiMetrics.avgResponseLength
  if (avgLen >= 100 && avgLen <= 400) {
    score += 15
  } else if (avgLen >= 50 && avgLen <= 600) {
    score += 8
  }

  const positiveInsights = insights.filter(i => i.type === 'positive').length
  const negativeInsights = insights.filter(i => i.type === 'negative').length
  score += positiveInsights * 3
  score -= negativeInsights * 5

  return Math.min(100, Math.max(0, Math.round(score)))
}

export default function EvaluationComparison({
  evaluations,
  isDark,
}: EvaluationComparisonProps) {
  const [selectedPeriodA, setSelectedPeriodA] = useState<string | null>(null)
  const [selectedPeriodB, setSelectedPeriodB] = useState<string | null>(null)

  // Sort evaluations by date (most recent first)
  const sortedEvaluations = useMemo(() => {
    return [...evaluations].sort(
      (a, b) => new Date(b.createdAt || b.generatedAt).getTime() - new Date(a.createdAt || a.generatedAt).getTime()
    )
  }, [evaluations])

  // Auto-select most recent and second most recent
  const periodA = useMemo(() => {
    if (selectedPeriodA) {
      return sortedEvaluations.find(e => e.id === selectedPeriodA)
    }
    return sortedEvaluations[0]
  }, [sortedEvaluations, selectedPeriodA])

  const periodB = useMemo(() => {
    if (selectedPeriodB) {
      return sortedEvaluations.find(e => e.id === selectedPeriodB)
    }
    return sortedEvaluations[1]
  }, [sortedEvaluations, selectedPeriodB])

  // Calculate comparison metrics
  const comparisonMetrics = useMemo((): MetricComparison[] => {
    if (!periodA || !periodB) return []

    const metrics: MetricComparison[] = [
      {
        name: 'qualityScore',
        label: 'Quality Score',
        current: calculateQualityScore(periodA),
        previous: calculateQualityScore(periodB),
        change: 0,
        changePercent: 0,
        isPositiveGood: true,
      },
      {
        name: 'conversations',
        label: 'Total Conversations',
        current: periodA.aiMetrics.totalConversations,
        previous: periodB.aiMetrics.totalConversations,
        change: 0,
        changePercent: 0,
        isPositiveGood: true,
      },
      {
        name: 'activeUsers',
        label: 'Active Users (24h)',
        current: periodA.userMetrics.activeUsers24h,
        previous: periodB.userMetrics.activeUsers24h,
        change: 0,
        changePercent: 0,
        isPositiveGood: true,
      },
      {
        name: 'avgConvLength',
        label: 'Avg Conversation Length',
        current: periodA.aiMetrics.avgConversationLength,
        previous: periodB.aiMetrics.avgConversationLength,
        change: 0,
        changePercent: 0,
        isPositiveGood: true,
        format: 'decimal',
      },
      {
        name: 'avgResponseLength',
        label: 'Avg Response Length',
        current: periodA.aiMetrics.avgResponseLength,
        previous: periodB.aiMetrics.avgResponseLength,
        change: 0,
        changePercent: 0,
        isPositiveGood: false, // Neither too long nor too short is ideal
        format: 'number',
      },
      {
        name: 'deepConvos',
        label: 'Deep Conversations',
        current: periodA.aiMetrics.conversationDepth.deep,
        previous: periodB.aiMetrics.conversationDepth.deep,
        change: 0,
        changePercent: 0,
        isPositiveGood: true,
      },
      {
        name: 'appropriateResponses',
        label: 'Appropriate Responses',
        current: periodA.aiMetrics.responseQuality.appropriate,
        previous: periodB.aiMetrics.responseQuality.appropriate,
        change: 0,
        changePercent: 0,
        isPositiveGood: true,
      },
      {
        name: 'negativeInsights',
        label: 'Issues Found',
        current: periodA.insights.filter(i => i.type === 'negative').length,
        previous: periodB.insights.filter(i => i.type === 'negative').length,
        change: 0,
        changePercent: 0,
        isPositiveGood: false, // Fewer issues is better
      },
    ]

    // Calculate changes
    return metrics.map(m => ({
      ...m,
      change: m.current - m.previous,
      changePercent: m.previous !== 0
        ? Math.round(((m.current - m.previous) / m.previous) * 100)
        : m.current > 0 ? 100 : 0,
    }))
  }, [periodA, periodB])

  // Chart data for bar comparison
  const chartData = useMemo(() => {
    if (!comparisonMetrics.length) return []

    return comparisonMetrics.slice(0, 6).map(m => ({
      name: m.label,
      current: m.current,
      previous: m.previous,
      change: m.change,
      isPositiveGood: m.isPositiveGood,
    }))
  }, [comparisonMetrics])

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get change color
  const getChangeColor = (change: number, isPositiveGood: boolean) => {
    if (change === 0) return isDark ? 'text-gray-400' : 'text-gray-500'

    const isGood = isPositiveGood ? change > 0 : change < 0
    return isGood ? 'text-green-500' : 'text-red-500'
  }

  // Get change icon
  const getChangeIcon = (change: number) => {
    if (change > 0) return '↑'
    if (change < 0) return '↓'
    return '→'
  }

  if (sortedEvaluations.length < 2) {
    return (
      <div className={`rounded-xl border p-8 text-center ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className="text-4xl mb-3">⚖️</p>
        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          Need more data to compare
        </p>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Run at least 2 evaluations to see comparisons.
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
        <h3 className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          <span>⚖️</span>
          Period Comparison
        </h3>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Compare metrics between two evaluation periods
        </p>
      </div>

      {/* Period Selectors */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Period A (Current) */}
          <div>
            <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              CURRENT PERIOD
            </label>
            <select
              value={periodA?.id || ''}
              onChange={(e) => setSelectedPeriodA(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-200'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              {sortedEvaluations.map((eval_) => (
                <option key={eval_.id} value={eval_.id}>
                  {formatDate(eval_.createdAt || eval_.generatedAt)} ({eval_.sampleSize} users)
                </option>
              ))}
            </select>
          </div>

          {/* Period B (Previous) */}
          <div>
            <label className={`block text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              COMPARE TO
            </label>
            <select
              value={periodB?.id || ''}
              onChange={(e) => setSelectedPeriodB(e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-200'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              {sortedEvaluations.map((eval_) => (
                <option key={eval_.id} value={eval_.id}>
                  {formatDate(eval_.createdAt || eval_.generatedAt)} ({eval_.sampleSize} users)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {periodA && periodB && (
        <>
          {/* Summary Cards */}
          <div className="p-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {comparisonMetrics.slice(0, 4).map((metric) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                >
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {metric.label}
                  </p>
                  <div className="flex items-end justify-between mt-1">
                    <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {metric.format === 'decimal'
                        ? metric.current.toFixed(1)
                        : metric.current.toLocaleString()}
                    </p>
                    <div className={`text-sm font-medium ${getChangeColor(metric.change, metric.isPositiveGood)}`}>
                      <span>{getChangeIcon(metric.change)}</span>
                      <span className="ml-0.5">
                        {metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%
                      </span>
                    </div>
                  </div>
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    vs {metric.format === 'decimal'
                      ? metric.previous.toFixed(1)
                      : metric.previous.toLocaleString()} before
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Comparison Chart */}
          <div className="p-4" style={{ height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? '#374151' : '#e5e7eb'}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  type="number"
                  tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 12 }}
                  axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                  axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
                  width={95}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: isDark ? '#ffffff' : '#111827' }}
                />
                <Bar
                  dataKey="previous"
                  name="Previous"
                  fill={isDark ? '#6b7280' : '#9ca3af'}
                  radius={[0, 4, 4, 0]}
                />
                <Bar
                  dataKey="current"
                  name="Current"
                  radius={[0, 4, 4, 0]}
                >
                  {chartData.map((entry, index) => {
                    const isImproved = entry.isPositiveGood
                      ? entry.current > entry.previous
                      : entry.current < entry.previous
                    return (
                      <Cell
                        key={`cell-${index}`}
                        fill={isImproved ? '#22c55e' : entry.current === entry.previous ? '#8b5cf6' : '#ef4444'}
                      />
                    )
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed Changes */}
          <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Detailed Changes
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {comparisonMetrics.map((metric) => {
                const isImproved = metric.isPositiveGood
                  ? metric.change > 0
                  : metric.change < 0
                const isWorsened = metric.isPositiveGood
                  ? metric.change < 0
                  : metric.change > 0

                return (
                  <div
                    key={metric.name}
                    className={`p-3 rounded-lg flex items-center justify-between ${
                      isImproved
                        ? (isDark ? 'bg-green-900/20' : 'bg-green-50')
                        : isWorsened
                          ? (isDark ? 'bg-red-900/20' : 'bg-red-50')
                          : (isDark ? 'bg-gray-700/30' : 'bg-gray-50')
                    }`}
                  >
                    <div>
                      <p className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                        {metric.label}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {metric.format === 'decimal'
                          ? `${metric.previous.toFixed(1)} → ${metric.current.toFixed(1)}`
                          : `${metric.previous.toLocaleString()} → ${metric.current.toLocaleString()}`}
                      </p>
                    </div>
                    <div className={`text-lg font-bold ${getChangeColor(metric.change, metric.isPositiveGood)}`}>
                      {getChangeIcon(metric.change)}
                      {Math.abs(metric.change) > 0 && (
                        <span className="text-sm ml-1">
                          {metric.changePercent > 0 ? '+' : ''}{metric.changePercent}%
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Insights Comparison */}
          <div className={`p-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Insights Comparison
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Period Issues */}
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  CURRENT ISSUES ({periodA.insights.filter(i => i.type === 'negative').length})
                </p>
                <div className="space-y-1">
                  {periodA.insights
                    .filter(i => i.type === 'negative')
                    .slice(0, 3)
                    .map((insight, i) => (
                      <p key={i} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        • {insight.finding}
                      </p>
                    ))}
                  {periodA.insights.filter(i => i.type === 'negative').length === 0 && (
                    <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      No issues found
                    </p>
                  )}
                </div>
              </div>

              {/* Previous Period Issues */}
              <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-gray-50'}`}>
                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  PREVIOUS ISSUES ({periodB.insights.filter(i => i.type === 'negative').length})
                </p>
                <div className="space-y-1">
                  {periodB.insights
                    .filter(i => i.type === 'negative')
                    .slice(0, 3)
                    .map((insight, i) => (
                      <p key={i} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                        • {insight.finding}
                      </p>
                    ))}
                  {periodB.insights.filter(i => i.type === 'negative').length === 0 && (
                    <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                      No issues found
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
