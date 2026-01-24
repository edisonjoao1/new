'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import QualityTrendsChart from './QualityTrendsChart'
import IssuesDrilldown from './IssuesDrilldown'
import EvaluationComparison from './EvaluationComparison'
import ActionableInsightsCard from './ActionableInsightsCard'
import UserJourneyInsights from './UserJourneyInsights'

// Types
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

interface Insight {
  type: 'positive' | 'negative' | 'neutral'
  category: string
  finding: string
  recommendation?: string
}

interface HistoryItem {
  id: string
  generatedAt: string
  createdAt: string
  sampleSize: number
  userMetrics: UserMetrics
  aiMetrics: AIMetrics
  insights: Insight[]
  qualityScore?: number
}

interface Conversation {
  id: string
  preview: string
  messageCount: number
  timestamp: Date | null
  messages?: {
    role: 'user' | 'assistant'
    content: string
    timestamp?: Date
  }[]
  issues?: string[]
  qualityScore?: number
}

interface EnhancedAIDashboardProps {
  analyticsKey: string
  isDark: boolean
}

// Tab configuration
const tabs = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'trends', label: 'Trends', icon: '📈' },
  { id: 'journey', label: 'Journey', icon: '🗺️' },
  { id: 'issues', label: 'Issues', icon: '🔍' },
  { id: 'compare', label: 'Compare', icon: '⚖️' },
  { id: 'actions', label: 'Actions', icon: '🎯' },
] as const

type TabId = typeof tabs[number]['id']

export default function EnhancedAIDashboard({ analyticsKey, isDark }: EnhancedAIDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview')
  const [currentData, setCurrentData] = useState<{
    userMetrics: UserMetrics
    aiMetrics: AIMetrics
    insights: Insight[]
    recentConversations: Conversation[]
    generatedAt: string
    sampleSize: number
  } | null>(null)
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)

  // Fetch current evaluation data
  const runEvaluation = async () => {
    setLoading(true)
    setError(null)

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
        setError(result.error || 'Failed to run evaluation')
        return
      }

      setCurrentData(result)
      // Refresh history after new evaluation
      fetchHistory()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run evaluation')
    } finally {
      setLoading(false)
    }
  }

  // Fetch history
  const fetchHistory = async () => {
    setHistoryLoading(true)
    const key = analyticsKey || (typeof window !== 'undefined' ? sessionStorage.getItem('analytics_key') : null)

    if (!key) return

    try {
      const response = await fetch(`/api/analytics/ai-evaluation?key=${encodeURIComponent(key)}&history=true&limit=30`)
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

  // Initial load
  useEffect(() => {
    fetchHistory()
  }, [analyticsKey])

  // Calculate overall health score
  const healthScore = useMemo(() => {
    if (!currentData) return null

    let score = 50
    const { aiMetrics, insights } = currentData

    // Conversation depth
    const totalDepth = aiMetrics.conversationDepth.shallow + aiMetrics.conversationDepth.moderate + aiMetrics.conversationDepth.deep
    if (totalDepth > 0) {
      const deepRatio = aiMetrics.conversationDepth.deep / totalDepth
      const moderateRatio = aiMetrics.conversationDepth.moderate / totalDepth
      score += deepRatio * 25 + moderateRatio * 15
    }

    // Response quality
    const avgLen = aiMetrics.avgResponseLength
    if (avgLen >= 100 && avgLen <= 400) score += 15
    else if (avgLen >= 50 && avgLen <= 600) score += 8

    // Insights
    const positiveInsights = insights.filter(i => i.type === 'positive').length
    const negativeInsights = insights.filter(i => i.type === 'negative').length
    score += positiveInsights * 3
    score -= negativeInsights * 5

    return Math.min(100, Math.max(0, Math.round(score)))
  }, [currentData])

  // Get health color
  const getHealthColor = (score: number) => {
    if (score >= 80) return 'text-green-500'
    if (score >= 60) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getHealthBgColor = (score: number) => {
    if (score >= 80) return isDark ? 'bg-green-900/30' : 'bg-green-100'
    if (score >= 60) return isDark ? 'bg-yellow-900/30' : 'bg-yellow-100'
    return isDark ? 'bg-red-900/30' : 'bg-red-100'
  }

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <div className={`border-b ${isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                AI Performance Dashboard
              </h1>
              <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                {currentData
                  ? `Last evaluation: ${new Date(currentData.generatedAt).toLocaleString()} (${currentData.sampleSize} users)`
                  : 'Run an evaluation to see insights'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Health Score Badge */}
              {healthScore !== null && (
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`px-4 py-2 rounded-xl ${getHealthBgColor(healthScore)}`}
                >
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Health Score</p>
                  <p className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
                    {healthScore}
                  </p>
                </motion.div>
              )}

              {/* Run Evaluation Button */}
              <button
                onClick={runEvaluation}
                disabled={loading}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  loading
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700'
                } text-white`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Analyzing...
                  </span>
                ) : (
                  'Run Evaluation'
                )}
              </button>
            </div>
          </div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 bg-red-100 border border-red-400 rounded-lg text-red-700"
            >
              {error}
            </motion.div>
          )}

          {/* Tabs */}
          <div className="mt-6 flex gap-1 overflow-x-auto pb-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? (isDark ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
                    : (isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100')
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {!currentData ? (
                <div className={`rounded-xl border p-12 text-center ${
                  isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                }`}>
                  <p className="text-5xl mb-4">🧠</p>
                  <p className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Ready to analyze your AI assistant
                  </p>
                  <p className={`text-sm mt-2 max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Click "Run Evaluation" to analyze conversation quality, identify issues,
                    and get actionable recommendations to improve your AI.
                  </p>
                  <button
                    onClick={runEvaluation}
                    disabled={loading}
                    className="mt-6 px-6 py-3 rounded-lg font-medium bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white"
                  >
                    Start Analysis
                  </button>
                </div>
              ) : (
                <>
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                      label="Total Conversations"
                      value={currentData.aiMetrics.totalConversations.toLocaleString()}
                      icon="💬"
                      isDark={isDark}
                    />
                    <StatCard
                      label="Avg Messages/Conv"
                      value={currentData.aiMetrics.avgConversationLength.toFixed(1)}
                      icon="📝"
                      isDark={isDark}
                    />
                    <StatCard
                      label="Active Users (24h)"
                      value={currentData.userMetrics.activeUsers24h.toLocaleString()}
                      icon="👥"
                      isDark={isDark}
                    />
                    <StatCard
                      label="Deep Conversations"
                      value={currentData.aiMetrics.conversationDepth.deep.toString()}
                      icon="🎯"
                      isDark={isDark}
                      highlight={currentData.aiMetrics.conversationDepth.deep > 10}
                    />
                  </div>

                  {/* Mini Trends Chart */}
                  {history.length > 1 && (
                    <QualityTrendsChart
                      historyData={history}
                      isDark={isDark}
                    />
                  )}

                  {/* Key Insights Preview */}
                  {currentData.insights.length > 0 && (
                    <div className={`rounded-xl border p-4 ${
                      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          Key Insights
                        </h3>
                        <button
                          onClick={() => setActiveTab('issues')}
                          className={`text-sm ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
                        >
                          View all →
                        </button>
                      </div>
                      <div className="space-y-2">
                        {currentData.insights.slice(0, 4).map((insight, i) => (
                          <div
                            key={i}
                            className={`p-3 rounded-lg ${
                              insight.type === 'positive' ? (isDark ? 'bg-green-900/20' : 'bg-green-50') :
                              insight.type === 'negative' ? (isDark ? 'bg-red-900/20' : 'bg-red-50') :
                              isDark ? 'bg-blue-900/20' : 'bg-blue-50'
                            }`}
                          >
                            <p className={`text-sm ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                              {insight.type === 'positive' ? '✅' : insight.type === 'negative' ? '⚠️' : 'ℹ️'} {insight.finding}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </motion.div>
          )}

          {/* Trends Tab */}
          {activeTab === 'trends' && (
            <motion.div
              key="trends"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {history.length > 0 ? (
                <QualityTrendsChart
                  historyData={history}
                  isDark={isDark}
                />
              ) : (
                <EmptyState
                  icon="📈"
                  title="No trend data yet"
                  description="Run evaluations over time to see trends in AI quality."
                  isDark={isDark}
                />
              )}
            </motion.div>
          )}

          {/* Journey Tab */}
          {activeTab === 'journey' && (
            <motion.div
              key="journey"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {currentData ? (
                <UserJourneyInsights
                  conversationDepth={currentData.aiMetrics.conversationDepth}
                  timeOfDayDistribution={currentData.aiMetrics.timeOfDayDistribution}
                  topTopics={currentData.aiMetrics.topTopics}
                  avgConversationLength={currentData.aiMetrics.avgConversationLength}
                  totalConversations={currentData.aiMetrics.totalConversations}
                  isDark={isDark}
                />
              ) : (
                <EmptyState
                  icon="🗺️"
                  title="No journey data available"
                  description="Run an evaluation to see user journey insights."
                  isDark={isDark}
                />
              )}
            </motion.div>
          )}

          {/* Issues Tab */}
          {activeTab === 'issues' && (
            <motion.div
              key="issues"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {currentData ? (
                <IssuesDrilldown
                  issues={currentData.insights.map((i, idx) => ({
                    ...i,
                    id: `insight-${idx}`,
                  }))}
                  conversations={currentData.recentConversations}
                  isDark={isDark}
                  onConversationSelect={setSelectedConversation}
                />
              ) : (
                <EmptyState
                  icon="🔍"
                  title="No issues to display"
                  description="Run an evaluation to identify issues in your AI conversations."
                  isDark={isDark}
                />
              )}
            </motion.div>
          )}

          {/* Compare Tab */}
          {activeTab === 'compare' && (
            <motion.div
              key="compare"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <EvaluationComparison
                evaluations={history}
                isDark={isDark}
              />
            </motion.div>
          )}

          {/* Actions Tab */}
          {activeTab === 'actions' && (
            <motion.div
              key="actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {currentData ? (
                <ActionableInsightsCard
                  insights={currentData.insights}
                  aiMetrics={currentData.aiMetrics}
                  isDark={isDark}
                />
              ) : (
                <EmptyState
                  icon="🎯"
                  title="No actions available"
                  description="Run an evaluation to generate actionable recommendations."
                  isDark={isDark}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Conversation Detail Modal */}
      <AnimatePresence>
        {selectedConversation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setSelectedConversation(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className={`max-w-2xl w-full max-h-[80vh] overflow-y-auto rounded-xl ${
                isDark ? 'bg-gray-800' : 'bg-white'
              }`}
            >
              <div className={`p-4 border-b sticky top-0 ${
                isDark ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}>
                <div className="flex items-center justify-between">
                  <h3 className={`font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Conversation Details
                  </h3>
                  <button
                    onClick={() => setSelectedConversation(null)}
                    className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
                  >
                    ✕
                  </button>
                </div>
              </div>
              <div className="p-4">
                <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  {selectedConversation.messageCount} messages • {selectedConversation.timestamp
                    ? new Date(selectedConversation.timestamp).toLocaleString()
                    : 'Unknown date'}
                </p>
                {selectedConversation.messages ? (
                  <div className="space-y-3">
                    {selectedConversation.messages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg ${
                          msg.role === 'user'
                            ? (isDark ? 'bg-blue-900/30 text-blue-300' : 'bg-blue-50 text-blue-800')
                            : (isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700')
                        }`}
                      >
                        <p className="text-xs font-medium opacity-60 mb-1">
                          {msg.role === 'user' ? 'User' : 'AI'}
                        </p>
                        <p className="text-sm">{msg.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    Preview: "{selectedConversation.preview}"
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Stat Card Component
function StatCard({
  label,
  value,
  icon,
  isDark,
  highlight = false,
}: {
  label: string
  value: string
  icon: string
  isDark: boolean
  highlight?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-xl border ${
        highlight
          ? (isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-200')
          : (isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200')
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">{icon}</span>
        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{label}</span>
      </div>
      <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {value}
      </p>
    </motion.div>
  )
}

// Empty State Component
function EmptyState({
  icon,
  title,
  description,
  isDark,
}: {
  icon: string
  title: string
  description: string
  isDark: boolean
}) {
  return (
    <div className={`rounded-xl border p-12 text-center ${
      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <p className="text-5xl mb-4">{icon}</p>
      <p className={`text-xl font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
        {title}
      </p>
      <p className={`text-sm mt-2 max-w-md mx-auto ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
        {description}
      </p>
    </div>
  )
}
