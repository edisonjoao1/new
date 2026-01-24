'use client'

import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts'

// Types
interface ConversationDepth {
  shallow: number
  moderate: number
  deep: number
}

interface TimeDistribution {
  hour: number
  count: number
}

interface TopTopic {
  topic: string
  count: number
}

interface UserJourneyInsightsProps {
  conversationDepth: ConversationDepth
  timeOfDayDistribution: TimeDistribution[]
  topTopics: TopTopic[]
  avgConversationLength: number
  totalConversations: number
  isDark: boolean
}

// Funnel stage configuration
const funnelStages = [
  { id: 'started', label: 'Started Chat', description: 'Users who sent at least 1 message' },
  { id: 'engaged', label: 'Got Engaged', description: 'Users who sent 2+ messages' },
  { id: 'deepDive', label: 'Deep Dive', description: 'Users with 5+ message exchanges' },
  { id: 'power', label: 'Power Users', description: 'Users with 10+ exchanges' },
]

export default function UserJourneyInsights({
  conversationDepth,
  timeOfDayDistribution,
  topTopics,
  avgConversationLength,
  totalConversations,
  isDark,
}: UserJourneyInsightsProps) {
  const [activeView, setActiveView] = useState<'funnel' | 'time' | 'topics'>('funnel')

  // Calculate funnel data
  const funnelData = useMemo(() => {
    const total = conversationDepth.shallow + conversationDepth.moderate + conversationDepth.deep
    if (total === 0) return []

    // Estimate funnel stages from conversation depth
    const started = total
    const engaged = conversationDepth.moderate + conversationDepth.deep + Math.floor(conversationDepth.shallow * 0.3)
    const deepDive = conversationDepth.deep + Math.floor(conversationDepth.moderate * 0.4)
    const power = Math.floor(conversationDepth.deep * 0.6)

    return [
      { stage: 'Started Chat', value: started, rate: 100 },
      { stage: 'Got Engaged', value: engaged, rate: Math.round((engaged / started) * 100) },
      { stage: 'Deep Dive', value: deepDive, rate: Math.round((deepDive / started) * 100) },
      { stage: 'Power Users', value: power, rate: Math.round((power / started) * 100) },
    ]
  }, [conversationDepth])

  // Drop-off analysis
  const dropOffAnalysis = useMemo(() => {
    if (funnelData.length < 2) return []

    return funnelData.slice(1).map((stage, index) => {
      const previousStage = funnelData[index]
      const dropOff = previousStage.value - stage.value
      const dropOffRate = Math.round((dropOff / previousStage.value) * 100)

      return {
        from: previousStage.stage,
        to: stage.stage,
        dropOff,
        dropOffRate,
        suggestion: getSuggestion(index, dropOffRate),
      }
    })
  }, [funnelData])

  // Get improvement suggestion based on drop-off point
  function getSuggestion(stageIndex: number, dropOffRate: number): string {
    if (dropOffRate < 30) return 'Good retention at this stage.'

    switch (stageIndex) {
      case 0: // Started -> Engaged
        return 'Improve initial responses to be more engaging. Consider adding follow-up questions.'
      case 1: // Engaged -> Deep Dive
        return 'Users lose interest mid-conversation. Add personalization and context retention.'
      case 2: // Deep Dive -> Power
        return 'Convert engaged users to power users with proactive suggestions and memory.'
      default:
        return 'Analyze conversation logs to identify friction points.'
    }
  }

  // Format time distribution for chart
  const timeData = useMemo(() => {
    // Create 24-hour data
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      label: `${i.toString().padStart(2, '0')}:00`,
      count: 0,
    }))

    // Fill with actual data
    timeOfDayDistribution.forEach(item => {
      if (hourlyData[item.hour]) {
        hourlyData[item.hour].count = item.count
      }
    })

    return hourlyData
  }, [timeOfDayDistribution])

  // Find peak hours
  const peakHours = useMemo(() => {
    const sorted = [...timeData].sort((a, b) => b.count - a.count)
    return sorted.slice(0, 3)
  }, [timeData])

  // Topic colors
  const topicColors = [
    '#8b5cf6', '#6366f1', '#3b82f6', '#0ea5e9', '#14b8a6',
    '#22c55e', '#84cc16', '#eab308', '#f97316', '#ef4444',
  ]

  return (
    <div className={`rounded-xl border overflow-hidden ${
      isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`p-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <span>🗺️</span>
              User Journey Insights
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Understand how users interact with your AI
            </p>
          </div>

          {/* View toggle */}
          <div className={`flex rounded-lg overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
            {[
              { id: 'funnel', label: 'Funnel', icon: '📊' },
              { id: 'time', label: 'Time', icon: '🕐' },
              { id: 'topics', label: 'Topics', icon: '🏷️' },
            ].map((view) => (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id as any)}
                className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeView === view.id
                    ? (isDark ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
                    : (isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800')
                }`}
              >
                {view.icon} {view.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Funnel View */}
      {activeView === 'funnel' && (
        <div className="p-4">
          {funnelData.length === 0 ? (
            <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <p>No conversation data available for funnel analysis.</p>
            </div>
          ) : (
            <>
              {/* Funnel visualization */}
              <div className="space-y-3 mb-6">
                {funnelData.map((stage, index) => {
                  const width = stage.rate
                  const isLast = index === funnelData.length - 1

                  return (
                    <motion.div
                      key={stage.stage}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                          {stage.stage}
                        </span>
                        <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {stage.value.toLocaleString()} ({stage.rate}%)
                        </span>
                      </div>
                      <div className="relative">
                        <div className={`h-10 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${width}%` }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            className={`h-10 rounded-lg ${
                              index === 0 ? 'bg-purple-500' :
                              index === 1 ? 'bg-indigo-500' :
                              index === 2 ? 'bg-blue-500' :
                              'bg-green-500'
                            }`}
                          />
                        </div>
                        {/* Drop-off indicator */}
                        {!isLast && dropOffAnalysis[index] && (
                          <div className={`absolute right-0 top-12 text-xs ${
                            dropOffAnalysis[index].dropOffRate > 50 ? 'text-red-500' :
                            dropOffAnalysis[index].dropOffRate > 30 ? 'text-yellow-500' :
                            'text-green-500'
                          }`}>
                            ↓ {dropOffAnalysis[index].dropOffRate}% drop-off
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {/* Drop-off analysis */}
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Drop-off Analysis & Recommendations
                </h4>
                <div className="space-y-3">
                  {dropOffAnalysis.map((analysis, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg border ${
                        analysis.dropOffRate > 50
                          ? (isDark ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200')
                          : analysis.dropOffRate > 30
                            ? (isDark ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200')
                            : (isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200')
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
                          {analysis.from} → {analysis.to}
                        </span>
                        <span className={`text-sm font-bold ${
                          analysis.dropOffRate > 50 ? 'text-red-500' :
                          analysis.dropOffRate > 30 ? 'text-yellow-500' :
                          'text-green-500'
                        }`}>
                          -{analysis.dropOffRate}%
                        </span>
                      </div>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        💡 {analysis.suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Time View */}
      {activeView === 'time' && (
        <div className="p-4">
          <div style={{ height: 250 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="timeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={isDark ? '#374151' : '#e5e7eb'}
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                  axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
                  tickLine={false}
                  interval={2}
                />
                <YAxis
                  tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                  axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
                  tickLine={false}
                  width={30}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDark ? '#1f2937' : '#ffffff',
                    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '8px',
                  }}
                  labelStyle={{ color: isDark ? '#ffffff' : '#111827' }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  fill="url(#timeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Peak hours */}
          <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
            <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Peak Activity Hours
            </h4>
            <div className="grid grid-cols-3 gap-3">
              {peakHours.map((hour, index) => (
                <div
                  key={hour.hour}
                  className={`p-3 rounded-lg text-center ${
                    index === 0
                      ? (isDark ? 'bg-purple-900/30' : 'bg-purple-100')
                      : (isDark ? 'bg-gray-600' : 'bg-white border border-gray-200')
                  }`}
                >
                  <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {hour.label}
                  </p>
                  <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                    {hour.count} conversations
                  </p>
                  {index === 0 && (
                    <p className="text-xs text-purple-500 font-medium mt-1">
                      🏆 Peak Hour
                    </p>
                  )}
                </div>
              ))}
            </div>
            <p className={`text-xs mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              💡 Consider scheduling AI updates and maintenance outside peak hours.
            </p>
          </div>
        </div>
      )}

      {/* Topics View */}
      {activeView === 'topics' && (
        <div className="p-4">
          {topTopics.length === 0 ? (
            <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              <p>No topic data available.</p>
            </div>
          ) : (
            <>
              <div style={{ height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topTopics.slice(0, 8)}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={isDark ? '#374151' : '#e5e7eb'}
                      horizontal={true}
                      vertical={false}
                    />
                    <XAxis
                      type="number"
                      tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                      axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
                    />
                    <YAxis
                      dataKey="topic"
                      type="category"
                      tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 11 }}
                      axisLine={{ stroke: isDark ? '#4b5563' : '#d1d5db' }}
                      width={75}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                        borderRadius: '8px',
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                      {topTopics.slice(0, 8).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={topicColors[index % topicColors.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Topic insights */}
              <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                <h4 className={`font-medium mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Topic Analysis
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white border border-gray-200'}`}>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Most Popular</p>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {topTopics[0]?.topic || 'N/A'}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      {topTopics[0]?.count || 0} conversations
                    </p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-600' : 'bg-white border border-gray-200'}`}>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Topic Diversity</p>
                    <p className={`font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {topTopics.length} topics
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Across {totalConversations} conversations
                    </p>
                  </div>
                </div>
                <p className={`text-xs mt-3 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  💡 Focus AI training on top topics to improve response quality where it matters most.
                </p>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
