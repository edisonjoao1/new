'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Types
interface Insight {
  id?: string
  type: 'positive' | 'negative' | 'neutral'
  category: string
  finding: string
  recommendation?: string
  priority?: 'critical' | 'high' | 'medium' | 'low'
  effort?: 'quick' | 'medium' | 'significant'
  impact?: 'high' | 'medium' | 'low'
  metrics?: {
    name: string
    value: number | string
  }[]
}

interface ActionItem {
  id: string
  insight: Insight
  action: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  effort: 'quick' | 'medium' | 'significant'
  impact: 'high' | 'medium' | 'low'
  category: string
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed'
}

interface ActionableInsightsCardProps {
  insights: Insight[]
  aiMetrics?: {
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
  isDark: boolean
  onActionComplete?: (actionId: string, status: 'completed' | 'dismissed') => void
}

// Priority configuration
const priorityConfig = {
  critical: {
    label: 'Critical',
    color: 'text-red-500',
    bgColor: 'bg-red-500',
    lightBg: 'bg-red-100',
    darkBg: 'bg-red-900/30',
    icon: '🔴',
    order: 4,
  },
  high: {
    label: 'High',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500',
    lightBg: 'bg-orange-100',
    darkBg: 'bg-orange-900/30',
    icon: '🟠',
    order: 3,
  },
  medium: {
    label: 'Medium',
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500',
    lightBg: 'bg-yellow-100',
    darkBg: 'bg-yellow-900/30',
    icon: '🟡',
    order: 2,
  },
  low: {
    label: 'Low',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500',
    lightBg: 'bg-blue-100',
    darkBg: 'bg-blue-900/30',
    icon: '🔵',
    order: 1,
  },
}

// Effort icons
const effortConfig = {
  quick: { label: 'Quick Win', icon: '⚡', time: '< 1 hour' },
  medium: { label: 'Medium', icon: '🔧', time: '1-4 hours' },
  significant: { label: 'Significant', icon: '🏗️', time: '> 4 hours' },
}

// Impact icons
const impactConfig = {
  high: { label: 'High Impact', icon: '🚀', color: 'text-green-500' },
  medium: { label: 'Medium Impact', icon: '📈', color: 'text-yellow-500' },
  low: { label: 'Low Impact', icon: '📊', color: 'text-blue-500' },
}

// Generate actionable items from insights
function generateActionItems(insights: Insight[], aiMetrics?: ActionableInsightsCardProps['aiMetrics']): ActionItem[] {
  const actions: ActionItem[] = []

  insights.forEach((insight, index) => {
    // Skip positive insights - focus on actionable issues
    if (insight.type === 'positive') return

    // Determine priority based on category and finding
    let priority: ActionItem['priority'] = insight.priority || 'medium'
    let effort: ActionItem['effort'] = insight.effort || 'medium'
    let impact: ActionItem['impact'] = insight.impact || 'medium'
    let action = insight.recommendation || ''

    // Auto-generate action if not provided
    if (!action) {
      const finding = insight.finding.toLowerCase()

      // Response quality issues
      if (finding.includes('too short') || finding.includes('brief')) {
        action = 'Review system prompts to encourage more detailed responses. Consider adding context requirements.'
        priority = 'high'
        effort = 'medium'
        impact = 'high'
      } else if (finding.includes('too long') || finding.includes('verbose')) {
        action = 'Add conciseness guidelines to system prompts. Implement response length limits.'
        priority = 'medium'
        effort = 'quick'
        impact = 'medium'
      }

      // Engagement issues
      else if (finding.includes('shallow') || finding.includes('single message')) {
        action = 'Implement follow-up prompts and conversation continuity features.'
        priority = 'high'
        effort = 'significant'
        impact = 'high'
      } else if (finding.includes('abandon') || finding.includes('drop-off')) {
        action = 'Analyze drop-off points and improve AI responses at those stages.'
        priority = 'critical'
        effort = 'significant'
        impact = 'high'
      }

      // Error/quality issues
      else if (finding.includes('error') || finding.includes('fail')) {
        action = 'Investigate error logs and implement better error handling.'
        priority = 'critical'
        effort = 'medium'
        impact = 'high'
      } else if (finding.includes('repetitive') || finding.includes('same response')) {
        action = 'Increase temperature or add response variation mechanisms.'
        priority = 'medium'
        effort = 'quick'
        impact = 'medium'
      }

      // Retention issues
      else if (finding.includes('retention') || finding.includes('return')) {
        action = 'Add personalization and memory features to improve user experience.'
        priority = 'high'
        effort = 'significant'
        impact = 'high'
      }

      // Default action
      else {
        action = `Review and address: ${insight.finding}`
        priority = 'medium'
        effort = 'medium'
        impact = 'medium'
      }
    }

    actions.push({
      id: insight.id || `action-${index}`,
      insight,
      action,
      priority,
      effort,
      impact,
      category: insight.category,
      status: 'pending',
    })
  })

  // Sort by priority (critical first) then by effort (quick wins first within same priority)
  return actions.sort((a, b) => {
    const priorityDiff = priorityConfig[b.priority].order - priorityConfig[a.priority].order
    if (priorityDiff !== 0) return priorityDiff

    // Within same priority, prefer quick wins with high impact
    const aScore = (a.effort === 'quick' ? 2 : a.effort === 'medium' ? 1 : 0) +
                   (a.impact === 'high' ? 2 : a.impact === 'medium' ? 1 : 0)
    const bScore = (b.effort === 'quick' ? 2 : b.effort === 'medium' ? 1 : 0) +
                   (b.impact === 'high' ? 2 : b.impact === 'medium' ? 1 : 0)
    return bScore - aScore
  })
}

export default function ActionableInsightsCard({
  insights,
  aiMetrics,
  isDark,
  onActionComplete,
}: ActionableInsightsCardProps) {
  const [expandedAction, setExpandedAction] = useState<string | null>(null)
  const [actionStatuses, setActionStatuses] = useState<Record<string, 'pending' | 'in_progress' | 'completed' | 'dismissed'>>({})
  const [showCompleted, setShowCompleted] = useState(false)
  const [filterPriority, setFilterPriority] = useState<string | null>(null)

  // Generate action items
  const actionItems = useMemo(() => {
    return generateActionItems(insights, aiMetrics)
  }, [insights, aiMetrics])

  // Filter action items
  const filteredActions = useMemo(() => {
    return actionItems.filter(item => {
      const status = actionStatuses[item.id] || item.status

      // Hide completed/dismissed unless toggled
      if (!showCompleted && (status === 'completed' || status === 'dismissed')) {
        return false
      }

      // Priority filter
      if (filterPriority && item.priority !== filterPriority) {
        return false
      }

      return true
    })
  }, [actionItems, actionStatuses, showCompleted, filterPriority])

  // Quick wins (high impact, low effort)
  const quickWins = useMemo(() => {
    return actionItems.filter(
      item => item.effort === 'quick' && item.impact === 'high' &&
              (actionStatuses[item.id] || item.status) === 'pending'
    )
  }, [actionItems, actionStatuses])

  // Stats
  const stats = useMemo(() => {
    const pending = actionItems.filter(a => (actionStatuses[a.id] || a.status) === 'pending').length
    const completed = actionItems.filter(a => actionStatuses[a.id] === 'completed').length
    const critical = actionItems.filter(a => a.priority === 'critical' && (actionStatuses[a.id] || a.status) === 'pending').length

    return { total: actionItems.length, pending, completed, critical }
  }, [actionItems, actionStatuses])

  const handleStatusChange = (actionId: string, newStatus: 'in_progress' | 'completed' | 'dismissed') => {
    setActionStatuses(prev => ({ ...prev, [actionId]: newStatus }))
    if (onActionComplete && (newStatus === 'completed' || newStatus === 'dismissed')) {
      onActionComplete(actionId, newStatus)
    }
  }

  if (actionItems.length === 0) {
    return (
      <div className={`rounded-xl border p-8 text-center ${
        isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <p className="text-4xl mb-3">✅</p>
        <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
          No actions needed!
        </p>
        <p className={`text-sm mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          Your AI assistant is performing well. Keep monitoring for new insights.
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
              <span>🎯</span>
              Action Items
              {stats.critical > 0 && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                  isDark ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'
                }`}>
                  {stats.critical} critical
                </span>
              )}
            </h3>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {stats.pending} pending • {stats.completed} completed
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Show completed toggle */}
            <button
              onClick={() => setShowCompleted(!showCompleted)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                showCompleted
                  ? (isDark ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700')
                  : (isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500')
              }`}
            >
              {showCompleted ? 'Hide' : 'Show'} Completed
            </button>

            {/* Priority filter */}
            <select
              value={filterPriority || ''}
              onChange={(e) => setFilterPriority(e.target.value || null)}
              className={`px-3 py-1.5 rounded-lg text-xs border ${
                isDark
                  ? 'bg-gray-700 border-gray-600 text-gray-200'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value="">All Priorities</option>
              <option value="critical">Critical Only</option>
              <option value="high">High Only</option>
              <option value="medium">Medium Only</option>
              <option value="low">Low Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Quick Wins Banner */}
      {quickWins.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className={`p-4 border-b ${isDark ? 'border-gray-700 bg-green-900/20' : 'border-gray-200 bg-green-50'}`}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">⚡</span>
            <span className={`font-medium ${isDark ? 'text-green-400' : 'text-green-700'}`}>
              Quick Wins Available
            </span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${
              isDark ? 'bg-green-800 text-green-300' : 'bg-green-200 text-green-800'
            }`}>
              {quickWins.length} high-impact, low-effort fixes
            </span>
          </div>
          <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-600'}`}>
            Start with these for immediate improvements: {quickWins.map(w => w.insight.category).slice(0, 2).join(', ')}
          </p>
        </motion.div>
      )}

      {/* Action Items List */}
      <div className="max-h-[500px] overflow-y-auto">
        {filteredActions.map((item, index) => {
          const status = actionStatuses[item.id] || item.status
          const isExpanded = expandedAction === item.id
          const priorityCfg = priorityConfig[item.priority]
          const effortCfg = effortConfig[item.effort]
          const impactCfg = impactConfig[item.impact]

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              className={`border-b ${isDark ? 'border-gray-700' : 'border-gray-200'} ${
                status === 'completed' ? 'opacity-50' : ''
              }`}
            >
              <div
                onClick={() => setExpandedAction(isExpanded ? null : item.id)}
                className={`p-4 cursor-pointer transition-colors ${
                  isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Priority indicator */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    isDark ? priorityCfg.darkBg : priorityCfg.lightBg
                  }`}>
                    {status === 'completed' ? '✓' : priorityCfg.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    {/* Top tags */}
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-xs font-medium ${priorityCfg.color}`}>
                        {priorityCfg.label}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                      <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {effortCfg.icon} {effortCfg.label}
                      </span>
                      <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>•</span>
                      <span className={`text-xs ${impactCfg.color}`}>
                        {impactCfg.icon} {impactCfg.label}
                      </span>
                    </div>

                    {/* Action text */}
                    <p className={`text-sm font-medium ${
                      status === 'completed'
                        ? (isDark ? 'text-gray-500 line-through' : 'text-gray-400 line-through')
                        : (isDark ? 'text-white' : 'text-gray-900')
                    }`}>
                      {item.action}
                    </p>

                    {/* Original finding */}
                    <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Based on: "{item.insight.finding}"
                    </p>
                  </div>

                  {/* Status/expand */}
                  <div className="flex items-center gap-2">
                    {status !== 'completed' && status !== 'dismissed' && (
                      <span className={`text-lg transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                        ▼
                      </span>
                    )}
                    {status === 'completed' && (
                      <span className="text-green-500">✓</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <div className="p-4 space-y-4">
                      {/* Implementation details */}
                      <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          IMPLEMENTATION DETAILS
                        </p>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>Effort</p>
                            <p className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                              {effortCfg.icon} {effortCfg.time}
                            </p>
                          </div>
                          <div>
                            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>Impact</p>
                            <p className={impactCfg.color}>
                              {impactCfg.icon} {impactCfg.label}
                            </p>
                          </div>
                          <div>
                            <p className={isDark ? 'text-gray-500' : 'text-gray-400'}>Category</p>
                            <p className={isDark ? 'text-gray-200' : 'text-gray-700'}>
                              {item.category.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex gap-2">
                        {status === 'pending' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(item.id, 'completed')
                              }}
                              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                            >
                              ✓ Mark Complete
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(item.id, 'in_progress')
                              }}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isDark ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                              }`}
                            >
                              Start Working
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(item.id, 'dismissed')
                              }}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              Dismiss
                            </button>
                          </>
                        )}
                        {status === 'in_progress' && (
                          <>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleStatusChange(item.id, 'completed')
                              }}
                              className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                            >
                              ✓ Mark Complete
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setActionStatuses(prev => ({ ...prev, [item.id]: 'pending' }))
                              }}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                isDark ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              Put Back
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Empty state */}
      {filteredActions.length === 0 && (
        <div className={`p-8 text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          <p>No actions match your filters.</p>
          <button
            onClick={() => {
              setFilterPriority(null)
              setShowCompleted(true)
            }}
            className={`mt-2 text-sm ${isDark ? 'text-purple-400' : 'text-purple-600'}`}
          >
            Clear filters
          </button>
        </div>
      )}

      {/* Progress footer */}
      {stats.total > 0 && (
        <div className={`p-4 border-t ${isDark ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Progress
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-700'}`}>
              {stats.completed} / {stats.total} completed
            </span>
          </div>
          <div className={`h-2 rounded-full ${isDark ? 'bg-gray-600' : 'bg-gray-200'}`}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(stats.completed / stats.total) * 100}%` }}
              className="h-2 rounded-full bg-green-500"
            />
          </div>
        </div>
      )}
    </div>
  )
}
