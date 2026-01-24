'use client'

import { motion, AnimatePresence } from 'framer-motion'
import {
  X,
  Brain,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Users,
  MessageSquare,
  TrendingUp,
  TrendingDown,
  Target,
  Zap,
  PieChart,
  Globe,
  Clock,
  Settings,
  ChevronDown,
  ChevronUp,
  Calendar,
  XCircle,
  Activity,
  BarChart3,
  ArrowRight,
  Sparkles,
  Shield,
  Star,
} from 'lucide-react'
import { useState } from 'react'
import QualityGauge, { QualityBadge } from './QualityGauge'

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
  userMetrics: {
    totalUsers: number
    activeUsers24h: number
    activeUsers7d: number
    avgConversationsPerUser: number
    avgMessagesPerConversation: number
    topLocales: { locale: string; count: number }[]
    topDevices: { device: string; count: number }[]
    appVersions: { version: string; count: number }[]
  }
  aiMetrics: {
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

interface EvaluationDetailModalProps {
  item: HistoryItem
  isOpen: boolean
  onClose: () => void
  isDark: boolean
  onLoadEvaluation?: () => void
}

export default function EvaluationDetailModal({
  item,
  isOpen,
  onClose,
  isDark,
  onLoadEvaluation,
}: EvaluationDetailModalProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['summary', 'quickWins', 'issues'])
  )
  const [activeTab, setActiveTab] = useState<'overview' | 'issues' | 'patterns' | 'recommendations' | 'journey'>('overview')

  const toggleSection = (section: string) => {
    const newSections = new Set(expandedSections)
    if (newSections.has(section)) {
      newSections.delete(section)
    } else {
      newSections.add(section)
    }
    setExpandedSections(newSections)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500 text-white'
      case 'high': return 'bg-orange-500 text-white'
      case 'medium': return 'bg-yellow-500 text-black'
      case 'low': return 'bg-blue-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-purple-500 text-white'
      case 'medium': return 'bg-blue-500 text-white'
      case 'low': return 'bg-gray-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'common': return 'bg-green-500 text-white'
      case 'occasional': return 'bg-blue-500 text-white'
      case 'rare': return 'bg-gray-500 text-white'
      default: return 'bg-gray-500 text-white'
    }
  }

  if (!isOpen) return null

  const aiAnalysis = item.aiAnalysis

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto pt-10 pb-10"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Backdrop */}
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.95 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className={`relative w-full max-w-6xl mx-4 rounded-2xl shadow-2xl overflow-hidden ${
            isDark ? 'bg-gray-900' : 'bg-white'
          }`}
        >
          {/* Header */}
          <div className={`sticky top-0 z-10 p-6 border-b ${
            isDark
              ? 'bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border-purple-500/30'
              : 'bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200'
          } backdrop-blur-lg`}>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${isDark ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                  <Brain className={`w-8 h-8 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
                </div>
                <div>
                  <h2 className={`text-2xl font-bold flex items-center gap-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    <span>Evaluation Report</span>
                    {aiAnalysis && <QualityBadge score={aiAnalysis.overallQuality} showScore />}
                  </h2>
                  <p className={`text-sm mt-1 flex items-center gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <Calendar className="w-4 h-4" />
                    {item.date || item.analysisDate || 'All Time'} • Generated {formatDate(item.createdAt || item.generatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {onLoadEvaluation && (
                  <button
                    onClick={onLoadEvaluation}
                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                      isDark
                        ? 'bg-purple-600 hover:bg-purple-500 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    }`}
                  >
                    <ArrowRight className="w-4 h-4" />
                    Load Full View
                  </button>
                )}
                <button
                  onClick={onClose}
                  className={`p-2 rounded-lg transition-colors ${
                    isDark ? 'hover:bg-white/10 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
                  }`}
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Stats Bar */}
            <div className="flex flex-wrap gap-4 mt-4">
              <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-white/80'}`}>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Conversations</span>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item.conversationsAnalyzed || item.aiMetrics?.totalConversations || 0}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-white/80'}`}>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Messages</span>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item.aiMetrics?.totalMessages || 0}
                </p>
              </div>
              <div className={`px-4 py-2 rounded-lg ${isDark ? 'bg-white/10' : 'bg-white/80'}`}>
                <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Avg Length</span>
                <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {item.aiMetrics?.avgConversationLength?.toFixed(1) || 0}
                </p>
              </div>
              {item.successMetrics && (
                <>
                  <div className={`px-4 py-2 rounded-lg bg-green-500/20`}>
                    <span className={`text-sm text-green-400`}>Success Rate</span>
                    <p className={`text-lg font-bold text-green-400`}>
                      {item.successMetrics.avgSuccessScore}%
                    </p>
                  </div>
                </>
              )}
            </div>

            {/* Tab Navigation */}
            {aiAnalysis && (
              <div className="flex gap-1 mt-4 overflow-x-auto pb-1">
                {[
                  { id: 'overview', label: 'Overview', icon: BarChart3 },
                  { id: 'issues', label: `Issues (${aiAnalysis.issuesFound.length})`, icon: AlertTriangle },
                  { id: 'patterns', label: `Patterns (${aiAnalysis.successPatterns.length})`, icon: CheckCircle },
                  { id: 'recommendations', label: 'Recommendations', icon: Settings },
                  { id: 'journey', label: 'User Journey', icon: Users },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? (isDark ? 'bg-white/20 text-white' : 'bg-purple-100 text-purple-700')
                        : (isDark ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100')
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 max-h-[70vh] overflow-y-auto">
            {!aiAnalysis ? (
              <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                <Brain className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No AI Analysis Available</h3>
                <p>This evaluation was run without AI analysis enabled.</p>
                <p className="text-sm mt-4">Basic metrics are available in the header above.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <motion.div
                    key="overview"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {/* Quality Score & Summary */}
                    <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                      <div className="flex items-start gap-6">
                        <QualityGauge score={aiAnalysis.overallQuality} label="Overall Quality" size="lg" />
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                            Executive Summary
                          </h3>
                          <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                            {aiAnalysis.summary}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Quick Wins */}
                    {aiAnalysis.quickWins && aiAnalysis.quickWins.length > 0 && (
                      <div className={`p-5 rounded-xl ${
                        isDark
                          ? 'bg-gradient-to-br from-green-900/30 to-emerald-900/30 border border-green-700/50'
                          : 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200'
                      }`}>
                        <h3 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                          <Zap className="w-5 h-5" />
                          Quick Wins - Implement Today
                        </h3>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {aiAnalysis.quickWins.map((win, i) => (
                            <motion.div
                              key={i}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: i * 0.1 }}
                              className={`p-3 rounded-lg flex items-start gap-2 ${isDark ? 'bg-green-900/30' : 'bg-white'}`}
                            >
                              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                              <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>{win}</p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Category Breakdown */}
                    {aiAnalysis.conversationBreakdown.length > 0 && (
                      <div className={`p-5 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white border border-gray-200'}`}>
                        <h3 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          <PieChart className="w-5 h-5 text-blue-500" />
                          Quality by Category
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                          {aiAnalysis.conversationBreakdown.map((cat, i) => (
                            <div key={i} className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {cat.category}
                                </span>
                                <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {cat.count} convos
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      cat.avgQuality >= 80 ? 'bg-green-500' :
                                      cat.avgQuality >= 60 ? 'bg-yellow-500' :
                                      cat.avgQuality >= 40 ? 'bg-orange-500' : 'bg-red-500'
                                    }`}
                                    style={{ width: `${cat.avgQuality}%` }}
                                  />
                                </div>
                                <span className={`text-lg font-bold ${
                                  cat.avgQuality >= 80 ? 'text-green-500' :
                                  cat.avgQuality >= 60 ? 'text-yellow-500' :
                                  cat.avgQuality >= 40 ? 'text-orange-500' : 'text-red-500'
                                }`}>
                                  {cat.avgQuality}
                                </span>
                              </div>
                              <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                {cat.notes}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Segment Insights */}
                    {aiAnalysis.segmentInsights && aiAnalysis.segmentInsights.length > 0 && (
                      <div className={`p-5 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-white border border-gray-200'}`}>
                        <h3 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          <Globe className="w-5 h-5 text-indigo-500" />
                          Segment Analysis
                        </h3>
                        <div className="space-y-3">
                          {aiAnalysis.segmentInsights.map((segment, i) => (
                            <div key={i} className={`p-4 rounded-lg ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {segment.segment}
                                </span>
                                <span className={`text-lg font-bold ${
                                  segment.quality >= 80 ? 'text-green-500' :
                                  segment.quality >= 60 ? 'text-yellow-500' :
                                  segment.quality >= 40 ? 'text-orange-500' : 'text-red-500'
                                }`}>
                                  {segment.quality}/100
                                </span>
                              </div>
                              {segment.specificIssues.length > 0 && (
                                <ul className="space-y-1 mt-2">
                                  {segment.specificIssues.map((issue, j) => (
                                    <li key={j} className={`text-sm flex items-start gap-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                                      <span className="text-orange-500 mt-1">•</span>
                                      {issue}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Issues Tab */}
                {activeTab === 'issues' && (
                  <motion.div
                    key="issues"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {aiAnalysis.issuesFound.length === 0 ? (
                      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
                        <h3 className="text-lg font-semibold mb-2">No Issues Found</h3>
                        <p>Great job! The AI analysis detected no significant issues.</p>
                      </div>
                    ) : (
                      <>
                        {/* Issues by Severity */}
                        {['critical', 'high', 'medium', 'low'].map((severity) => {
                          const issues = aiAnalysis.issuesFound.filter(i => i.severity === severity)
                          if (issues.length === 0) return null

                          return (
                            <div key={severity} className="space-y-3">
                              <h3 className={`text-sm font-semibold uppercase tracking-wider flex items-center gap-2 ${
                                severity === 'critical' ? 'text-red-500' :
                                severity === 'high' ? 'text-orange-500' :
                                severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                              }`}>
                                <AlertTriangle className="w-4 h-4" />
                                {severity} Priority ({issues.length})
                              </h3>
                              {issues.map((issue, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: i * 0.05 }}
                                  className={`p-5 rounded-xl border ${
                                    severity === 'critical' ? 'bg-red-500/10 border-red-500/30' :
                                    severity === 'high' ? 'bg-orange-500/10 border-orange-500/30' :
                                    severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                                    'bg-blue-500/10 border-blue-500/30'
                                  }`}
                                >
                                  <div className="flex items-start gap-4">
                                    <div className={`p-2 rounded-lg flex-shrink-0 ${getSeverityColor(severity)}`}>
                                      <AlertTriangle className="w-5 h-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(severity)}`}>
                                          {severity.toUpperCase()}
                                        </span>
                                        {issue.affectedUsers && (
                                          <span className={`px-2 py-0.5 rounded text-xs ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                            Affects: {issue.affectedUsers}
                                          </span>
                                        )}
                                      </div>
                                      <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                        {issue.issue}
                                      </h4>
                                      {issue.example && (
                                        <div className={`mb-3 p-3 rounded-lg italic text-sm ${
                                          isDark ? 'bg-black/20 text-gray-400 border-l-2 border-gray-600' : 'bg-gray-100 text-gray-600 border-l-2 border-gray-300'
                                        }`}>
                                          "{issue.example}"
                                        </div>
                                      )}
                                      <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`}>
                                        <p className={`text-sm flex items-start gap-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                                          <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                          <span className="font-medium">{issue.recommendation}</span>
                                        </p>
                                      </div>
                                      {issue.expectedImpact && (
                                        <p className={`text-xs mt-2 flex items-center gap-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                          <Sparkles className="w-3 h-3" />
                                          Expected Impact: {issue.expectedImpact}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          )
                        })}
                      </>
                    )}
                  </motion.div>
                )}

                {/* Patterns Tab */}
                {activeTab === 'patterns' && (
                  <motion.div
                    key="patterns"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {aiAnalysis.successPatterns.map((pattern, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-5 rounded-xl bg-green-500/10 border border-green-500/30`}
                      >
                        <div className="flex items-start gap-4">
                          <div className="p-2 rounded-lg bg-green-500/20 flex-shrink-0">
                            <Star className="w-5 h-5 text-green-500" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getFrequencyColor(pattern.frequency)}`}>
                                {pattern.frequency.toUpperCase()}
                              </span>
                            </div>
                            <h4 className={`font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {pattern.pattern}
                            </h4>
                            {pattern.example && (
                              <div className={`mb-3 p-3 rounded-lg italic text-sm ${
                                isDark ? 'bg-green-900/30 text-green-300 border-l-2 border-green-500' : 'bg-green-50 text-green-700 border-l-2 border-green-400'
                              }`}>
                                "{pattern.example}"
                              </div>
                            )}
                            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              <span className="font-medium">Impact:</span> {pattern.impact}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* Recommendations Tab */}
                {activeTab === 'recommendations' && (
                  <motion.div
                    key="recommendations"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    {aiAnalysis.promptRecommendations.map((rec, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`p-5 rounded-xl border ${
                          rec.priority === 'high' ? 'bg-purple-500/10 border-purple-500/30' :
                          rec.priority === 'medium' ? 'bg-blue-500/10 border-blue-500/30' :
                          'bg-gray-500/10 border-gray-500/30'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-4">
                          <span className={`px-3 py-1 rounded text-xs font-medium ${getPriorityColor(rec.priority)}`}>
                            {rec.priority.toUpperCase()} PRIORITY
                          </span>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              Current Behavior
                            </p>
                            <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {rec.currentBehavior}
                            </p>
                          </div>
                          <div>
                            <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                              Suggested Change
                            </p>
                            <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              {rec.suggestedChange}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-dashed" style={{ borderColor: isDark ? '#374151' : '#e5e7eb' }}>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className={`p-3 rounded-lg ${isDark ? 'bg-green-900/20' : 'bg-green-50'}`}>
                              <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-green-500' : 'text-green-600'}`}>
                                Expected Impact
                              </p>
                              <p className={`text-sm ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                                {rec.expectedImpact}
                              </p>
                            </div>
                            {rec.risk && (
                              <div className={`p-3 rounded-lg ${isDark ? 'bg-orange-900/20' : 'bg-orange-50'}`}>
                                <p className={`text-xs uppercase tracking-wide mb-1 ${isDark ? 'text-orange-500' : 'text-orange-600'}`}>
                                  Risk
                                </p>
                                <p className={`text-sm ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
                                  {rec.risk}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}

                {/* User Journey Tab */}
                {activeTab === 'journey' && (
                  <motion.div
                    key="journey"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-6"
                  >
                    {aiAnalysis.userJourneyInsights ? (() => {
                      const journey = aiAnalysis.userJourneyInsights!
                      return (
                        <>
                          {/* Return User Experience */}
                          <div className={`p-5 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                            <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                              <Users className="w-5 h-5 text-cyan-500" />
                              Return User Experience
                            </h3>
                            <p className={`${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                              {journey.returnUserQuality}
                            </p>
                          </div>

                          {/* First Impressions */}
                          {journey.firstImpressionIssues && journey.firstImpressionIssues.length > 0 && (
                            <div className={`p-5 rounded-xl ${isDark ? 'bg-red-900/20 border border-red-700/50' : 'bg-red-50 border border-red-200'}`}>
                              <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                                <XCircle className="w-5 h-5" />
                                First Impression Issues
                              </h3>
                              <ul className="space-y-2">
                                {journey.firstImpressionIssues.map((issue, i) => (
                                  <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-red-300' : 'text-red-600'}`}>
                                    <span className="mt-1">•</span>
                                    {issue}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Loyal User Patterns */}
                          {journey.loyalUserPatterns && journey.loyalUserPatterns.length > 0 && (
                            <div className={`p-5 rounded-xl ${isDark ? 'bg-green-900/20 border border-green-700/50' : 'bg-green-50 border border-green-200'}`}>
                              <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-green-400' : 'text-green-700'}`}>
                                <Star className="w-5 h-5" />
                                What Keeps Users Coming Back
                              </h3>
                              <ul className="space-y-2">
                                {journey.loyalUserPatterns.map((pattern, i) => (
                                  <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    {pattern}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Churn Risks */}
                          {journey.churnRisks && journey.churnRisks.length > 0 && (
                            <div className={`p-5 rounded-xl ${isDark ? 'bg-orange-900/20 border border-orange-700/50' : 'bg-orange-50 border border-orange-200'}`}>
                              <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
                                <Shield className="w-5 h-5" />
                                Churn Risks
                              </h3>
                              <ul className="space-y-2">
                                {journey.churnRisks.map((risk, i) => (
                                  <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-orange-300' : 'text-orange-600'}`}>
                                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    {risk}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Recommended Fixes */}
                          {journey.recommendedJourneyFixes && journey.recommendedJourneyFixes.length > 0 && (
                            <div className={`p-5 rounded-xl ${isDark ? 'bg-purple-900/20 border border-purple-700/50' : 'bg-purple-50 border border-purple-200'}`}>
                              <h3 className={`font-semibold mb-3 flex items-center gap-2 ${isDark ? 'text-purple-400' : 'text-purple-700'}`}>
                                <Lightbulb className="w-5 h-5" />
                                Recommended Journey Improvements
                              </h3>
                              <ul className="space-y-2">
                                {journey.recommendedJourneyFixes.map((fix, i) => (
                                  <li key={i} className={`flex items-start gap-2 text-sm ${isDark ? 'text-purple-300' : 'text-purple-600'}`}>
                                    <ArrowRight className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    {fix}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </>
                      )
                    })() : (
                      <div className={`text-center py-12 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No Journey Insights</h3>
                        <p>User journey analysis not available for this evaluation.</p>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
