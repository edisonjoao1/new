'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import {
  ArrowLeft,
  Brain,
  MessageSquare,
  Users,
  TrendingUp,
  TrendingDown,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Globe,
  Smartphone,
  Calendar,
  Filter,
  Download,
  Play,
  Pause,
  Eye,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Lightbulb,
  Settings,
  History,
  Sun,
  Moon,
  Lock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  PieChart as RechartsPieChart,
  Pie,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import QualityTrendsChart from '@/components/analytics/QualityTrendsChart'
import EvaluationComparison from '@/components/analytics/EvaluationComparison'
import IssuesDrilldown from '@/components/analytics/IssuesDrilldown'
import QualityGauge, { QualityBadge } from '@/components/analytics/QualityGauge'
import StatCard from '@/components/analytics/StatCard'
import { AIAnalysisSkeleton, DashboardSkeleton, ChartSkeleton } from '@/components/analytics/LoadingSkeletons'
import EvaluationDetailModal from '@/components/analytics/EvaluationDetailModal'
import SystemPromptEditor from '@/components/analytics/SystemPromptEditor'

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

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: any
}

interface ConversationSuccess {
  score: number
  classification: 'successful' | 'partial' | 'failed' | 'abandoned'
  reasons: string[]
  indicators: {
    userReturned: boolean
    expressedThanks: boolean
    gotAnswer: boolean
    hadFollowUp: boolean
    endedPositively: boolean
  }
}

interface FullConversation {
  id: string
  userId: string
  messages: Message[]
  messageCount: number
  createdAt: Date | null
  lastMessageAt: Date | null
  topics: string[]
  topicDetails: { topic: string; confidence: number; examples: string[] }[]
  success: ConversationSuccess
  sentiment: 'positive' | 'neutral' | 'negative' | 'unknown'
  language: string
  userEngagementScore: number
}

interface SuccessMetrics {
  successful: number
  partial: number
  failed: number
  abandoned: number
  avgSuccessScore: number
  topSuccessIndicators: string[]
  topFailureReasons: string[]
}

interface TopicBreakdown {
  topic: string
  count: number
  avgSuccessScore: number
  avgEngagement: number
  examples: string[]
}

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

interface EvaluationData {
  userMetrics: UserMetrics
  aiMetrics: AIMetrics
  recentConversations: {
    id: string
    preview: string
    messageCount: number
    timestamp: Date | null
  }[]
  fullConversations: FullConversation[]
  successMetrics: SuccessMetrics
  topicBreakdown: TopicBreakdown[]
  insights: {
    type: 'positive' | 'negative' | 'neutral'
    category: string
    finding: string
    recommendation?: string
  }[]
  aiAnalysis?: AIAnalysisResult | null
  analysisDate: string  // YYYY-MM-DD format
  generatedAt: string
  cached: boolean
  sampleSize: number
  conversationsAnalyzed: number
}

interface HistoryItem {
  id: string
  date: string  // YYYY-MM-DD
  analysisDate: string
  generatedAt: string
  createdAt: string
  sampleSize: number
  conversationsAnalyzed: number
  userMetrics: UserMetrics
  aiMetrics: AIMetrics
  successMetrics?: SuccessMetrics
  insights: EvaluationData['insights']
  aiAnalysis?: AIAnalysisResult | null
}

interface ActionItem {
  id: string
  title: string
  description: string
  category: 'engagement' | 'quality' | 'retention' | 'content' | 'technical'
  priority: 'critical' | 'high' | 'medium' | 'low'
  status: 'pending' | 'in_progress' | 'completed' | 'dismissed'
  impact: string
  effort: 'low' | 'medium' | 'high'
  createdAt: string
  dueDate?: string
  notes?: string
}

const COLORS = {
  primary: '#8B5CF6',
  success: '#10B981',
  warning: '#F59E0B',
  danger: '#EF4444',
  info: '#3B82F6',
  neutral: '#6B7280',
}

const CHART_COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#EC4899', '#06B6D4', '#84CC16']

export default function AIEvaluationPage() {
  const searchParams = useSearchParams()
  const urlDate = searchParams.get('date')

  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecking, setAuthChecking] = useState(true) // Prevent flash of login form
  const [data, setData] = useState<EvaluationData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(false)
  const [activeSection, setActiveSection] = useState<string>('overview')
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState<FullConversation | null>(null)
  const [actionItems, setActionItems] = useState<ActionItem[]>([])
  const [selectedDate, setSelectedDate] = useState<string>(urlDate || new Date().toISOString().split('T')[0])
  const [isHistoricalMode, setIsHistoricalMode] = useState(false)
  const [conversationFilter, setConversationFilter] = useState<'all' | 'successful' | 'partial' | 'failed' | 'abandoned'>('all')
  const [topicFilter, setTopicFilter] = useState<string>('all')
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set())
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([])
  const [loadingPromptAnalysis, setLoadingPromptAnalysis] = useState(false)
  const [currentPrompt, setCurrentPrompt] = useState<{ id: string; version: number; prompt: string; notes?: string; updatedAt: string } | null>(null)
  const [promptHistory, setPromptHistory] = useState<{ id: string; version: number; prompt: string; notes?: string; createdAt: string }[]>([])
  const [editedPrompt, setEditedPrompt] = useState('')
  const [isEditingPrompt, setIsEditingPrompt] = useState(false)
  const [savingPrompt, setSavingPrompt] = useState(false)
  const [promptNotes, setPromptNotes] = useState('')
  const [loadingPrompt, setLoadingPrompt] = useState(false)
  const [runWithAI, setRunWithAI] = useState(true) // Enable AI analysis by default
  const [aiAnalysisLoading, setAiAnalysisLoading] = useState(false)
  const [historySubView, setHistorySubView] = useState<'trends' | 'compare' | 'list'>('trends')
  const [insightsViewMode, setInsightsViewMode] = useState<'cards' | 'drilldown'>('cards')
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<HistoryItem | null>(null)

  // Check for stored auth
  useEffect(() => {
    const storedKey = sessionStorage.getItem('analytics_key')
    if (storedKey) {
      setPassword(storedKey)
      setIsAuthenticated(true)
    }
    const storedDarkMode = localStorage.getItem('analytics_dark_mode')
    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode))
    }
    setAuthChecking(false) // Done checking auth
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // Auto-load evaluation when there's a date in URL and user is authenticated
  useEffect(() => {
    if (!isAuthenticated || !urlDate || authChecking) return

    const loadEvaluationForDate = async () => {
      setLoading(true)
      const key = password || sessionStorage.getItem('analytics_key')
      if (!key) return

      try {
        // First fetch history to find the evaluation for this date
        const historyResponse = await fetch(`/api/analytics/ai-evaluation?key=${encodeURIComponent(key)}&history=true&limit=30`)
        const historyResult = await historyResponse.json()

        if (historyResponse.ok && historyResult.history) {
          setHistory(historyResult.history)

          // Find evaluation matching the URL date
          const matchingEval = historyResult.history.find((item: HistoryItem) =>
            item.date === urlDate || item.analysisDate === urlDate ||
            (item.createdAt && item.createdAt.startsWith(urlDate))
          )

          if (matchingEval) {
            // Load the found evaluation data
            setData({
              userMetrics: matchingEval.userMetrics,
              aiMetrics: matchingEval.aiMetrics,
              insights: matchingEval.insights || [],
              generatedAt: matchingEval.generatedAt || matchingEval.createdAt,
              cached: true,
              sampleSize: matchingEval.sampleSize,
              recentConversations: [],
              fullConversations: matchingEval.fullConversations || [],
              aiAnalysis: matchingEval.aiAnalysis || null,
              successMetrics: matchingEval.successMetrics || { successful: 0, partial: 0, failed: 0, abandoned: 0, avgSuccessScore: 0, topSuccessIndicators: [], topFailureReasons: [] },
              topicBreakdown: matchingEval.topicBreakdown || [],
              analysisDate: urlDate,
              conversationsAnalyzed: matchingEval.conversationsAnalyzed || matchingEval.aiMetrics?.totalConversations || 0,
            })
            setSelectedDate(urlDate)
          }
        }
      } catch (err) {
        console.error('Failed to load evaluation for date:', err)
      } finally {
        setLoading(false)
      }
    }

    loadEvaluationForDate()
  }, [isAuthenticated, urlDate, authChecking])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    sessionStorage.setItem('analytics_key', password)
    setIsAuthenticated(true)
  }

  const runEvaluation = async () => {
    setLoading(true)
    setError(null)
    if (runWithAI) setAiAnalysisLoading(true)

    const key = password || sessionStorage.getItem('analytics_key')
    if (!key) {
      setError('No authentication key')
      setLoading(false)
      setAiAnalysisLoading(false)
      return
    }

    try {
      const response = await fetch('/api/analytics/ai-evaluation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          date: isHistoricalMode ? null : selectedDate,  // null = historical/all-time
          sampleSize: 500,  // Max users to scan
          runAIAnalysis: runWithAI,  // Enable AI-powered analysis
          systemPrompt: currentPrompt?.prompt  // Pass current system prompt for context
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setError(result.error || result.message || 'Failed to run evaluation')
        return
      }

      setData(result)
      generateActionItems(result)
      fetchHistory()

      // Auto-switch to AI Analysis tab if we ran with AI
      if (runWithAI && result.aiAnalysis) {
        setActiveSection('ai-analysis')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to run evaluation')
    } finally {
      setLoading(false)
      setAiAnalysisLoading(false)
    }
  }

  const fetchHistory = async () => {
    setHistoryLoading(true)
    const key = password || sessionStorage.getItem('analytics_key')
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

  const generateActionItems = (evalData: EvaluationData) => {
    const items: ActionItem[] = []
    const now = new Date().toISOString()

    // Based on insights
    evalData.insights.forEach((insight, i) => {
      if (insight.recommendation) {
        items.push({
          id: `insight-${i}`,
          title: insight.recommendation.split('.')[0],
          description: insight.recommendation,
          category: insight.category as ActionItem['category'],
          priority: insight.type === 'negative' ? 'high' : 'medium',
          status: 'pending',
          impact: insight.finding,
          effort: 'medium',
          createdAt: now,
        })
      }
    })

    // Based on metrics
    const { aiMetrics, userMetrics } = evalData

    // Response quality issues
    const totalResponses = aiMetrics.responseQuality.tooShort + aiMetrics.responseQuality.appropriate + aiMetrics.responseQuality.tooLong
    const tooShortPct = totalResponses > 0 ? (aiMetrics.responseQuality.tooShort / totalResponses) * 100 : 0

    if (tooShortPct > 20) {
      items.push({
        id: 'quality-short-responses',
        title: 'Improve response completeness',
        description: `${tooShortPct.toFixed(0)}% of AI responses are too short (<50 characters). Update system prompt to encourage more detailed, helpful responses.`,
        category: 'quality',
        priority: tooShortPct > 40 ? 'critical' : 'high',
        status: 'pending',
        impact: `Improve user satisfaction and engagement`,
        effort: 'low',
        createdAt: now,
      })
    }

    // Engagement issues
    const totalConvs = aiMetrics.conversationDepth.shallow + aiMetrics.conversationDepth.moderate + aiMetrics.conversationDepth.deep
    const shallowPct = totalConvs > 0 ? (aiMetrics.conversationDepth.shallow / totalConvs) * 100 : 0

    if (shallowPct > 60) {
      items.push({
        id: 'engagement-shallow',
        title: 'Increase conversation engagement',
        description: `${shallowPct.toFixed(0)}% of conversations are shallow (1-2 exchanges). Consider adding follow-up questions or suggestions in AI responses.`,
        category: 'engagement',
        priority: 'high',
        status: 'pending',
        impact: 'Increase average conversation length and user retention',
        effort: 'medium',
        createdAt: now,
      })
    }

    // Low active users
    if (userMetrics.activeUsers24h < userMetrics.totalUsers * 0.05) {
      items.push({
        id: 'retention-daily',
        title: 'Improve daily active user rate',
        description: `Only ${((userMetrics.activeUsers24h / userMetrics.totalUsers) * 100).toFixed(1)}% of users are active daily. Consider push notifications or daily engagement hooks.`,
        category: 'retention',
        priority: 'high',
        status: 'pending',
        impact: 'Increase DAU/MAU ratio',
        effort: 'high',
        createdAt: now,
      })
    }

    setActionItems(items)
  }

  const updateActionStatus = (id: string, status: ActionItem['status']) => {
    setActionItems(items =>
      items.map(item => item.id === id ? { ...item, status } : item)
    )
  }

  const fetchPrompt = async () => {
    setLoadingPrompt(true)
    const key = password || sessionStorage.getItem('analytics_key')
    if (!key) return

    try {
      const response = await fetch(`/api/analytics/system-prompt?key=${encodeURIComponent(key)}&history=true&limit=10`)
      const result = await response.json()
      if (response.ok) {
        if (result.current) {
          setCurrentPrompt(result.current)
          setEditedPrompt(result.current.prompt)
        }
        if (result.history) {
          setPromptHistory(result.history)
        }
      }
    } catch (err) {
      console.error('Failed to fetch prompt:', err)
    } finally {
      setLoadingPrompt(false)
    }
  }

  const savePrompt = async () => {
    setSavingPrompt(true)
    const key = password || sessionStorage.getItem('analytics_key')
    if (!key) return

    try {
      const response = await fetch('/api/analytics/system-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          prompt: editedPrompt,
          notes: promptNotes || `Updated on ${new Date().toLocaleDateString()}`,
        }),
      })

      const result = await response.json()
      if (response.ok) {
        setCurrentPrompt(result.prompt)
        setIsEditingPrompt(false)
        setPromptNotes('')
        fetchPrompt() // Refresh history
      } else {
        setError(result.error || 'Failed to save prompt')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save prompt')
    } finally {
      setSavingPrompt(false)
    }
  }

  const revertToVersion = async (versionId: string) => {
    const key = password || sessionStorage.getItem('analytics_key')
    if (!key) return

    try {
      const response = await fetch('/api/analytics/system-prompt', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key, versionId }),
      })

      const result = await response.json()
      if (response.ok) {
        setCurrentPrompt(result.prompt)
        setEditedPrompt(result.prompt.prompt)
        fetchPrompt() // Refresh history
      } else {
        setError(result.error || 'Failed to revert')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revert')
    }
  }

  // Fetch prompt when authenticated and on prompt tab
  useEffect(() => {
    if (isAuthenticated && activeSection === 'prompt' && !currentPrompt) {
      fetchPrompt()
    }
  }, [isAuthenticated, activeSection])

  // Fetch history when authenticated
  useEffect(() => {
    if (isAuthenticated && history.length === 0) {
      fetchHistory()
    }
  }, [isAuthenticated])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500'
      case 'high': return 'bg-orange-500'
      case 'medium': return 'bg-yellow-500'
      case 'low': return 'bg-blue-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'in_progress': return <Play className="w-5 h-5 text-blue-500" />
      case 'dismissed': return <XCircle className="w-5 h-5 text-gray-400" />
      default: return <Clock className="w-5 h-5 text-yellow-500" />
    }
  }

  const getSuccessColor = (classification: string) => {
    switch (classification) {
      case 'successful': return 'text-green-500 bg-green-100 dark:bg-green-900/30'
      case 'partial': return 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
      case 'failed': return 'text-red-500 bg-red-100 dark:bg-red-900/30'
      case 'abandoned': return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30'
      default: return 'text-gray-500 bg-gray-100 dark:bg-gray-900/30'
    }
  }

  const getSentimentIcon = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-green-500" />
      case 'negative': return <ThumbsDown className="w-4 h-4 text-red-500" />
      default: return <MessageCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getLanguageFlag = (lang: string) => {
    switch (lang) {
      case 'es': return '🇪🇸'
      case 'en': return '🇺🇸'
      case 'fr': return '🇫🇷'
      case 'pt': return '🇧🇷'
      default: return '🌐'
    }
  }

  const filteredConversations = data?.fullConversations?.filter(conv => {
    if (conversationFilter !== 'all' && conv.success.classification !== conversationFilter) return false
    if (topicFilter !== 'all' && !conv.topics.includes(topicFilter)) return false
    return true
  }) || []

  // Loading state while checking auth
  if (authChecking) {
    return (
      <main className={`${darkMode ? 'dark' : ''} bg-white dark:bg-gray-950 text-black dark:text-white min-h-screen flex items-center justify-center px-6`}>
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 animate-pulse">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        </div>
      </main>
    )
  }

  // Login screen
  if (!isAuthenticated) {
    return (
      <main className={`${darkMode ? 'dark' : ''} bg-white dark:bg-gray-950 text-black dark:text-white min-h-screen flex items-center justify-center px-6`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-light mb-2 tracking-tight">AI Evaluation Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 font-light">Analyze AI conversation quality & performance</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-purple-500 transition-colors font-light bg-white dark:bg-gray-900"
            />
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-light"
            >
              Access Dashboard
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/analytics" className="text-sm text-purple-600 hover:text-purple-700">
              ← Back to Analytics
            </Link>
          </div>
        </motion.div>
      </main>
    )
  }

  return (
    <main className={`${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-950 text-black dark:text-white min-h-screen`}>
      {/* Header */}
      <header className={`sticky top-0 z-50 ${darkMode ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/analytics" className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div>
                <h1 className="text-xl font-semibold flex items-center gap-2">
                  <Brain className="w-6 h-6 text-purple-500" />
                  AI Evaluation Dashboard
                </h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  inteligencia-artificial-6a543
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Date Selection */}
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                {isHistoricalMode ? (
                  <span className={`text-sm font-medium ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                    All Historical Data
                  </span>
                ) : (
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                    className={`px-3 py-1.5 rounded-lg text-sm ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'} border`}
                  />
                )}
              </div>

              {/* Historical Mode Toggle */}
              <button
                onClick={() => setIsHistoricalMode(!isHistoricalMode)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  isHistoricalMode
                    ? 'bg-purple-600 text-white'
                    : darkMode ? 'bg-gray-800 border-gray-700 text-gray-300 border' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {isHistoricalMode ? 'Historical' : 'Daily'}
              </button>

              {/* Dark Mode */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>

              {/* Run Evaluation */}
              <Button
                onClick={runEvaluation}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    {isHistoricalMode ? 'Run Historical Analysis' : `Analyze ${selectedDate}`}
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex gap-1 mt-4 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'ai-analysis', label: 'AI Analysis', icon: Brain },
              { id: 'success', label: 'Success Analysis', icon: Target },
              { id: 'conversations', label: 'Conversation Explorer', icon: MessageSquare },
              { id: 'topics', label: 'Topic Breakdown', icon: PieChart },
              { id: 'quality', label: 'Response Quality', icon: Activity },
              { id: 'users', label: 'User Insights', icon: Users },
              { id: 'prompt', label: 'System Prompt', icon: Settings },
              { id: 'actions', label: 'Action Items', icon: Lightbulb },
              { id: 'history', label: 'Daily Reports', icon: History },
              { id: 'database', label: 'Raw Database', icon: Eye },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                  activeSection === tab.id
                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                    : darkMode ? 'text-gray-400 hover:text-white hover:bg-gray-800' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {tab.id === 'actions' && actionItems.filter(i => i.status === 'pending').length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {actionItems.filter(i => i.status === 'pending').length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}

        {!data && !loading && (
          <div className="text-center py-20">
            <Brain className="w-16 h-16 mx-auto mb-4 text-purple-500 opacity-50" />
            <h2 className="text-2xl font-light mb-2">No Evaluation Data</h2>
            <p className={`mb-6 max-w-lg mx-auto ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {isHistoricalMode
                ? 'Run a historical analysis to evaluate all past conversations. This is recommended for your first run to establish a baseline.'
                : `Run a daily analysis for ${selectedDate} to track conversation quality over time.`}
            </p>
            <div className="flex flex-col items-center gap-4">
              <Button onClick={runEvaluation} className="bg-purple-600 hover:bg-purple-700 text-white">
                <Play className="w-4 h-4 mr-2" />
                {isHistoricalMode ? 'Run Historical Analysis' : `Analyze ${selectedDate}`}
              </Button>
              {!isHistoricalMode && (
                <button
                  onClick={() => setIsHistoricalMode(true)}
                  className={`text-sm ${darkMode ? 'text-purple-400 hover:text-purple-300' : 'text-purple-600 hover:text-purple-700'}`}
                >
                  Or run historical analysis for all past data
                </button>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="space-y-6">
            {/* Loading header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-8 w-8 border-3 border-purple-500 border-t-transparent"></div>
                <div>
                  <h2 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {aiAnalysisLoading ? 'Running AI Analysis...' : 'Analyzing Conversations...'}
                  </h2>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {isHistoricalMode
                      ? 'Fetching all historical conversations from Firebase'
                      : `Analyzing conversations from ${selectedDate}`}
                  </p>
                </div>
              </div>
            </div>
            {/* Skeleton content */}
            {aiAnalysisLoading ? <AIAnalysisSkeleton /> : <DashboardSkeleton />}
          </div>
        )}

        {data && !loading && (
          <AnimatePresence mode="wait">
            {/* OVERVIEW SECTION */}
            {activeSection === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Analysis Info Banner */}
                <div className={`p-4 rounded-xl flex items-center justify-between ${darkMode ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-50 border-purple-200'} border`}>
                  <div className="flex items-center gap-4">
                    <Calendar className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                    <div>
                      <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        Analysis Date: {data.analysisDate || 'All Time'}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {data.conversationsAnalyzed} conversations analyzed • {data.sampleSize} users scanned
                      </p>
                    </div>
                  </div>
                  {data.cached && (
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                      Cached
                    </span>
                  )}
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Conversations', value: data.aiMetrics.totalConversations, icon: MessageSquare, color: 'purple' },
                    { label: 'Total Messages', value: data.aiMetrics.totalMessages, icon: MessageCircle, color: 'blue' },
                    { label: 'Active Users (24h)', value: data.userMetrics.activeUsers24h, icon: Users, color: 'green' },
                    { label: 'Avg Conv. Length', value: data.aiMetrics.avgConversationLength.toFixed(1), icon: Activity, color: 'orange' },
                  ].map((metric) => (
                    <div key={metric.label} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <div className={`w-10 h-10 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/30 flex items-center justify-center mb-3`}>
                        <metric.icon className={`w-5 h-5 text-${metric.color}-600`} />
                      </div>
                      <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {typeof metric.value === 'number' ? metric.value.toLocaleString() : metric.value}
                      </p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{metric.label}</p>
                    </div>
                  ))}
                </div>

                {/* Insights Summary */}
                {data.insights.length > 0 && (
                  <div className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="p-4 border-b flex items-center justify-between flex-wrap gap-3" style={{ borderColor: darkMode ? '#374151' : '#e5e7eb' }}>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Zap className="w-5 h-5 text-yellow-500" />
                        Key Insights
                        <span className={`text-sm font-normal px-2 py-0.5 rounded-full ${
                          darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
                        }`}>
                          {data.insights.filter(i => i.type === 'negative').length} issues
                        </span>
                      </h3>
                      <div className={`flex rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        {[
                          { id: 'cards', label: 'Cards', icon: '📋' },
                          { id: 'drilldown', label: 'Drill-down', icon: '🔍' },
                        ].map((view) => (
                          <button
                            key={view.id}
                            onClick={() => setInsightsViewMode(view.id as typeof insightsViewMode)}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1 ${
                              insightsViewMode === view.id
                                ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
                                : (darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800')
                            }`}
                          >
                            <span>{view.icon}</span>
                            {view.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {insightsViewMode === 'cards' ? (
                      <div className="p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          {data.insights.map((insight, i) => (
                            <div
                              key={i}
                              className={`p-4 rounded-lg cursor-pointer transition-all hover:scale-[1.02] ${
                                insight.type === 'positive' ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' :
                                insight.type === 'negative' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                                'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
                              } border`}
                              onClick={() => {
                                if (insight.type === 'negative') {
                                  setInsightsViewMode('drilldown')
                                }
                              }}
                            >
                              <div className="flex items-start gap-3">
                                {insight.type === 'positive' ? <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" /> :
                                 insight.type === 'negative' ? <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" /> :
                                 <Lightbulb className="w-5 h-5 text-blue-500 mt-0.5" />}
                                <div>
                                  <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{insight.finding}</p>
                                  {insight.recommendation && (
                                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      {insight.recommendation}
                                    </p>
                                  )}
                                  {insight.type === 'negative' && (
                                    <p className={`text-xs mt-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                      Click to drill down →
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <IssuesDrilldown
                        issues={data.insights.map((insight, i) => ({
                          ...insight,
                          id: `insight-${i}`,
                        }))}
                        conversations={data.recentConversations.map(c => ({
                          ...c,
                          timestamp: c.timestamp ? new Date(c.timestamp) : null,
                        }))}
                        isDark={darkMode}
                        onConversationSelect={(conv) => {
                          const fullConv = data.fullConversations?.find(fc => fc.id === conv.id)
                          if (fullConv) {
                            setSelectedConversation(fullConv)
                          }
                        }}
                      />
                    )}
                  </div>
                )}

                {/* Charts Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Conversation Depth */}
                  <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className="text-lg font-semibold mb-4">Conversation Depth</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsPieChart>
                          <Pie
                            data={[
                              { name: 'Shallow (1-2)', value: data.aiMetrics.conversationDepth.shallow, fill: COLORS.warning },
                              { name: 'Moderate (3-5)', value: data.aiMetrics.conversationDepth.moderate, fill: COLORS.info },
                              { name: 'Deep (6+)', value: data.aiMetrics.conversationDepth.deep, fill: COLORS.success },
                            ]}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={90}
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                          />
                          <Tooltip />
                        </RechartsPieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Response Quality */}
                  <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className="text-lg font-semibold mb-4">Response Quality</h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: 'Too Short', value: data.aiMetrics.responseQuality.tooShort, fill: COLORS.danger },
                            { name: 'Appropriate', value: data.aiMetrics.responseQuality.appropriate, fill: COLORS.success },
                            { name: 'Long', value: data.aiMetrics.responseQuality.tooLong, fill: COLORS.warning },
                          ]}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                          <XAxis type="number" tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                          <YAxis dataKey="name" type="category" tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }} width={100} />
                          <Tooltip />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                            {[COLORS.danger, COLORS.success, COLORS.warning].map((color, i) => (
                              <Cell key={i} fill={color} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Time of Day Distribution */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className="text-lg font-semibold mb-4">Activity by Hour of Day</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={data.aiMetrics.timeOfDayDistribution}>
                        <defs>
                          <linearGradient id="colorActivity" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.3}/>
                            <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                        <XAxis dataKey="hour" tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }} tickFormatter={(h) => `${h}:00`} />
                        <YAxis tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                        <Tooltip labelFormatter={(h) => `${h}:00 - ${h}:59`} />
                        <Area type="monotone" dataKey="count" stroke={COLORS.primary} fillOpacity={1} fill="url(#colorActivity)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Topics */}
                {data.aiMetrics.topTopics.length > 0 && (
                  <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className="text-lg font-semibold mb-4">Top Conversation Topics</h3>
                    <div className="flex flex-wrap gap-3">
                      {data.aiMetrics.topTopics.map((topic, i) => (
                        <div
                          key={topic.topic}
                          className={`px-4 py-2 rounded-full ${
                            i === 0 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' :
                            i === 1 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' :
                            i === 2 ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                            darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          <span className="font-medium">{topic.topic}</span>
                          <span className="ml-2 opacity-70">({topic.count})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* AI ANALYSIS SECTION - Powered by GPT */}
            {activeSection === 'ai-analysis' && (
              <motion.div
                key="ai-analysis"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Header */}
                <div className={`rounded-xl p-6 ${darkMode ? 'bg-gradient-to-r from-purple-900/50 to-blue-900/50 border border-purple-500/30' : 'bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200'}`}>
                  <div className="flex items-center gap-3 mb-2">
                    <Brain className="w-8 h-8 text-purple-500" />
                    <div>
                      <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        AI-Powered Evaluation
                      </h2>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Deep analysis by GPT-5-mini examining real conversation quality
                      </p>
                    </div>
                  </div>
                  {data?.aiAnalysis && (
                    <div className="mt-4 flex items-start gap-6">
                      <QualityGauge
                        score={data.aiAnalysis.overallQuality}
                        label="Quality Score"
                        size="md"
                      />
                      <div className={`flex-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        <p className="font-medium mb-2">Analysis Summary</p>
                        <p className="text-sm opacity-75 leading-relaxed">{data.aiAnalysis.summary}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Wins Section */}
                {data?.aiAnalysis?.quickWins && data.aiAnalysis.quickWins.length > 0 && (
                  <div className={`rounded-xl p-4 mb-6 ${darkMode ? 'bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-700' : 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200'}`}>
                    <h3 className={`font-semibold mb-3 flex items-center gap-2 ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                      <Zap className="w-5 h-5" />
                      Quick Wins - Implement Today!
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {data.aiAnalysis.quickWins.map((win, i) => (
                        <div key={i} className={`p-3 rounded-lg flex items-start gap-2 ${darkMode ? 'bg-green-900/20' : 'bg-white/80'}`}>
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <p className={`text-sm ${darkMode ? 'text-green-300' : 'text-green-800'}`}>{win}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {!data?.aiAnalysis ? (
                  <div className={`rounded-xl p-12 text-center ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-gray-50 border border-gray-200'}`}>
                    <Brain className={`w-16 h-16 mx-auto mb-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
                    <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      No AI Analysis Available
                    </h3>
                    <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Run an evaluation with AI Analysis enabled to see deep insights from GPT.
                    </p>
                    <div className="flex items-center justify-center gap-3 mb-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={runWithAI}
                          onChange={(e) => setRunWithAI(e.target.checked)}
                          className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Enable AI Analysis</span>
                      </label>
                    </div>
                    <Button
                      onClick={runEvaluation}
                      disabled={loading}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          {aiAnalysisLoading ? 'Running AI Analysis...' : 'Running Evaluation...'}
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Run AI Evaluation
                        </>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Issues Found */}
                    <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Issues Found
                      </h3>
                      <div className="space-y-4">
                        {data.aiAnalysis.issuesFound.length === 0 ? (
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No significant issues detected</p>
                        ) : (
                          data.aiAnalysis.issuesFound.map((issue, i) => (
                            <div key={i} className={`p-4 rounded-lg ${
                              issue.severity === 'critical' ? 'bg-red-500/10 border border-red-500/30' :
                              issue.severity === 'high' ? 'bg-orange-500/10 border border-orange-500/30' :
                              issue.severity === 'medium' ? 'bg-yellow-500/10 border border-yellow-500/30' :
                              'bg-blue-500/10 border border-blue-500/30'
                            }`}>
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  issue.severity === 'critical' ? 'bg-red-500 text-white' :
                                  issue.severity === 'high' ? 'bg-orange-500 text-white' :
                                  issue.severity === 'medium' ? 'bg-yellow-500 text-black' :
                                  'bg-blue-500 text-white'
                                }`}>
                                  {issue.severity.toUpperCase()}
                                </span>
                                {issue.affectedUsers && (
                                  <span className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600'}`}>
                                    Affects: {issue.affectedUsers}
                                  </span>
                                )}
                              </div>
                              <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{issue.issue}</p>
                              {issue.example && (
                                <p className={`text-sm italic mb-2 px-3 py-2 rounded ${darkMode ? 'bg-gray-700/50 text-gray-300 border-l-2 border-gray-500' : 'bg-gray-100 text-gray-600 border-l-2 border-gray-300'}`}>
                                  "{issue.example}"
                                </p>
                              )}
                              <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                <Lightbulb className="w-3 h-3 inline mr-1" />
                                {issue.recommendation}
                              </p>
                              {issue.expectedImpact && (
                                <p className={`text-xs mt-2 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                  Expected Impact: {issue.expectedImpact}
                                </p>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Success Patterns */}
                    <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        Success Patterns
                      </h3>
                      <div className="space-y-4">
                        {data.aiAnalysis.successPatterns.map((pattern, i) => (
                          <div key={i} className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                pattern.frequency === 'common' ? 'bg-green-500 text-white' :
                                pattern.frequency === 'occasional' ? 'bg-blue-500 text-white' :
                                'bg-gray-500 text-white'
                              }`}>
                                {pattern.frequency.toUpperCase()}
                              </span>
                            </div>
                            <p className={`font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{pattern.pattern}</p>
                            {pattern.example && (
                              <p className={`text-sm italic mb-2 px-3 py-2 rounded ${darkMode ? 'bg-green-900/30 text-green-300 border-l-2 border-green-500' : 'bg-green-50 text-green-700 border-l-2 border-green-400'}`}>
                                "{pattern.example}"
                              </p>
                            )}
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{pattern.impact}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prompt Recommendations */}
                    <div className={`rounded-xl p-6 lg:col-span-2 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <Settings className="w-5 h-5 text-purple-500" />
                        System Prompt Recommendations
                      </h3>
                      <div className="space-y-4">
                        {data.aiAnalysis.promptRecommendations.map((rec, i) => (
                          <div key={i} className={`p-4 rounded-lg ${
                            rec.priority === 'high' ? 'bg-purple-500/10 border border-purple-500/30' :
                            rec.priority === 'medium' ? 'bg-blue-500/10 border border-blue-500/30' :
                            'bg-gray-500/10 border border-gray-500/30'
                          }`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                rec.priority === 'high' ? 'bg-purple-500 text-white' :
                                rec.priority === 'medium' ? 'bg-blue-500 text-white' :
                                'bg-gray-500 text-white'
                              }`}>
                                {rec.priority.toUpperCase()} PRIORITY
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                              <div>
                                <p className={`text-xs uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Current Behavior</p>
                                <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{rec.currentBehavior}</p>
                              </div>
                              <div>
                                <p className={`text-xs uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Suggested Change</p>
                                <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rec.suggestedChange}</p>
                              </div>
                              <div>
                                <p className={`text-xs uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Expected Impact</p>
                                <p className={`text-sm ${darkMode ? 'text-green-400' : 'text-green-600'}`}>{rec.expectedImpact}</p>
                              </div>
                              {rec.risk && (
                                <div>
                                  <p className={`text-xs uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Risk</p>
                                  <p className={`text-sm ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>{rec.risk}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Conversation Breakdown by Category */}
                    <div className={`rounded-xl p-6 lg:col-span-2 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                      <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <PieChart className="w-5 h-5 text-blue-500" />
                        Quality by Conversation Category
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {data.aiAnalysis.conversationBreakdown.map((cat, i) => (
                          <div key={i} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <p className={`text-sm font-medium mb-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{cat.category}</p>
                            <div className="flex items-center gap-2">
                              <span className={`text-2xl font-bold ${
                                cat.avgQuality >= 80 ? 'text-green-500' :
                                cat.avgQuality >= 60 ? 'text-yellow-500' :
                                cat.avgQuality >= 40 ? 'text-orange-500' : 'text-red-500'
                              }`}>
                                {cat.avgQuality}
                              </span>
                              <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                ({cat.count} convos)
                              </span>
                            </div>
                            <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{cat.notes}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* User Journey Insights */}
                    {data.aiAnalysis.userJourneyInsights && (() => {
                      const journey = data.aiAnalysis!.userJourneyInsights!
                      return (
                        <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                          <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            <Users className="w-5 h-5 text-cyan-500" />
                            User Journey Analysis
                          </h3>
                          <div className="space-y-4">
                            <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                              <p className={`text-xs uppercase tracking-wide mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Return User Experience</p>
                              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{journey.returnUserQuality}</p>
                            </div>

                            {journey.firstImpressionIssues && journey.firstImpressionIssues.length > 0 && (
                              <div>
                                <p className={`text-xs uppercase tracking-wide mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>First Impression Issues</p>
                                <ul className="space-y-1">
                                  {journey.firstImpressionIssues.map((issue, i) => (
                                    <li key={i} className={`text-sm flex items-start gap-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                                      <XCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                      {issue}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {journey.loyalUserPatterns && journey.loyalUserPatterns.length > 0 && (
                              <div>
                                <p className={`text-xs uppercase tracking-wide mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>What Keeps Users Coming Back</p>
                                <ul className="space-y-1">
                                  {journey.loyalUserPatterns.map((pattern, i) => (
                                    <li key={i} className={`text-sm flex items-start gap-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                      <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                      {pattern}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}

                            {journey.churnRisks && journey.churnRisks.length > 0 && (
                              <div>
                                <p className={`text-xs uppercase tracking-wide mb-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Churn Risks</p>
                                <ul className="space-y-1">
                                  {journey.churnRisks.map((risk, i) => (
                                    <li key={i} className={`text-sm flex items-start gap-2 ${darkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                                      <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                      {risk}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })()}

                    {/* Segment Insights (Device/Locale specific) */}
                    {data.aiAnalysis.segmentInsights && data.aiAnalysis.segmentInsights.length > 0 && (
                      <div className={`rounded-xl p-6 ${darkMode ? 'bg-gray-800/50 border border-gray-700' : 'bg-white border border-gray-200'}`}>
                        <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                          <Globe className="w-5 h-5 text-indigo-500" />
                          Segment-Specific Insights
                        </h3>
                        <div className="space-y-4">
                          {data.aiAnalysis.segmentInsights.map((segment, i) => (
                            <div key={i} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{segment.segment}</span>
                                <span className={`text-lg font-bold ${
                                  segment.quality >= 80 ? 'text-green-500' :
                                  segment.quality >= 60 ? 'text-yellow-500' :
                                  segment.quality >= 40 ? 'text-orange-500' : 'text-red-500'
                                }`}>
                                  {segment.quality}/100
                                </span>
                              </div>
                              {segment.specificIssues?.length > 0 && (
                                <ul className="space-y-1">
                                  {segment.specificIssues.map((issue, j) => (
                                    <li key={j} className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                      • {issue}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* SUCCESS ANALYSIS SECTION */}
            {activeSection === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Success Metrics Overview */}
                {data.successMetrics && (
                  <>
                    <div className="grid md:grid-cols-5 gap-4">
                      {[
                        { label: 'Successful', value: data.successMetrics.successful, color: 'green', icon: CheckCircle },
                        { label: 'Partial', value: data.successMetrics.partial, color: 'yellow', icon: Activity },
                        { label: 'Failed', value: data.successMetrics.failed, color: 'red', icon: XCircle },
                        { label: 'Abandoned', value: data.successMetrics.abandoned, color: 'gray', icon: Clock },
                        { label: 'Avg Score', value: data.successMetrics.avgSuccessScore, color: 'purple', icon: Target, suffix: '/100' },
                      ].map((metric) => (
                        <div key={metric.label} className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                          <metric.icon className={`w-6 h-6 mb-2 text-${metric.color}-500`} />
                          <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {metric.value}{metric.suffix || ''}
                          </p>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{metric.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Success Distribution Chart */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className="text-lg font-semibold mb-4">Conversation Outcomes</h3>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <RechartsPieChart>
                              <Pie
                                data={[
                                  { name: 'Successful', value: data.successMetrics.successful, fill: COLORS.success },
                                  { name: 'Partial', value: data.successMetrics.partial, fill: COLORS.warning },
                                  { name: 'Failed', value: data.successMetrics.failed, fill: COLORS.danger },
                                  { name: 'Abandoned', value: data.successMetrics.abandoned, fill: COLORS.neutral },
                                ]}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={90}
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                              />
                              <Tooltip />
                            </RechartsPieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      {/* Success Indicators */}
                      <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <h3 className="text-lg font-semibold mb-4">Success Indicators</h3>
                        <div className="space-y-4">
                          <div>
                            <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                              <ThumbsUp className="w-4 h-4 inline mr-2" />
                              Top Success Indicators
                            </h4>
                            <div className="space-y-1">
                              {data.successMetrics.topSuccessIndicators.map((indicator, i) => (
                                <p key={i} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  • {indicator}
                                </p>
                              ))}
                              {data.successMetrics.topSuccessIndicators.length === 0 && (
                                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No data yet</p>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className={`text-sm font-medium mb-2 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>
                              <ThumbsDown className="w-4 h-4 inline mr-2" />
                              Top Failure Reasons
                            </h4>
                            <div className="space-y-1">
                              {data.successMetrics.topFailureReasons.map((reason, i) => (
                                <p key={i} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  • {reason}
                                </p>
                              ))}
                              {data.successMetrics.topFailureReasons.length === 0 && (
                                <p className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>No failures detected</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* CONVERSATIONS EXPLORER SECTION */}
            {activeSection === 'conversations' && (
              <motion.div
                key="conversations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Filters */}
                <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Filter:</span>
                    </div>
                    <select
                      value={conversationFilter}
                      onChange={(e) => setConversationFilter(e.target.value as any)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border`}
                    >
                      <option value="all">All Outcomes</option>
                      <option value="successful">Successful</option>
                      <option value="partial">Partial Success</option>
                      <option value="failed">Failed</option>
                      <option value="abandoned">Abandoned</option>
                    </select>
                    <select
                      value={topicFilter}
                      onChange={(e) => setTopicFilter(e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'} border`}
                    >
                      <option value="all">All Topics</option>
                      {data.topicBreakdown?.map(t => (
                        <option key={t.topic} value={t.topic}>{t.topic} ({t.count})</option>
                      ))}
                    </select>
                    <span className={`text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                      Showing {filteredConversations.length} conversations
                    </span>
                  </div>
                </div>

                {/* Conversation Detail Modal */}
                {selectedConversation && (
                  <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedConversation(null)}>
                    <div
                      className={`max-w-3xl w-full max-h-[80vh] overflow-y-auto rounded-2xl ${darkMode ? 'bg-gray-900' : 'bg-white'} p-6`}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSuccessColor(selectedConversation.success.classification)}`}>
                              {selectedConversation.success.classification.toUpperCase()}
                            </span>
                            <span className="text-2xl">{getLanguageFlag(selectedConversation.language)}</span>
                            {getSentimentIcon(selectedConversation.sentiment)}
                          </div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {selectedConversation.messageCount} messages • Score: {selectedConversation.success.score}/100 • Engagement: {selectedConversation.userEngagementScore}/100
                          </p>
                        </div>
                        <button
                          onClick={() => setSelectedConversation(null)}
                          className={`p-2 rounded-lg ${darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                        >
                          <XCircle className="w-6 h-6" />
                        </button>
                      </div>

                      {/* Topics */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedConversation.topics.map((topic: string) => (
                          <span key={topic} className={`px-2 py-1 rounded text-xs ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                            {topic}
                          </span>
                        ))}
                      </div>

                      {/* Success Reasons */}
                      {selectedConversation.success.reasons.length > 0 && (
                        <div className={`p-3 rounded-lg mb-4 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                          <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Classification Reasons:</p>
                          {selectedConversation.success.reasons.map((reason: string, i: number) => (
                            <span key={i} className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                              {i > 0 ? ' • ' : ''}{reason}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Messages */}
                      <div className="space-y-4">
                        <h4 className="font-semibold">Full Conversation</h4>
                        {selectedConversation.messages.map((msg: Message, i: number) => (
                          <div
                            key={i}
                            className={`p-4 rounded-lg ${
                              msg.role === 'user'
                                ? darkMode ? 'bg-blue-900/30 border-blue-800' : 'bg-blue-50 border-blue-200'
                                : msg.role === 'assistant'
                                ? darkMode ? 'bg-purple-900/30 border-purple-800' : 'bg-purple-50 border-purple-200'
                                : darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
                            } border`}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-medium ${
                                msg.role === 'user' ? 'text-blue-600 dark:text-blue-400' :
                                msg.role === 'assistant' ? 'text-purple-600 dark:text-purple-400' :
                                'text-gray-500'
                              }`}>
                                {msg.role === 'user' ? '👤 User' : msg.role === 'assistant' ? '🤖 AI' : '⚙️ System'}
                              </span>
                            </div>
                            <p className={`whitespace-pre-wrap ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                              {msg.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Conversations List */}
                <div className="grid gap-4">
                  {filteredConversations.length === 0 && (
                    <div className="text-center py-12">
                      <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-medium mb-2">No Conversations Found</h3>
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        Try adjusting your filters or run a new evaluation
                      </p>
                    </div>
                  )}
                  {filteredConversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedConversation(conv)}
                      className={`p-5 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer transition-all`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSuccessColor(conv.success.classification)}`}>
                              {conv.success.classification}
                            </span>
                            <span className="text-lg">{getLanguageFlag(conv.language)}</span>
                            {getSentimentIcon(conv.sentiment)}
                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                              Score: {conv.success.score}/100
                            </span>
                          </div>
                          <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'} line-clamp-2`}>
                            "{conv.messages.find(m => m.role === 'user')?.content || 'No preview'}"
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-sm">
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                              <MessageSquare className="w-4 h-4 inline mr-1" />
                              {conv.messageCount} messages
                            </span>
                            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                              <Clock className="w-4 h-4 inline mr-1" />
                              {conv.createdAt ? new Date(conv.createdAt).toLocaleDateString() : 'Unknown'}
                            </span>
                            <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                              <Zap className="w-4 h-4 inline mr-1" />
                              Engagement: {conv.userEngagementScore}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {conv.topics.slice(0, 4).map(topic => (
                              <span key={topic} className={`px-2 py-0.5 rounded text-xs ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                {topic}
                              </span>
                            ))}
                          </div>
                        </div>
                        <Eye className={`w-5 h-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* TOPICS BREAKDOWN SECTION */}
            {activeSection === 'topics' && (
              <motion.div
                key="topics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {data.topicBreakdown && data.topicBreakdown.length > 0 ? (
                  <>
                    {/* Topic Distribution Chart */}
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h3 className="text-lg font-semibold mb-4">Topic Distribution</h3>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={data.topicBreakdown.slice(0, 10)} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#e5e7eb'} />
                            <XAxis type="number" tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                            <YAxis dataKey="topic" type="category" tick={{ fill: darkMode ? '#9ca3af' : '#6b7280' }} width={120} />
                            <Tooltip />
                            <Bar dataKey="count" fill={COLORS.primary} radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Topic Cards - Expandable */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {data.topicBreakdown.map((topic, i) => {
                        const isExpanded = expandedTopics.has(topic.topic)
                        const relatedConversations = data.fullConversations?.filter(c =>
                          c.topics.includes(topic.topic) ||
                          c.topicDetails?.some(td => td.topic === topic.topic)
                        ) || []

                        return (
                          <div
                            key={topic.topic}
                            className={`rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${isExpanded ? 'md:col-span-2 lg:col-span-3' : ''} transition-all duration-300`}
                          >
                            {/* Header - Always visible */}
                            <div
                              className="p-5 cursor-pointer hover:bg-gray-700/20 rounded-t-xl transition-colors"
                              onClick={() => {
                                const newExpanded = new Set(expandedTopics)
                                if (isExpanded) {
                                  newExpanded.delete(topic.topic)
                                } else {
                                  newExpanded.add(topic.topic)
                                }
                                setExpandedTopics(newExpanded)
                              }}
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <h4 className={`font-semibold capitalize ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {topic.topic.replace('_', ' ')}
                                  </h4>
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-gray-400" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-gray-400" />
                                  )}
                                </div>
                                <span className={`text-2xl font-bold`} style={{ color: CHART_COLORS[i % CHART_COLORS.length] }}>
                                  {topic.count}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div className={`p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Avg Success</p>
                                  <p className={`font-semibold ${topic.avgSuccessScore >= 60 ? 'text-green-500' : topic.avgSuccessScore >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {topic.avgSuccessScore}/100
                                  </p>
                                </div>
                                <div className={`p-2 rounded ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Avg Engagement</p>
                                  <p className={`font-semibold ${topic.avgEngagement >= 60 ? 'text-green-500' : topic.avgEngagement >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {topic.avgEngagement}/100
                                  </p>
                                </div>
                              </div>

                              {/* Preview examples when collapsed */}
                              {!isExpanded && topic.examples.length > 0 && (
                                <div className="mt-3">
                                  <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'} mb-1`}>
                                    Examples ({topic.examples.length} total) - click to expand:
                                  </p>
                                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} truncate`}>
                                    "{topic.examples[0]}..."
                                  </p>
                                </div>
                              )}
                            </div>

                            {/* Expanded Content */}
                            {isExpanded && (
                              <div className={`p-5 pt-0 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                {/* All Examples */}
                                <div className="mb-6">
                                  <h5 className={`font-medium mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    <MessageSquare className="w-4 h-4" />
                                    All Examples ({topic.examples.length})
                                  </h5>
                                  <div className="space-y-2 max-h-60 overflow-y-auto">
                                    {topic.examples.map((ex, j) => (
                                      <div
                                        key={j}
                                        className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}
                                      >
                                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                          "{ex}"
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Related Conversations */}
                                {relatedConversations.length > 0 && (
                                  <div>
                                    <h5 className={`font-medium mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                      <Eye className="w-4 h-4" />
                                      Related Conversations ({relatedConversations.length})
                                    </h5>
                                    <div className="space-y-3 max-h-80 overflow-y-auto">
                                      {relatedConversations.slice(0, 10).map((conv, j) => (
                                        <div
                                          key={j}
                                          className={`p-4 rounded-lg cursor-pointer transition-colors ${darkMode ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'}`}
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            setSelectedConversation(conv)
                                          }}
                                        >
                                          <div className="flex items-center justify-between mb-2">
                                            <span className={`text-xs px-2 py-1 rounded ${
                                              conv.success.classification === 'successful' ? 'bg-green-500/20 text-green-400' :
                                              conv.success.classification === 'partial' ? 'bg-yellow-500/20 text-yellow-400' :
                                              conv.success.classification === 'failed' ? 'bg-red-500/20 text-red-400' :
                                              'bg-gray-500/20 text-gray-400'
                                            }`}>
                                              {conv.success.classification} ({conv.success.score}/100)
                                            </span>
                                            <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                              {conv.messageCount} messages • {conv.language.toUpperCase()}
                                            </span>
                                          </div>
                                          <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                            {conv.messages.find(m => m.role === 'user')?.content.substring(0, 100)}...
                                          </p>
                                        </div>
                                      ))}
                                      {relatedConversations.length > 10 && (
                                        <p className={`text-center text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                          + {relatedConversations.length - 10} more conversations
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <PieChart className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No Topic Data</h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Run an evaluation to see topic breakdown
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {/* QUALITY SECTION */}
            {activeSection === 'quality' && (
              <motion.div
                key="quality"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Quality Score Card */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className="text-lg font-semibold mb-4">Response Quality Breakdown</h3>

                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      {
                        label: 'Too Short (<50 chars)',
                        value: data.aiMetrics.responseQuality.tooShort,
                        color: 'red',
                        description: 'Responses that may be incomplete or unhelpful'
                      },
                      {
                        label: 'Appropriate (50-500 chars)',
                        value: data.aiMetrics.responseQuality.appropriate,
                        color: 'green',
                        description: 'Well-balanced responses'
                      },
                      {
                        label: 'Long (>500 chars)',
                        value: data.aiMetrics.responseQuality.tooLong,
                        color: 'yellow',
                        description: 'Detailed but may be overwhelming'
                      },
                    ].map((item) => {
                      const total = data.aiMetrics.responseQuality.tooShort + data.aiMetrics.responseQuality.appropriate + data.aiMetrics.responseQuality.tooLong
                      const pct = total > 0 ? (item.value / total) * 100 : 0
                      return (
                        <div key={item.label} className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.label}</span>
                            <span className={`text-2xl font-bold text-${item.color}-500`}>{pct.toFixed(0)}%</span>
                          </div>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.description}</p>
                          <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>{item.value} responses</p>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Recommendations */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className="text-lg font-semibold mb-4">Quality Improvement Recommendations</h3>
                  <div className="space-y-4">
                    {(() => {
                      const total = data.aiMetrics.responseQuality.tooShort + data.aiMetrics.responseQuality.appropriate + data.aiMetrics.responseQuality.tooLong
                      const tooShortPct = total > 0 ? (data.aiMetrics.responseQuality.tooShort / total) * 100 : 0
                      const tooLongPct = total > 0 ? (data.aiMetrics.responseQuality.tooLong / total) * 100 : 0

                      const recommendations = []

                      if (tooShortPct > 20) {
                        recommendations.push({
                          priority: 'high',
                          title: 'Improve Response Completeness',
                          description: `${tooShortPct.toFixed(0)}% of responses are too short. Consider updating your system prompt to encourage more detailed, helpful responses.`,
                        })
                      }

                      if (tooLongPct > 50) {
                        recommendations.push({
                          priority: 'medium',
                          title: 'Optimize Response Length for Mobile',
                          description: `${tooLongPct.toFixed(0)}% of responses are very long. Consider adding conciseness instructions to your system prompt, especially for mobile users.`,
                        })
                      }

                      if (recommendations.length === 0) {
                        recommendations.push({
                          priority: 'low',
                          title: 'Response Quality is Good',
                          description: 'Your AI responses are well-balanced. Continue monitoring for changes.',
                        })
                      }

                      return recommendations.map((rec, i) => (
                        <div key={i} className={`p-4 rounded-lg border ${
                          rec.priority === 'high' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' :
                          rec.priority === 'medium' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' :
                          'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        }`}>
                          <div className="flex items-start gap-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                              rec.priority === 'high' ? 'bg-red-500 text-white' :
                              rec.priority === 'medium' ? 'bg-yellow-500 text-white' :
                              'bg-green-500 text-white'
                            }`}>
                              {rec.priority.toUpperCase()}
                            </span>
                            <div>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{rec.title}</p>
                              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{rec.description}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    })()}
                  </div>
                </div>
              </motion.div>
            )}

            {/* USERS SECTION */}
            {activeSection === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* User Stats */}
                <div className="grid md:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Users', value: data.userMetrics.totalUsers, icon: Users },
                    { label: 'Active 24h', value: data.userMetrics.activeUsers24h, icon: Zap },
                    { label: 'Active 7d', value: data.userMetrics.activeUsers7d, icon: Activity },
                    { label: 'Avg Conv/User', value: data.userMetrics.avgConversationsPerUser.toFixed(1), icon: MessageSquare },
                  ].map((stat) => (
                    <div key={stat.label} className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <stat.icon className={`w-6 h-6 mb-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* User Details Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Locales */}
                  {data.userMetrics.topLocales.length > 0 && (
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Top Locales
                      </h4>
                      <div className="space-y-3">
                        {data.userMetrics.topLocales.map((locale, i) => (
                          <div key={locale.locale} className="flex items-center justify-between">
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{locale.locale}</span>
                            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{locale.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Devices */}
                  {data.userMetrics.topDevices.length > 0 && (
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Smartphone className="w-5 h-5" />
                        Top Devices
                      </h4>
                      <div className="space-y-3">
                        {data.userMetrics.topDevices.map((device) => (
                          <div key={device.device} className="flex items-center justify-between">
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>{device.device}</span>
                            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{device.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* App Versions */}
                  {data.userMetrics.appVersions.length > 0 && (
                    <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Settings className="w-5 h-5" />
                        App Versions
                      </h4>
                      <div className="space-y-3">
                        {data.userMetrics.appVersions.map((version) => (
                          <div key={version.version} className="flex items-center justify-between">
                            <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>v{version.version}</span>
                            <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{version.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SYSTEM PROMPT SECTION */}
            {activeSection === 'prompt' && (
              <motion.div
                key="prompt"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                {/* Loading State */}
                {loadingPrompt && (
                  <div className="text-center py-12">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-purple-500 border-t-transparent mb-4"></div>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>Loading system prompt...</p>
                  </div>
                )}

                {/* Current System Prompt */}
                {!loadingPrompt && (
                  <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Settings className="w-5 h-5 text-purple-500" />
                        System Prompt {currentPrompt ? `v${currentPrompt.version}` : ''}
                      </h3>
                      <div className="flex items-center gap-2">
                        {currentPrompt && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${darkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-700'}`}>
                            Active
                          </span>
                        )}
                        {!isEditingPrompt ? (
                          <Button
                            onClick={() => setIsEditingPrompt(true)}
                            variant="outline"
                            size="sm"
                            className={darkMode ? 'border-gray-700' : ''}
                          >
                            Edit Prompt
                          </Button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => {
                                setIsEditingPrompt(false)
                                setEditedPrompt(currentPrompt?.prompt || '')
                                setPromptNotes('')
                              }}
                              variant="outline"
                              size="sm"
                              className={darkMode ? 'border-gray-700' : ''}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={savePrompt}
                              disabled={savingPrompt || editedPrompt === currentPrompt?.prompt}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              {savingPrompt ? (
                                <>
                                  <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                'Save New Version'
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>

                    {isEditingPrompt ? (
                      <div className="space-y-4">
                        <textarea
                          value={editedPrompt}
                          onChange={(e) => setEditedPrompt(e.target.value)}
                          className={`w-full h-96 p-4 rounded-lg font-mono text-sm ${darkMode ? 'bg-gray-900 text-gray-300 border-gray-700' : 'bg-gray-50 text-gray-700 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          placeholder="Enter your system prompt..."
                        />
                        <div>
                          <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Version Notes (optional)
                          </label>
                          <input
                            type="text"
                            value={promptNotes}
                            onChange={(e) => setPromptNotes(e.target.value)}
                            placeholder="e.g., Added better greeting, Fixed response length..."
                            className={`w-full px-4 py-2 rounded-lg ${darkMode ? 'bg-gray-900 text-gray-300 border-gray-700' : 'bg-gray-50 text-gray-700 border-gray-200'} border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                          />
                        </div>
                        {editedPrompt !== currentPrompt?.prompt && (
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'} border`}>
                            <p className={`text-sm ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                              <AlertTriangle className="w-4 h-4 inline mr-1" />
                              You have unsaved changes. Click "Save New Version" to save.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className={`p-4 rounded-lg font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto ${darkMode ? 'bg-gray-900 text-gray-300' : 'bg-gray-50 text-gray-700'}`}>
                        {currentPrompt?.prompt || 'No prompt configured yet. Click "Edit Prompt" to add one.'}
                      </div>
                    )}

                    {currentPrompt && !isEditingPrompt && (
                      <p className={`mt-3 text-sm ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Last updated: {new Date(currentPrompt.updatedAt).toLocaleString()}
                        {currentPrompt.notes && ` • ${currentPrompt.notes}`}
                      </p>
                    )}
                  </div>
                )}

                {/* Version History */}
                {!loadingPrompt && promptHistory.length > 0 && (
                  <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
                      <History className="w-5 h-5 text-blue-500" />
                      Version History
                    </h3>
                    <div className="space-y-3">
                      {promptHistory.map((version, i) => (
                        <div
                          key={version.id}
                          className={`p-4 rounded-lg flex items-center justify-between ${
                            i === 0
                              ? darkMode ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'
                              : darkMode ? 'bg-gray-700/50' : 'bg-gray-50'
                          } border`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                Version {version.version}
                              </span>
                              {i === 0 && (
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${darkMode ? 'bg-purple-600 text-white' : 'bg-purple-600 text-white'}`}>
                                  CURRENT
                                </span>
                              )}
                            </div>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {new Date(version.createdAt).toLocaleString()}
                              {version.notes && ` • ${version.notes}`}
                            </p>
                          </div>
                          {i > 0 && (
                            <Button
                              onClick={() => revertToVersion(version.id)}
                              variant="outline"
                              size="sm"
                              className={darkMode ? 'border-gray-600' : ''}
                            >
                              Revert
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI-Generated Improvement Suggestions */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Improvement Suggestions Based on Evaluation
                    </h3>
                  </div>

                  {!data ? (
                    <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      <Brain className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Run an evaluation first to get AI-powered suggestions for prompt improvements</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Auto-generated suggestions based on insights */}
                      {data.insights.filter(i => i.type === 'negative').length === 0 ? (
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'} border`}>
                          <div className="flex items-start gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                            <div>
                              <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Prompt is performing well!</p>
                              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                No critical issues detected in the evaluation. Continue monitoring daily.
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Response Quality Issues */}
                          {(() => {
                            const total = data.aiMetrics.responseQuality.tooShort + data.aiMetrics.responseQuality.appropriate + data.aiMetrics.responseQuality.tooLong
                            const tooShortPct = total > 0 ? (data.aiMetrics.responseQuality.tooShort / total) * 100 : 0
                            const tooLongPct = total > 0 ? (data.aiMetrics.responseQuality.tooLong / total) * 100 : 0

                            const suggestions = []

                            if (tooShortPct > 20) {
                              suggestions.push({
                                priority: 'high',
                                title: 'Responses are too short',
                                problem: `${tooShortPct.toFixed(0)}% of responses are under 50 characters`,
                                suggestion: 'Add to system prompt: "Provide detailed, helpful responses. Avoid one-word or very short answers unless the question only requires a simple yes/no."',
                              })
                            }

                            if (tooLongPct > 50) {
                              suggestions.push({
                                priority: 'medium',
                                title: 'Responses may be too long for mobile',
                                problem: `${tooLongPct.toFixed(0)}% of responses exceed 500 characters`,
                                suggestion: 'Add to system prompt: "Keep responses concise for mobile readability. Use bullet points for complex information. Aim for 2-3 paragraphs maximum unless detailed explanation is needed."',
                              })
                            }

                            // Abandonment rate
                            if (data.successMetrics?.abandoned && data.successMetrics.abandoned > 0) {
                              const totalConvs = data.successMetrics.successful + data.successMetrics.partial + data.successMetrics.failed + data.successMetrics.abandoned
                              const abandonRate = (data.successMetrics.abandoned / totalConvs) * 100
                              if (abandonRate > 25) {
                                suggestions.push({
                                  priority: 'high',
                                  title: 'High conversation abandonment rate',
                                  problem: `${abandonRate.toFixed(0)}% of conversations are abandoned after 1-2 messages`,
                                  suggestion: 'Add to system prompt: "For first messages, be extra engaging. Ask a follow-up question to encourage continued conversation. Show enthusiasm for helping."',
                                })
                              }
                            }

                            // Failure rate
                            if (data.successMetrics?.failed && data.successMetrics.failed > 0) {
                              const totalConvs = data.successMetrics.successful + data.successMetrics.partial + data.successMetrics.failed + data.successMetrics.abandoned
                              const failRate = (data.successMetrics.failed / totalConvs) * 100
                              if (failRate > 15) {
                                suggestions.push({
                                  priority: 'high',
                                  title: 'Users not getting their questions answered',
                                  problem: `${failRate.toFixed(0)}% of conversations classified as failed`,
                                  suggestion: 'Add to system prompt: "If you cannot fully answer a question, acknowledge this clearly and offer alternative help. Never leave users without actionable next steps."',
                                })
                              }
                            }

                            // Low engagement
                            const shallowPct = data.aiMetrics.conversationDepth.shallow /
                              (data.aiMetrics.conversationDepth.shallow + data.aiMetrics.conversationDepth.moderate + data.aiMetrics.conversationDepth.deep) * 100
                            if (shallowPct > 60) {
                              suggestions.push({
                                priority: 'medium',
                                title: 'Low conversation engagement',
                                problem: `${shallowPct.toFixed(0)}% of conversations have only 1-2 exchanges`,
                                suggestion: 'Add to system prompt: "After answering, suggest related topics or ask if they would like more detail. Proactively offer to help with related questions."',
                              })
                            }

                            if (suggestions.length === 0) {
                              return (
                                <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/20 border-blue-800' : 'bg-blue-50 border-blue-200'} border`}>
                                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    Some issues detected but no specific prompt changes recommended at this time. Continue monitoring.
                                  </p>
                                </div>
                              )
                            }

                            return suggestions.map((sug, i) => (
                              <div
                                key={i}
                                className={`p-4 rounded-lg border ${
                                  sug.priority === 'high'
                                    ? darkMode ? 'bg-red-900/20 border-red-800' : 'bg-red-50 border-red-200'
                                    : darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                    sug.priority === 'high' ? 'bg-red-500 text-white' : 'bg-yellow-500 text-white'
                                  }`}>
                                    {sug.priority.toUpperCase()}
                                  </span>
                                  <div className="flex-1">
                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{sug.title}</p>
                                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{sug.problem}</p>
                                    <div className={`mt-3 p-3 rounded ${darkMode ? 'bg-gray-900' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                      <p className={`text-xs font-medium mb-1 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Suggested Addition:</p>
                                      <p className={`text-sm font-mono ${darkMode ? 'text-green-400' : 'text-green-700'}`}>{sug.suggestion}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))
                          })()}
                        </>
                      )}

                      {/* Topic-specific insights */}
                      {data.topicBreakdown && data.topicBreakdown.length > 0 && (
                        <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                          <h4 className={`font-medium mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Topic-Specific Insights</h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            {data.topicBreakdown.slice(0, 4).map((topic) => (
                              <div key={topic.topic} className={`p-3 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className={`font-medium capitalize ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                    {topic.topic.replace('_', ' ')}
                                  </span>
                                  <span className={`text-sm ${topic.avgSuccessScore >= 60 ? 'text-green-500' : topic.avgSuccessScore >= 40 ? 'text-yellow-500' : 'text-red-500'}`}>
                                    {topic.avgSuccessScore}/100
                                  </span>
                                </div>
                                <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {topic.count} conversations • {topic.avgEngagement} avg engagement
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <a
                      href="vscode://file/Users/edison/Desktop/Inteligencia%20Artificial%20Gratis/Inteligencia%20Artificial%20Gratis/OpenAIService.swift:315"
                      className={`p-4 rounded-lg border flex items-center gap-3 transition-all ${
                        darkMode
                          ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                        <Settings className={`w-5 h-5 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      </div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Open in VS Code</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Edit system prompt directly</p>
                      </div>
                    </a>
                    <button
                      onClick={() => navigator.clipboard.writeText(data?.insights.map(i => `- ${i.finding}${i.recommendation ? `\n  Recommendation: ${i.recommendation}` : ''}`).join('\n') || '')}
                      className={`p-4 rounded-lg border flex items-center gap-3 transition-all text-left ${
                        darkMode
                          ? 'bg-gray-700/50 border-gray-600 hover:bg-gray-700'
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                        <Download className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                      </div>
                      <div>
                        <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Copy Insights</p>
                        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Copy all findings to clipboard</p>
                      </div>
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ACTION ITEMS SECTION */}
            {activeSection === 'actions' && (
              <motion.div
                key="actions"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Action Items</h2>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-red-500"></span>
                      Critical ({actionItems.filter(i => i.priority === 'critical').length})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-orange-500"></span>
                      High ({actionItems.filter(i => i.priority === 'high').length})
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
                      Medium ({actionItems.filter(i => i.priority === 'medium').length})
                    </span>
                  </div>
                </div>

                {actionItems.length === 0 && (
                  <div className="text-center py-12">
                    <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                    <h3 className="text-lg font-medium mb-2">No Action Items</h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Your AI is performing well! Run an evaluation to check for issues.
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {actionItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'} ${
                        item.status === 'completed' ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                          {getStatusIcon(item.status)}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-medium text-white ${getPriorityColor(item.priority)}`}>
                                {item.priority.toUpperCase()}
                              </span>
                              <span className={`px-2 py-0.5 rounded text-xs font-medium ${darkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
                                {item.category}
                              </span>
                            </div>
                            <h4 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{item.title}</h4>
                            <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                            <div className="flex items-center gap-6 mt-3 text-sm">
                              <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                                <Target className="w-4 h-4 inline mr-1" />
                                Impact: {item.impact}
                              </span>
                              <span className={darkMode ? 'text-gray-500' : 'text-gray-400'}>
                                <Zap className="w-4 h-4 inline mr-1" />
                                Effort: {item.effort}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Actions */}
                        <div className="flex items-center gap-2">
                          {item.status === 'pending' && (
                            <>
                              <button
                                onClick={() => updateActionStatus(item.id, 'in_progress')}
                                className="px-3 py-1.5 rounded-lg text-sm bg-blue-500 text-white hover:bg-blue-600"
                              >
                                Start
                              </button>
                              <button
                                onClick={() => updateActionStatus(item.id, 'dismissed')}
                                className={`px-3 py-1.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                              >
                                Dismiss
                              </button>
                            </>
                          )}
                          {item.status === 'in_progress' && (
                            <button
                              onClick={() => updateActionStatus(item.id, 'completed')}
                              className="px-3 py-1.5 rounded-lg text-sm bg-green-500 text-white hover:bg-green-600"
                            >
                              Complete
                            </button>
                          )}
                          {(item.status === 'completed' || item.status === 'dismissed') && (
                            <button
                              onClick={() => updateActionStatus(item.id, 'pending')}
                              className={`px-3 py-1.5 rounded-lg text-sm ${darkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`}
                            >
                              Reopen
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* RAW DATABASE SECTION */}
            {activeSection === 'database' && (
              <motion.div
                key="database"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">Raw Database View</h2>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      All stored evaluation data from Firestore
                    </p>
                  </div>
                  <Button
                    onClick={fetchHistory}
                    variant="outline"
                    disabled={historyLoading}
                    className={darkMode ? 'border-gray-700' : ''}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${historyLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {/* Database Stats */}
                <div className="grid md:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Reports</p>
                    <p className="text-2xl font-bold">{history.length}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total Conversations</p>
                    <p className="text-2xl font-bold">
                      {history.reduce((sum, h) => sum + (h.conversationsAnalyzed || h.aiMetrics?.totalConversations || 0), 0)}
                    </p>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Prompt Versions</p>
                    <p className="text-2xl font-bold">{promptHistory.length || currentPrompt?.version || 0}</p>
                  </div>
                  <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Date Range</p>
                    <p className="text-lg font-bold">
                      {history.length > 0 ? (
                        <>
                          {history[history.length - 1]?.date || 'N/A'} - {history[0]?.date || 'N/A'}
                        </>
                      ) : 'No data'}
                    </p>
                  </div>
                </div>

                {/* Firestore Collections Info */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className="text-lg font-semibold mb-4">Firestore Collections</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <code className={`text-sm font-mono ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>ai_evaluation_history</code>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Daily evaluation reports with metrics, insights, and success rates
                      </p>
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Documents: daily_YYYY-MM-DD
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <code className={`text-sm font-mono ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>system_prompts</code>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Active and historical system prompt versions
                      </p>
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Current version: {currentPrompt?.version || 'None'}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <code className={`text-sm font-mono ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>system_prompt_history</code>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Complete version history for prompt changes
                      </p>
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Total versions: {promptHistory.length}
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                      <code className={`text-sm font-mono ${darkMode ? 'text-purple-400' : 'text-purple-600'}`}>users/{'{userId}'}/conversations</code>
                      <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Source data: User conversations from iOS app
                      </p>
                      <p className={`text-xs mt-2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                        Read-only (from iOS app)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Raw Data Table */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                  <h3 className="text-lg font-semibold mb-4">Stored Reports (Raw JSON)</h3>
                  {history.length === 0 ? (
                    <div className="text-center py-8">
                      <Eye className="w-12 h-12 mx-auto mb-4 text-gray-400 opacity-50" />
                      <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                        No evaluation data stored yet. Run an evaluation to populate the database.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {history.map((item) => (
                        <details
                          key={item.id}
                          className={`rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'} overflow-hidden`}
                        >
                          <summary className={`p-4 cursor-pointer flex items-center justify-between ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}>
                            <div className="flex items-center gap-3">
                              <Calendar className="w-5 h-5 text-purple-500" />
                              <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.date || item.analysisDate || item.id}
                              </span>
                              <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {item.conversationsAnalyzed || item.aiMetrics?.totalConversations || 0} conversations
                              </span>
                            </div>
                            <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                          </summary>
                          <div className={`p-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                            <pre className={`text-xs font-mono overflow-x-auto max-h-64 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {JSON.stringify(item, null, 2)}
                            </pre>
                          </div>
                        </details>
                      ))}
                    </div>
                  )}
                </div>

                {/* Technical Implementation Note */}
                <div className={`p-6 rounded-xl ${darkMode ? 'bg-yellow-900/20 border-yellow-800' : 'bg-yellow-50 border-yellow-200'} border`}>
                  <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                    <AlertTriangle className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                    Current Implementation: Rule-Based Analysis
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    The current evaluation uses <strong>pattern matching and heuristics</strong>, not AI:
                  </p>
                  <ul className={`text-sm mt-2 space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <li>• <strong>Topics:</strong> Keyword detection (e.g., "hola" → greeting, "code" → coding)</li>
                    <li>• <strong>Success:</strong> Pattern matching for "gracias", "thank you", message count thresholds</li>
                    <li>• <strong>Sentiment:</strong> Positive/negative word lists</li>
                    <li>• <strong>Quality:</strong> Response length thresholds ({"<"}50 chars = too short)</li>
                  </ul>
                  <p className={`text-sm mt-3 ${darkMode ? 'text-yellow-400' : 'text-yellow-700'}`}>
                    Want AI-powered evaluation? This would use GPT to actually understand if conversations were helpful.
                  </p>
                </div>
              </motion.div>
            )}

            {/* HISTORY SECTION */}
            {activeSection === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold">Evaluation History</h2>
                    {/* Sub-tabs for history views */}
                    {history.length > 1 && (
                      <div className={`flex rounded-lg overflow-hidden ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        {[
                          { id: 'trends', label: 'Trends', icon: '📈' },
                          { id: 'compare', label: 'Compare', icon: '⚖️' },
                          { id: 'list', label: 'All Reports', icon: '📋' },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            onClick={() => setHistorySubView(tab.id as typeof historySubView)}
                            className={`px-3 py-1.5 text-xs font-medium transition-colors flex items-center gap-1 ${
                              historySubView === tab.id
                                ? (darkMode ? 'bg-purple-600 text-white' : 'bg-purple-500 text-white')
                                : (darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-600 hover:text-gray-800')
                            }`}
                          >
                            <span>{tab.icon}</span>
                            {tab.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={fetchHistory}
                    variant="outline"
                    disabled={historyLoading}
                    className={darkMode ? 'border-gray-700' : ''}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${historyLoading ? 'animate-spin' : ''}`} />
                    Refresh
                  </Button>
                </div>

                {/* Trends View - Quality Trends Chart */}
                {historySubView === 'trends' && history.length > 1 && (
                  <QualityTrendsChart
                    historyData={history.map(item => ({
                      id: item.id,
                      generatedAt: item.generatedAt,
                      createdAt: item.createdAt,
                      aiMetrics: item.aiMetrics,
                      insights: item.insights,
                      qualityScore: item.aiAnalysis?.overallQuality,
                    }))}
                    isDark={darkMode}
                    onPointClick={(dataPoint) => {
                      // Find the history item for this date and load it
                      const historyItem = history.find(h => {
                        const hDate = new Date(h.createdAt || h.generatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        return hDate === dataPoint.displayDate
                      })
                      if (historyItem?.date) {
                        setSelectedDate(historyItem.date)
                        setIsHistoricalMode(false)
                        setHistorySubView('list')
                      }
                    }}
                  />
                )}

                {/* Compare View - Side-by-side evaluation comparison */}
                {historySubView === 'compare' && history.length > 1 && (
                  <EvaluationComparison
                    evaluations={history.map(item => ({
                      id: item.id,
                      generatedAt: item.generatedAt,
                      createdAt: item.createdAt,
                      sampleSize: item.sampleSize,
                      userMetrics: item.userMetrics,
                      aiMetrics: item.aiMetrics,
                      insights: item.insights,
                      qualityScore: item.aiAnalysis?.overallQuality,
                    }))}
                    isDark={darkMode}
                  />
                )}

                {historyLoading && (
                  <ChartSkeleton height={350} />
                )}

                {!historyLoading && history.length === 0 && (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">No History Yet</h3>
                    <p className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      Run evaluations to build up historical data
                    </p>
                  </div>
                )}

                {/* List View - All Reports */}
                {!historyLoading && history.length > 0 && historySubView === 'list' && (
                  <div className="space-y-4">
                    {history.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedHistoryItem(item)}
                        className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-gray-50'} border ${darkMode ? 'border-gray-700 hover:border-purple-500/50' : 'border-gray-200 hover:border-purple-300'} cursor-pointer transition-all hover:shadow-lg hover:scale-[1.01] group`}
                      >
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${darkMode ? 'bg-gradient-to-br from-purple-900/50 to-indigo-900/50' : 'bg-gradient-to-br from-purple-100 to-indigo-100'} group-hover:scale-110 transition-transform`}>
                              <Calendar className={`w-6 h-6 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-3 flex-wrap">
                                <p className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                  {item.date || item.analysisDate || 'Historical'}
                                </p>
                                {item.aiAnalysis && (
                                  <QualityBadge score={item.aiAnalysis.overallQuality} showScore={true} />
                                )}
                                {item.aiAnalysis && (
                                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 ${darkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                                    <Brain className="w-3 h-3" />
                                    AI Analysis
                                  </span>
                                )}
                              </div>
                              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                Generated {formatDate(item.createdAt || item.generatedAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {item.conversationsAnalyzed || item.aiMetrics?.totalConversations || 0} conversations
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {item.aiAnalysis?.issuesFound?.length || 0} issues • {item.aiAnalysis?.successPatterns?.length || 0} patterns
                              </p>
                            </div>
                            <div className={`p-2 rounded-lg ${darkMode ? 'bg-purple-500/20 group-hover:bg-purple-500/30' : 'bg-purple-100 group-hover:bg-purple-200'} transition-colors`}>
                              <Eye className={`w-5 h-5 ${darkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                            </div>
                          </div>
                        </div>

                        {/* AI Analysis Summary Preview */}
                        {item.aiAnalysis && (
                          <div className={`p-4 rounded-lg mb-4 ${darkMode ? 'bg-gradient-to-r from-purple-900/20 to-indigo-900/20 border border-purple-500/20' : 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200'}`}>
                            <p className={`text-sm line-clamp-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                              {item.aiAnalysis.summary}
                            </p>
                            {item.aiAnalysis.quickWins && item.aiAnalysis.quickWins.length > 0 && (
                              <div className="flex items-center gap-2 mt-2">
                                <Zap className="w-4 h-4 text-green-500" />
                                <span className={`text-xs font-medium ${darkMode ? 'text-green-400' : 'text-green-600'}`}>
                                  {item.aiAnalysis.quickWins.length} quick wins available
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Success Metrics Summary */}
                        {item.successMetrics && (
                          <div className="grid grid-cols-5 gap-3 mb-4">
                            <div className={`p-2 rounded-lg text-center ${darkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                              <p className="text-lg font-bold text-green-500">{item.successMetrics.successful}</p>
                              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Successful</p>
                            </div>
                            <div className={`p-2 rounded-lg text-center ${darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50'}`}>
                              <p className="text-lg font-bold text-yellow-500">{item.successMetrics.partial}</p>
                              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Partial</p>
                            </div>
                            <div className={`p-2 rounded-lg text-center ${darkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                              <p className="text-lg font-bold text-red-500">{item.successMetrics.failed}</p>
                              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Failed</p>
                            </div>
                            <div className={`p-2 rounded-lg text-center ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                              <p className="text-lg font-bold text-gray-500">{item.successMetrics.abandoned}</p>
                              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Abandoned</p>
                            </div>
                            <div className={`p-2 rounded-lg text-center ${darkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                              <p className="text-lg font-bold text-purple-500">{item.successMetrics.avgSuccessScore}</p>
                              <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Avg Score</p>
                            </div>
                          </div>
                        )}

                        <div className="grid grid-cols-4 gap-4">
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Total Messages</p>
                            <p className="font-bold">{item.aiMetrics?.totalMessages || 0}</p>
                          </div>
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Avg Length</p>
                            <p className="font-bold">{item.aiMetrics?.avgConversationLength?.toFixed(1) || 0}</p>
                          </div>
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Active 24h</p>
                            <p className="font-bold">{item.userMetrics?.activeUsers24h || 0}</p>
                          </div>
                          <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700/50' : 'bg-gray-50'}`}>
                            <p className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Avg Response</p>
                            <p className="font-bold">{Math.round(item.aiMetrics?.avgResponseLength || 0)}</p>
                          </div>
                        </div>

                        {/* Click to expand hint */}
                        <div className={`mt-4 pt-3 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} text-center`}>
                          <p className={`text-xs ${darkMode ? 'text-purple-400' : 'text-purple-600'} flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity`}>
                            <Eye className="w-3 h-3" />
                            Click to view full analysis details
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Evaluation Detail Modal */}
      {selectedHistoryItem && (
        <EvaluationDetailModal
          item={selectedHistoryItem}
          isOpen={!!selectedHistoryItem}
          onClose={() => setSelectedHistoryItem(null)}
          isDark={darkMode}
          onLoadEvaluation={() => {
            if (selectedHistoryItem.date) {
              setSelectedDate(selectedHistoryItem.date)
              setIsHistoricalMode(false)
              setSelectedHistoryItem(null)
              runEvaluation()
            }
          }}
        />
      )}
    </main>
  )
}
