'use client'

import { useState, useEffect } from 'react'

interface TrendItem {
  type: 'positive' | 'negative' | 'neutral'
  metric: string
  description: string
  percentChange?: number
}

interface AnomalyItem {
  severity: 'high' | 'medium' | 'low'
  metric: string
  description: string
  possibleCause: string
}

interface ProjectionItem {
  metric: string
  current: number
  projected7d: number
  projected30d: number
  confidence: 'high' | 'medium' | 'low'
  trend: 'up' | 'down' | 'stable'
}

interface ActionItem {
  id: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  category: 'retention' | 'acquisition' | 'engagement' | 'monetization' | 'technical' | 'content'
  action: string
  expectedImpact: string
  effort: 'low' | 'medium' | 'high'
  deadline?: string
  status: 'pending' | 'in_progress' | 'completed'
  kpiTarget?: string
}

interface InsightsData {
  summary: string
  appContext?: {
    displayName: string
    category: string
    targetAudience: string
  }
  trends: TrendItem[]
  anomalies: AnomalyItem[]
  projections: ProjectionItem[]
  actionItems: ActionItem[]
  benchmarkComparison?: {
    metric: string
    appValue: number
    categoryAvg: number
    status: 'above' | 'below' | 'at'
  }[]
  generatedAt: string
  cached: boolean
}

interface InsightsPanelProps {
  analyticsKey: string
  propertyId: string | null
  period: string
  analyticsData: any
  isDark: boolean
}

export default function InsightsPanel({
  analyticsKey,
  propertyId,
  period,
  analyticsData,
  isDark,
}: InsightsPanelProps) {
  const [insights, setInsights] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [actionItemStates, setActionItemStates] = useState<Record<string, ActionItem['status']>>({})

  // Load action item states from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('actionItemStates')
    if (saved) {
      setActionItemStates(JSON.parse(saved))
    }
  }, [])

  // Save action item states to localStorage
  const updateActionItemStatus = (id: string, status: ActionItem['status']) => {
    const newStates = { ...actionItemStates, [id]: status }
    setActionItemStates(newStates)
    localStorage.setItem('actionItemStates', JSON.stringify(newStates))
  }

  const generateInsights = async () => {
    setLoading(true)
    setError(null)

    // Use provided key or fall back to sessionStorage
    const key = analyticsKey || (typeof window !== 'undefined' ? sessionStorage.getItem('analytics_key') : null)

    if (!key) {
      setError('No authentication key available')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/analytics/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          propertyId,
          period,
          analyticsData,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate insights')
      }

      const data = await response.json()
      setInsights(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate insights')
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'critical': return isDark ? 'bg-red-900/50 border-red-500' : 'bg-red-50 border-red-400'
      case 'high': return isDark ? 'bg-orange-900/50 border-orange-500' : 'bg-orange-50 border-orange-400'
      case 'medium': return isDark ? 'bg-yellow-900/50 border-yellow-500' : 'bg-yellow-50 border-yellow-400'
      case 'low': return isDark ? 'bg-blue-900/50 border-blue-500' : 'bg-blue-50 border-blue-400'
    }
  }

  const getCategoryIcon = (category: ActionItem['category']) => {
    switch (category) {
      case 'retention': return '🔄'
      case 'acquisition': return '📈'
      case 'engagement': return '💬'
      case 'monetization': return '💰'
      case 'technical': return '⚙️'
      case 'content': return '📝'
    }
  }

  const getTrendIcon = (type: TrendItem['type']) => {
    switch (type) {
      case 'positive': return '📈'
      case 'negative': return '📉'
      case 'neutral': return '➡️'
    }
  }

  const getProjectionTrendIcon = (trend: ProjectionItem['trend']) => {
    switch (trend) {
      case 'up': return '↗️'
      case 'down': return '↘️'
      case 'stable': return '→'
    }
  }

  return (
    <div className={`rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} overflow-hidden`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 cursor-pointer ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🤖</span>
          <div>
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Insights & Action Items
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {insights ? `Generated ${new Date(insights.generatedAt).toLocaleTimeString()}${insights.cached ? ' (cached)' : ''}` : 'Click to generate AI-powered analysis'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!insights && !loading && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                generateInsights()
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Generate Insights
            </button>
          )}
          {insights && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                generateInsights()
              }}
              className={`px-3 py-1.5 rounded-lg text-sm ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
            >
              Refresh
            </button>
          )}
          <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {loading && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
              <p className={`mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Analyzing your data...</p>
            </div>
          )}

          {error && (
            <div className="p-4 m-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
              <p className="font-medium">Error generating insights</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          {insights && !loading && (
            <div className="p-4 space-y-6">
              {/* Summary */}
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {insights.appContext ? `📱 ${insights.appContext.displayName}` : '📊 Portfolio Summary'}
                </h4>
                <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{insights.summary}</p>
                {insights.appContext && (
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                      {insights.appContext.category}
                    </span>
                  </div>
                )}
              </div>

              {/* Projections */}
              {insights.projections.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    🔮 Growth Projections
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {insights.projections.map((proj, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {proj.metric}
                          </span>
                          <span className="text-lg">{getProjectionTrendIcon(proj.trend)}</span>
                        </div>
                        <div className="space-y-1 text-sm">
                          <div className="flex justify-between">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>Current:</span>
                            <span className={isDark ? 'text-gray-200' : 'text-gray-700'}>{proj.current.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>7 days:</span>
                            <span className={proj.projected7d > proj.current ? 'text-green-500' : proj.projected7d < proj.current ? 'text-red-500' : isDark ? 'text-gray-200' : 'text-gray-700'}>
                              {proj.projected7d.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>30 days:</span>
                            <span className={proj.projected30d > proj.current ? 'text-green-500' : proj.projected30d < proj.current ? 'text-red-500' : isDark ? 'text-gray-200' : 'text-gray-700'}>
                              {proj.projected30d.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            proj.confidence === 'high' ? 'bg-green-100 text-green-700' :
                            proj.confidence === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>
                            {proj.confidence} confidence
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Trends */}
              {insights.trends.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    📊 Key Trends
                  </h4>
                  <div className="space-y-2">
                    {insights.trends.map((trend, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg flex items-start gap-3 ${
                          trend.type === 'positive' ? (isDark ? 'bg-green-900/20' : 'bg-green-50') :
                          trend.type === 'negative' ? (isDark ? 'bg-red-900/20' : 'bg-red-50') :
                          isDark ? 'bg-gray-700/30' : 'bg-gray-50'
                        }`}
                      >
                        <span className="text-xl">{getTrendIcon(trend.type)}</span>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {trend.metric}
                            </span>
                            {trend.percentChange !== undefined && (
                              <span className={`text-sm font-medium ${
                                trend.percentChange > 0 ? 'text-green-500' :
                                trend.percentChange < 0 ? 'text-red-500' :
                                isDark ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {trend.percentChange > 0 ? '+' : ''}{trend.percentChange.toFixed(1)}%
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {trend.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Anomalies */}
              {insights.anomalies.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ⚠️ Anomalies Detected
                  </h4>
                  <div className="space-y-2">
                    {insights.anomalies.map((anomaly, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border-l-4 ${
                          anomaly.severity === 'high' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                          anomaly.severity === 'medium' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                          'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                        } ${isDark ? 'bg-opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-medium uppercase px-2 py-0.5 rounded ${
                            anomaly.severity === 'high' ? 'bg-red-200 text-red-800' :
                            anomaly.severity === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                            'bg-blue-200 text-blue-800'
                          }`}>
                            {anomaly.severity}
                          </span>
                          <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            {anomaly.metric}
                          </span>
                        </div>
                        <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                          {anomaly.description}
                        </p>
                        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          <span className="font-medium">Possible cause:</span> {anomaly.possibleCause}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Items */}
              {insights.actionItems.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ✅ Action Items ({insights.actionItems.filter(a => (actionItemStates[a.id] || a.status) === 'completed').length}/{insights.actionItems.length} completed)
                  </h4>
                  <div className="space-y-3">
                    {insights.actionItems.map((item) => {
                      const currentStatus = actionItemStates[item.id] || item.status
                      return (
                        <div
                          key={item.id}
                          className={`p-4 rounded-lg border ${getPriorityColor(item.priority)} ${
                            currentStatus === 'completed' ? 'opacity-60' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span>{getCategoryIcon(item.category)}</span>
                                <span className={`text-xs font-medium uppercase px-2 py-0.5 rounded ${
                                  item.priority === 'critical' ? 'bg-red-200 text-red-800' :
                                  item.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                                  item.priority === 'medium' ? 'bg-yellow-200 text-yellow-800' :
                                  'bg-blue-200 text-blue-800'
                                }`}>
                                  {item.priority}
                                </span>
                                <span className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                  {item.category}
                                </span>
                                {item.deadline && (
                                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                    ⏰ {item.deadline}
                                  </span>
                                )}
                              </div>
                              <p className={`font-medium ${currentStatus === 'completed' ? 'line-through' : ''} ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                {item.action}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-sm">
                                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                                  <span className="font-medium">Impact:</span> {item.expectedImpact}
                                </span>
                                <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                                  <span className="font-medium">Effort:</span> {item.effort}
                                </span>
                              </div>
                              {item.kpiTarget && (
                                <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  🎯 {item.kpiTarget}
                                </p>
                              )}
                            </div>
                            <div className="flex flex-col gap-1">
                              <select
                                value={currentStatus}
                                onChange={(e) => updateActionItemStatus(item.id, e.target.value as ActionItem['status'])}
                                className={`text-sm rounded px-2 py-1 border ${
                                  isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
                                }`}
                              >
                                <option value="pending">Pending</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Benchmark Comparison */}
              {insights.benchmarkComparison && insights.benchmarkComparison.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    📏 Benchmark Comparison
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {insights.benchmarkComparison.map((bench, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'}`}
                      >
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{bench.metric}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <span className={`text-xl font-bold ${
                            bench.status === 'above' ? 'text-green-500' :
                            bench.status === 'below' ? 'text-red-500' :
                            isDark ? 'text-white' : 'text-gray-900'
                          }`}>
                            {bench.appValue}%
                          </span>
                          <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            vs {bench.categoryAvg}% avg
                          </span>
                        </div>
                        <span className={`text-xs ${
                          bench.status === 'above' ? 'text-green-500' :
                          bench.status === 'below' ? 'text-red-500' :
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                          {bench.status === 'above' ? '↑ Above' : bench.status === 'below' ? '↓ Below' : '= At'} category average
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {!insights && !loading && !error && (
            <div className="p-8 text-center">
              <p className={`text-4xl mb-3`}>🤖</p>
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Click "Generate Insights" to get AI-powered analysis, projections, and action items
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
