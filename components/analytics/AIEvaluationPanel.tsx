'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import EvaluationDetailModal from './EvaluationDetailModal'

interface AIAnalysisResult {
  overallQuality: number
  summary: string
  issuesFound: {
    severity: 'critical' | 'high' | 'medium' | 'low'
    issue: string
    example?: string
    affectedUsers?: string
    recommendation: string
    expectedImpact?: string
  }[]
  successPatterns: {
    pattern: string
    example?: string
    frequency: 'common' | 'occasional' | 'rare'
    impact: string
  }[]
  promptRecommendations: {
    priority: 'high' | 'medium' | 'low'
    currentBehavior: string
    suggestedChange: string
    expectedImpact: string
    risk?: string
  }[]
  quickWins?: string[]
  conversationBreakdown: {
    category: string
    count: number
    avgQuality: number
    bestExample?: string
    worstExample?: string
    notes: string
  }[]
  userJourneyInsights?: {
    returnUserQuality: string
    firstImpressionScore?: number
    firstImpressionIssues: string[]
    loyalUserPatterns?: string[]
    retentionDrivers?: string[]
    churnRisks?: string[]
    churnSignals?: string[]
    recommendedJourneyFixes?: string[]
  }
  segmentInsights?: {
    segment: string
    quality: number
    strengths?: string[]
    specificIssues: string[]
    recommendation?: string
  }[]
  competitivePosition?: string
}

interface HistoryItem {
  id: string
  date?: string
  analysisDate?: string
  generatedAt: string
  createdAt: string
  sampleSize: number
  conversationsAnalyzed?: number
  userMetrics: UserMetrics
  aiMetrics: AIMetrics
  successMetrics?: {
    successful: number
    partial: number
    failed: number
    abandoned: number
    avgSuccessScore: number
    topSuccessIndicators: string[]
    topFailureReasons: string[]
  }
  insights: {
    type: 'positive' | 'negative' | 'neutral'
    category: string
    finding: string
    recommendation?: string
  }[]
  aiAnalysis?: AIAnalysisResult | null
}

interface UserMetrics {
  totalUsers: number
  activeUsers24h: number
  activeUsers7d: number
  avgConversationsPerUser: number
  avgMessagesPerConversation: number
  topLocales: { locale: string; count: number }[]
  topDevices: { device: string; count: number }[]
  appVersions: { version: string; count: number }[]
}

interface AIMetrics {
  totalConversations: number
  totalMessages: number
  avgConversationLength: number
  avgResponseLength: number
  topTopics: { topic: string; count: number }[]
  responseQuality: {
    tooShort: number
    appropriate: number
    tooLong: number
  }
  conversationDepth: {
    shallow: number
    moderate: number
    deep: number
  }
  timeOfDayDistribution: { hour: number; count: number }[]
}

interface EvaluationData {
  userMetrics: UserMetrics
  aiMetrics: AIMetrics
  recentConversations: {
    id: string
    preview: string
    messageCount: number
    timestamp: Date | null
  }[]
  insights: {
    type: 'positive' | 'negative' | 'neutral'
    category: string
    finding: string
    recommendation?: string
  }[]
  generatedAt: string
  cached: boolean
  sampleSize: number
}

interface AIEvaluationPanelProps {
  analyticsKey: string
  isDark: boolean
}

export default function AIEvaluationPanel({ analyticsKey, isDark }: AIEvaluationPanelProps) {
  const [data, setData] = useState<EvaluationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(true)
  const [setupInstructions, setSetupInstructions] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null)
  const [modalItem, setModalItem] = useState<HistoryItem | null>(null)

  const runEvaluation = async () => {
    setLoading(true)
    setError(null)
    setSetupInstructions(null)

    const key = analyticsKey || (typeof window !== 'undefined' ? sessionStorage.getItem('analytics_key') : null)

    if (!key) {
      setError('No authentication key available')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/analytics/ai-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, sampleSize: 100 }),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.setup) {
          setSetupInstructions(result.setup)
          setError(result.message || 'Firebase not configured')
        } else {
          setError(result.error || 'Failed to run evaluation')
        }
        return
      }

      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run evaluation')
    } finally {
      setLoading(false)
    }
  }

  const fetchHistory = async () => {
    setHistoryLoading(true)
    const key = analyticsKey || (typeof window !== 'undefined' ? sessionStorage.getItem('analytics_key') : null)

    if (!key) return

    try {
      const response = await fetch(`/api/analytics/ai-evaluation?key=${encodeURIComponent(key)}&history=true&limit=20`)
      const result = await response.json()

      if (response.ok && result.history) {
        setHistory(result.history)
      }
    } catch (err) {
      console.error('Failed to fetch history:', err)
    } finally {
      setHistoryLoading(false)
    }
  }

  // Fetch history on mount and when switching to history tab
  useEffect(() => {
    // Always fetch history on mount to show recent reports
    if (history.length === 0) {
      fetchHistory()
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'history' && history.length === 0) {
      fetchHistory()
    }
  }, [activeTab])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'positive': return '✅'
      case 'negative': return '⚠️'
      default: return 'ℹ️'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'engagement': return 'Engagement'
      case 'response_quality': return 'Response Quality'
      case 'retention': return 'Retention'
      case 'usage_patterns': return 'Usage Patterns'
      default: return category
    }
  }

  return (
    <div className={`rounded-xl border ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'} overflow-hidden mt-4`}>
      {/* Header */}
      <div
        className={`flex items-center justify-between p-4 cursor-pointer ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🧠</span>
          <div className="flex-1">
            <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              AI Performance Evaluation
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {data ? `Analyzed ${data.sampleSize} users • ${new Date(data.generatedAt).toLocaleTimeString()}${data.cached ? ' (cached)' : ''}` : 'Analyze conversation quality and AI performance'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/analytics/ai-evaluation"
            onClick={(e) => e.stopPropagation()}
            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all text-sm font-medium flex items-center gap-2"
          >
            <span>Open Full Dashboard</span>
            <span>→</span>
          </Link>
          {!data && !loading && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                runEvaluation()
              }}
              className={`px-3 py-1.5 rounded-lg text-sm ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
            >
              Quick Scan
            </button>
          )}
          {data && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                runEvaluation()
              }}
              className={`px-3 py-1.5 rounded-lg text-sm ${isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
            >
              Refresh
            </button>
          )}
          <span className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`}>▼</span>
        </div>
      </div>

      {/* Quick Access - Recent Reports (always visible) */}
      {!isExpanded && history.length > 0 && (
        <div className={`px-4 pb-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center justify-between mt-3 mb-2">
            <p className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              RECENT REPORTS
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsExpanded(true)
                setActiveTab('history')
              }}
              className={`text-xs ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
            >
              View All ({history.length})
            </button>
          </div>
          <div className="space-y-2">
            {history.slice(0, 2).map((item) => (
              <div
                key={item.id}
                onClick={(e) => {
                  e.stopPropagation()
                  setModalItem(item)
                }}
                className={`p-3 rounded-lg cursor-pointer transition-all hover:scale-[1.01] ${
                  isDark
                    ? 'bg-gray-700/50 hover:bg-gray-700 border border-gray-600 hover:border-purple-500/50'
                    : 'bg-gray-50 hover:bg-white border border-gray-200 hover:border-purple-300 hover:shadow-md'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                      <span className="text-lg">📊</span>
                    </div>
                    <div>
                      <p className={`font-medium text-sm ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {formatDate(item.createdAt || item.generatedAt)}
                      </p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {item.aiMetrics?.totalConversations || 0} conversations • {item.insights?.length || 0} insights
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.aiAnalysis && (
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        (item.aiAnalysis.overallQuality || 0) >= 80
                          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                          : (item.aiAnalysis.overallQuality || 0) >= 60
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                      }`}>
                        {item.aiAnalysis.overallQuality}%
                      </span>
                    )}
                    <span className={`text-xs ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                      View →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content */}
      {isExpanded && (
        <div className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          {/* Tabs */}
          <div className={`flex border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setActiveTab('current')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'current'
                  ? (isDark ? 'border-b-2 border-purple-500 text-purple-400' : 'border-b-2 border-purple-600 text-purple-600')
                  : (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
              }`}
            >
              Current Evaluation
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'history'
                  ? (isDark ? 'border-b-2 border-purple-500 text-purple-400' : 'border-b-2 border-purple-600 text-purple-600')
                  : (isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700')
              }`}
            >
              📜 History ({history.length})
            </button>
          </div>

          {/* History Tab Content */}
          {activeTab === 'history' && (
            <div className="p-4">
              {historyLoading && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 border-4 border-purple-500 border-t-transparent"></div>
                  <p className={`mt-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading history...</p>
                </div>
              )}

              {!historyLoading && history.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-4xl mb-3">📭</p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>No evaluation history yet. Run your first evaluation!</p>
                </div>
              )}

              {!historyLoading && history.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      Evaluation History
                    </h4>
                    <button
                      onClick={fetchHistory}
                      className={`text-sm ${isDark ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
                    >
                      Refresh
                    </button>
                  </div>

                  <div className="space-y-2">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedHistoryItem(selectedHistoryItem?.id === item.id ? null : item)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          selectedHistoryItem?.id === item.id
                            ? (isDark ? 'bg-purple-900/30 border border-purple-700' : 'bg-purple-50 border border-purple-200')
                            : (isDark ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100')
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {formatDate(item.createdAt || item.generatedAt)}
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                              {item.sampleSize} users analyzed
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                              {item.aiMetrics?.totalConversations || 0} conversations
                            </p>
                            <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              {item.insights?.length || 0} insights
                            </p>
                          </div>
                        </div>

                        {/* Expanded details */}
                        {selectedHistoryItem?.id === item.id && (
                          <div className={`mt-4 pt-4 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                              <div className={`p-2 rounded ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Conversations</p>
                                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {item.aiMetrics?.totalConversations || 0}
                                </p>
                              </div>
                              <div className={`p-2 rounded ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Avg Length</p>
                                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {item.aiMetrics?.avgConversationLength?.toFixed(1) || 0}
                                </p>
                              </div>
                              <div className={`p-2 rounded ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Active 24h</p>
                                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {item.userMetrics?.activeUsers24h || 0}
                                </p>
                              </div>
                              <div className={`p-2 rounded ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Avg Response</p>
                                <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {Math.round(item.aiMetrics?.avgResponseLength || 0)} chars
                                </p>
                              </div>
                            </div>

                            {/* Insights from this run */}
                            {item.insights && item.insights.length > 0 && (
                              <div>
                                <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  INSIGHTS FROM THIS RUN
                                </p>
                                <div className="space-y-1">
                                  {item.insights.slice(0, 3).map((insight, i) => (
                                    <div key={i} className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                                      {getInsightIcon(insight.type)} {insight.finding}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* View Full Analysis Button */}
                            <div className="mt-4 flex gap-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setModalItem(item)
                                }}
                                className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all text-sm font-medium flex items-center justify-center gap-2"
                              >
                                <span>🔍</span>
                                <span>View Full Analysis</span>
                              </button>
                              <Link
                                href={`/analytics/ai-evaluation?date=${item.date || item.analysisDate || ''}`}
                                onClick={(e) => e.stopPropagation()}
                                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                                  isDark
                                    ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                }`}
                              >
                                <span>Open in Dashboard</span>
                                <span>→</span>
                              </Link>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Current Tab Content */}
          {activeTab === 'current' && loading && (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent"></div>
              <p className={`mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Analyzing conversations...</p>
            </div>
          )}

          {activeTab === 'current' && error && (
            <div className="p-4 m-4 bg-red-100 border border-red-400 rounded-lg text-red-700">
              <p className="font-medium">{error}</p>
              {setupInstructions && (
                <div className="mt-3 text-sm">
                  <p className="font-medium mb-2">Setup Instructions:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>{setupInstructions.step1}</li>
                    <li>{setupInstructions.step2}</li>
                    <li className="break-all">{setupInstructions.step3}</li>
                  </ol>
                </div>
              )}
            </div>
          )}

          {activeTab === 'current' && data && !loading && (
            <div className="p-4 space-y-6">
              {/* Key Insights */}
              {data.insights.length > 0 && (
                <div>
                  <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    🎯 Key Insights
                  </h4>
                  <div className="space-y-2">
                    {data.insights.map((insight, i) => (
                      <div
                        key={i}
                        className={`p-3 rounded-lg ${
                          insight.type === 'positive' ? (isDark ? 'bg-green-900/20' : 'bg-green-50') :
                          insight.type === 'negative' ? (isDark ? 'bg-red-900/20' : 'bg-red-50') :
                          isDark ? 'bg-blue-900/20' : 'bg-blue-50'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <span>{getInsightIcon(insight.type)}</span>
                          <div className="flex-1">
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                              {getCategoryLabel(insight.category)}
                            </span>
                            <p className={`mt-1 ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{insight.finding}</p>
                            {insight.recommendation && (
                              <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                💡 {insight.recommendation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Conversations</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {data.aiMetrics.totalConversations.toLocaleString()}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Avg Messages/Conv</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {data.aiMetrics.avgConversationLength.toFixed(1)}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Active Users (24h)</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {data.userMetrics.activeUsers24h.toLocaleString()}
                  </p>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Avg Response Length</p>
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {Math.round(data.aiMetrics.avgResponseLength)} chars
                  </p>
                </div>
              </div>

              {/* Conversation Depth */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
                  <h5 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>📊 Conversation Depth</h5>
                  <div className="space-y-2">
                    {[
                      { label: 'Shallow (1-2 exchanges)', value: data.aiMetrics.conversationDepth.shallow, color: 'bg-yellow-500' },
                      { label: 'Moderate (3-5 exchanges)', value: data.aiMetrics.conversationDepth.moderate, color: 'bg-blue-500' },
                      { label: 'Deep (6+ exchanges)', value: data.aiMetrics.conversationDepth.deep, color: 'bg-green-500' },
                    ].map((item) => {
                      const total = data.aiMetrics.conversationDepth.shallow + data.aiMetrics.conversationDepth.moderate + data.aiMetrics.conversationDepth.deep
                      const pct = total > 0 ? (item.value / total) * 100 : 0
                      return (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{item.label}</span>
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{item.value} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className={`h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                            <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
                  <h5 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>📝 Response Quality</h5>
                  <div className="space-y-2">
                    {[
                      { label: 'Too Short (<50 chars)', value: data.aiMetrics.responseQuality.tooShort, color: 'bg-red-500' },
                      { label: 'Appropriate (50-500)', value: data.aiMetrics.responseQuality.appropriate, color: 'bg-green-500' },
                      { label: 'Long (>500 chars)', value: data.aiMetrics.responseQuality.tooLong, color: 'bg-yellow-500' },
                    ].map((item) => {
                      const total = data.aiMetrics.responseQuality.tooShort + data.aiMetrics.responseQuality.appropriate + data.aiMetrics.responseQuality.tooLong
                      const pct = total > 0 ? (item.value / total) * 100 : 0
                      return (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{item.label}</span>
                            <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{item.value} ({pct.toFixed(0)}%)</span>
                          </div>
                          <div className={`h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
                            <div className={`h-2 rounded-full ${item.color}`} style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Top Topics */}
              {data.aiMetrics.topTopics.length > 0 && (
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
                  <h5 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>🏷️ Top Conversation Topics</h5>
                  <div className="flex flex-wrap gap-2">
                    {data.aiMetrics.topTopics.map((topic, i) => (
                      <span
                        key={topic.topic}
                        className={`px-3 py-1 rounded-full text-sm ${
                          i === 0 ? 'bg-purple-100 text-purple-800' :
                          i === 1 ? 'bg-blue-100 text-blue-800' :
                          isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {topic.topic} ({topic.count})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* User Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {data.userMetrics.topLocales.length > 0 && (
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
                    <h5 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>🌍 Top Locales</h5>
                    <div className="space-y-1 text-sm">
                      {data.userMetrics.topLocales.map((l) => (
                        <div key={l.locale} className="flex justify-between">
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{l.locale}</span>
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{l.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.userMetrics.topDevices.length > 0 && (
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
                    <h5 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>📱 Top Devices</h5>
                    <div className="space-y-1 text-sm">
                      {data.userMetrics.topDevices.map((d) => (
                        <div key={d.device} className="flex justify-between">
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>{d.device}</span>
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{d.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {data.userMetrics.appVersions.length > 0 && (
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
                    <h5 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>📦 App Versions</h5>
                    <div className="space-y-1 text-sm">
                      {data.userMetrics.appVersions.map((v) => (
                        <div key={v.version} className="flex justify-between">
                          <span className={isDark ? 'text-gray-300' : 'text-gray-600'}>v{v.version}</span>
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>{v.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recent Conversations Preview */}
              {data.recentConversations.length > 0 && (
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/30' : 'bg-white border border-gray-200'}`}>
                  <h5 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>💬 Recent Conversations</h5>
                  <div className="space-y-2">
                    {data.recentConversations.slice(0, 5).map((conv) => (
                      <div key={conv.id} className={`p-2 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                            {conv.messageCount} messages
                          </span>
                          <span className={isDark ? 'text-gray-500' : 'text-gray-400'}>
                            {conv.timestamp ? new Date(conv.timestamp).toLocaleDateString() : 'Unknown date'}
                          </span>
                        </div>
                        <p className={`text-sm truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          "{conv.preview}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'current' && !data && !loading && !error && (
            <div className="p-8 text-center">
              <p className="text-4xl mb-3">🧠</p>
              <p className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Click "Run Evaluation" to analyze AI conversation quality, engagement patterns, and get improvement recommendations
              </p>
            </div>
          )}
        </div>
      )}

      {/* Full Analysis Modal */}
      {modalItem && (
        <EvaluationDetailModal
          item={modalItem}
          isOpen={!!modalItem}
          onClose={() => setModalItem(null)}
          isDark={isDark}
        />
      )}
    </div>
  )
}
