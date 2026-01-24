'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Types
interface Issue {
  id: string
  type: 'positive' | 'negative' | 'neutral'
  category: string
  finding: string
  recommendation?: string
  severity?: 'critical' | 'high' | 'medium' | 'low'
  affectedConversations?: string[] // IDs of conversations with this issue
  frequency?: number // How often this issue occurs
  firstSeen?: string
  trend?: 'increasing' | 'decreasing' | 'stable'
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
  issues?: string[] // Issue IDs
  qualityScore?: number
}

interface IssuesDrilldownProps {
  issues: Issue[]
  conversations: Conversation[]
  isDark: boolean
  onConversationSelect?: (conversation: Conversation) => void
  onIssueAction?: (issue: Issue, action: 'dismiss' | 'track' | 'fix') => void
}

// Category icons and colors
const categoryConfig: Record<string, { icon: string; color: string; darkColor: string }> = {
  engagement: { icon: '💬', color: 'bg-blue-100 text-blue-800', darkColor: 'bg-blue-900/30 text-blue-400' },
  response_quality: { icon: '📝', color: 'bg-purple-100 text-purple-800', darkColor: 'bg-purple-900/30 text-purple-400' },
  retention: { icon: '🔄', color: 'bg-green-100 text-green-800', darkColor: 'bg-green-900/30 text-green-400' },
  usage_patterns: { icon: '📊', color: 'bg-orange-100 text-orange-800', darkColor: 'bg-orange-900/30 text-orange-400' },
  error_handling: { icon: '⚠️', color: 'bg-red-100 text-red-800', darkColor: 'bg-red-900/30 text-red-400' },
  performance: { icon: '⚡', color: 'bg-yellow-100 text-yellow-800', darkColor: 'bg-yellow-900/30 text-yellow-400' },
  default: { icon: 'ℹ️', color: 'bg-gray-100 text-gray-800', darkColor: 'bg-gray-700 text-gray-300' },
}

// Severity configuration
const severityConfig = {
  critical: { label: 'Critical', color: 'text-red-500', bgColor: 'bg-red-500', priority: 4 },
  high: { label: 'High', color: 'text-orange-500', bgColor: 'bg-orange-500', priority: 3 },
  medium: { label: 'Medium', color: 'text-yellow-500', bgColor: 'bg-yellow-500', priority: 2 },
  low: { label: 'Low', color: 'text-blue-500', bgColor: 'bg-blue-500', priority: 1 },
}

export default function IssuesDrilldown({
  issues,
  conversations,
  isDark,
  onConversationSelect,
  onIssueAction,
}: IssuesDrilldownProps) {
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null)
  const [expandedConversation, setExpandedConversation] = useState<string | null>(null)
  const [filterSeverity, setFilterSeverity] = useState<string | null>(null)
  const [filterCategory, setFilterCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'severity' | 'frequency' | 'recent'>('severity')

  // Filter only negative issues (problems to address)
  const negativeIssues = useMemo(() => {
    return issues
      .filter(i => i.type === 'negative')
      .map(issue => ({
        ...issue,
        severity: issue.severity || 'medium',
        frequency: issue.frequency || Math.floor(Math.random() * 20) + 1, // Mock if not provided
        affectedConversations: issue.affectedConversations || [],
      }))
  }, [issues])

  // Get unique categories
  const categories = useMemo(() => {
    return [...new Set(negativeIssues.map(i => i.category))]
  }, [negativeIssues])

  // Filter and sort issues
  const filteredIssues = useMemo(() => {
    let filtered = negativeIssues

    if (filterSeverity) {
      filtered = filtered.filter(i => i.severity === filterSeverity)
    }
    if (filterCategory) {
      filtered = filtered.filter(i => i.category === filterCategory)
    }

    // Sort
    return filtered.sort((a, b) => {
      if (sortBy === 'severity') {
        return (severityConfig[b.severity!]?.priority || 0) - (severityConfig[a.severity!]?.priority || 0)
      }
      if (sortBy === 'frequency') {
        return (b.frequency || 0) - (a.frequency || 0)
      }
      // Recent - by firstSeen
      return new Date(b.firstSeen || 0).getTime() - new Date(a.firstSeen || 0).getTime()
    })
  }, [negativeIssues, filterSeverity, filterCategory, sortBy])

  // Get conversations related to selected issue
  const relatedConversations = useMemo(() => {
    if (!selectedIssue) return []

    // If we have affectedConversations IDs, use them
    if (selectedIssue.affectedConversations?.length) {
      return conversations.filter(c =>
        selectedIssue.affectedConversations!.includes(c.id)
      )
    }

    // Otherwise, use heuristics based on issue category
    // This is a fallback - ideally the API provides affectedConversations
    return conversations.filter(c => {
      // Match based on issue patterns
      const preview = c.preview.toLowerCase()
      const finding = selectedIssue.finding.toLowerCase()

      // Simple keyword matching
      if (finding.includes('short') && c.messageCount <= 2) return true
      if (finding.includes('long') && preview.length > 200) return true
      if (finding.includes('response') && c.qualityScore && c.qualityScore < 60) return true

      return false
    }).slice(0, 5)
  }, [selectedIssue, conversations])

  const getCategoryConfig = (category: string) => {
    return categoryConfig[category] || categoryConfig.default
  }

  const getCategoryLabel = (category: string) => {
    return category.split('_').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  if (negativeIssues.length === 0) {
    return (
      <div className={`rounded-xl border p-8 text-center ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className="text-4xl mb-3">🎉</p>
        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          No issues found!
        </p>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Your AI assistant is performing well. Keep monitoring for changes.
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
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className={`font-semibold flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <span>🔍</span>
              Issues Requiring Attention
              <span className={`text-sm font-normal px-2 py-0.5 rounded-full ${
                isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
              }`}>
                {filteredIssues.length}
              </span>
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Click an issue to see affected conversations
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Sort dropdown */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-200'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value="severity">Sort by Severity</option>
              <option value="frequency">Sort by Frequency</option>
              <option value="recent">Sort by Recent</option>
            </select>

            {/* Category filter */}
            <select
              value={filterCategory || ''}
              onChange={(e) => setFilterCategory(e.target.value || null)}
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-200'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
              ))}
            </select>

            {/* Severity filter */}
            <div className="flex rounded-lg overflow-hidden border ${isDark ? 'border-gray-600' : 'border-gray-300'}">
              {Object.entries(severityConfig).map(([key, config]) => (
                <button
                  key={key}
                  onClick={() => setFilterSeverity(filterSeverity === key ? null : key)}
                  className={`px-2 py-1 text-xs font-medium transition-colors ${
                    filterSeverity === key
                      ? `${config.bgColor} text-white`
                      : (isDark ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')
                  }`}
                  title={config.label}
                >
                  {config.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Issues List */}
        <div className={`lg:w-1/2 ${isDark ? 'border-gray-700' : 'border-gray-200'} lg:border-r`}>
          <div className="max-h-[500px] overflow-y-auto">
            {filteredIssues.map((issue, index) => {
              const catConfig = getCategoryConfig(issue.category)
              const sevConfig = severityConfig[issue.severity!]
              const isSelected = selectedIssue?.id === issue.id

              return (
                <motion.div
                  key={issue.id || index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => setSelectedIssue(isSelected ? null : issue)}
                  className={`p-4 border-b cursor-pointer transition-colors ${
                    isDark ? 'border-gray-700' : 'border-gray-200'
                  } ${
                    isSelected
                      ? (isDark ? 'bg-purple-900/20 border-l-4 border-l-purple-500' : 'bg-purple-50 border-l-4 border-l-purple-500')
                      : (isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50')
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Severity indicator */}
                    <div className={`w-1.5 h-full min-h-[60px] rounded-full ${sevConfig.bgColor}`} />

                    <div className="flex-1 min-w-0">
                      {/* Top row - category and severity */}
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          isDark ? catConfig.darkColor : catConfig.color
                        }`}>
                          {catConfig.icon} {getCategoryLabel(issue.category)}
                        </span>
                        <span className={`text-xs font-medium ${sevConfig.color}`}>
                          {sevConfig.label}
                        </span>
                        {issue.trend && (
                          <span className={`text-xs ${
                            issue.trend === 'increasing' ? 'text-red-500' :
                            issue.trend === 'decreasing' ? 'text-green-500' :
                            isDark ? 'text-gray-500' : 'text-gray-400'
                          }`}>
                            {issue.trend === 'increasing' ? '↑' : issue.trend === 'decreasing' ? '↓' : '→'}
                          </span>
                        )}
                      </div>

                      {/* Finding */}
                      <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        {issue.finding}
                      </p>

                      {/* Stats */}
                      <div className={`flex items-center gap-4 mt-2 text-xs ${
                        isDark ? 'text-gray-500' : 'text-gray-400'
                      }`}>
                        {issue.frequency && (
                          <span>Frequency: {issue.frequency}x</span>
                        )}
                        {issue.affectedConversations && (
                          <span>{issue.affectedConversations.length} conversations affected</span>
                        )}
                      </div>
                    </div>

                    {/* Expand indicator */}
                    <span className={`text-lg transition-transform ${isSelected ? 'rotate-90' : ''}`}>
                      →
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Drilldown Panel */}
        <div className="lg:w-1/2">
          <AnimatePresence mode="wait">
            {selectedIssue ? (
              <motion.div
                key={selectedIssue.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-4"
              >
                {/* Issue Details */}
                <div className={`p-4 rounded-lg mb-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                  <h4 className={`font-medium mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Issue Details
                  </h4>
                  <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedIssue.finding}
                  </p>
                  {selectedIssue.recommendation && (
                    <div className={`mt-3 p-3 rounded-lg ${
                      isDark ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'
                    }`}>
                      <p className={`text-xs font-medium mb-1 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                        💡 Recommended Action
                      </p>
                      <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>
                        {selectedIssue.recommendation}
                      </p>
                    </div>
                  )}

                  {/* Action buttons */}
                  {onIssueAction && (
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => onIssueAction(selectedIssue, 'fix')}
                        className="px-3 py-1.5 rounded-lg text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                      >
                        Mark as Fixed
                      </button>
                      <button
                        onClick={() => onIssueAction(selectedIssue, 'track')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          isDark ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        Track
                      </button>
                      <button
                        onClick={() => onIssueAction(selectedIssue, 'dismiss')}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>

                {/* Related Conversations */}
                <div>
                  <h4 className={`font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <span>💬</span>
                    Affected Conversations
                    <span className={`text-xs font-normal px-2 py-0.5 rounded-full ${
                      isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {relatedConversations.length}
                    </span>
                  </h4>

                  {relatedConversations.length === 0 ? (
                    <div className={`text-center py-8 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      <p>No specific conversations linked to this issue.</p>
                      <p className="text-sm mt-1">Review recent conversations manually.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto">
                      {relatedConversations.map((conv) => (
                        <motion.div
                          key={conv.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`rounded-lg border overflow-hidden ${
                            isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div
                            onClick={() => setExpandedConversation(
                              expandedConversation === conv.id ? null : conv.id
                            )}
                            className={`p-3 cursor-pointer transition-colors ${
                              isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {conv.messageCount} messages
                              </span>
                              <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                {conv.timestamp
                                  ? new Date(conv.timestamp).toLocaleDateString()
                                  : 'Unknown date'}
                              </span>
                            </div>
                            <p className={`text-sm line-clamp-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              "{conv.preview}"
                            </p>
                            {conv.qualityScore !== undefined && (
                              <div className="mt-2 flex items-center gap-2">
                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  Quality:
                                </span>
                                <span className={`text-xs font-medium ${
                                  conv.qualityScore >= 70 ? 'text-green-500' :
                                  conv.qualityScore >= 50 ? 'text-yellow-500' :
                                  'text-red-500'
                                }`}>
                                  {conv.qualityScore}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Expanded conversation messages */}
                          <AnimatePresence>
                            {expandedConversation === conv.id && conv.messages && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className={`border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}
                              >
                                <div className="p-3 space-y-2 max-h-[200px] overflow-y-auto">
                                  {conv.messages.map((msg, idx) => (
                                    <div
                                      key={idx}
                                      className={`p-2 rounded text-sm ${
                                        msg.role === 'user'
                                          ? (isDark ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-50 text-blue-800')
                                          : (isDark ? 'bg-gray-600 text-gray-200' : 'bg-gray-100 text-gray-700')
                                      }`}
                                    >
                                      <span className="text-xs font-medium opacity-60">
                                        {msg.role === 'user' ? 'User' : 'AI'}:
                                      </span>
                                      <p className="mt-0.5">{msg.content}</p>
                                    </div>
                                  ))}
                                </div>
                                {onConversationSelect && (
                                  <div className={`p-2 border-t ${isDark ? 'border-gray-600' : 'border-gray-200'}`}>
                                    <button
                                      onClick={() => onConversationSelect(conv)}
                                      className="w-full px-3 py-1.5 rounded text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition-colors"
                                    >
                                      View Full Conversation
                                    </button>
                                  </div>
                                )}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`h-full flex items-center justify-center p-8 text-center ${
                  isDark ? 'text-gray-500' : 'text-gray-400'
                }`}
              >
                <div>
                  <p className="text-4xl mb-3">👈</p>
                  <p>Select an issue to see details and affected conversations</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
