'use client'

import { useState, useEffect } from 'react'
import {
  Users,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  MessageSquare,
  Image,
  Mic,
  Clock,
  Globe,
  Smartphone,
  RefreshCw,
  Download,
  Eye,
  UserPlus,
  Zap,
  AlertTriangle,
  Crown,
  Calendar,
  TrendingUp,
  Activity,
  ChevronDown,
  ChevronUp,
  BarChart3,
  PieChart,
  Target,
  Timer,
  Info,
  Bell,
  Sparkles,
  GitBranch,
  Send,
  Video,
  SearchIcon,
  Star,
  BellRing,
  DollarSign,
  UserX,
  Footprints,
  CreditCard,
  Loader2,
  Megaphone,
} from 'lucide-react'
import RetentionCohorts from './RetentionCohorts'
import ConversionFunnel from './ConversionFunnel'
import ErrorTracking from './ErrorTracking'
import BehaviorInsights from './BehaviorInsights'
import AlertsPanel from './AlertsPanel'
import PerformanceDashboard from './PerformanceDashboard'
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
  PieChart as RechartsPie,
  Pie,
  Cell,
} from 'recharts'

type UserSegment = 'all' | 'today' | 'new' | 'power' | 'at_risk' | 'voice' | 'images' | 'subscribed' | 'billing_retry' | 'churned' | 'videos'

interface User {
  id: string
  device_id: string
  user_name: string | null
  locale: string
  device_model: string
  os_version: string
  app_version: string
  total_app_opens: number
  total_messages_sent: number
  total_images_generated: number
  total_videos_generated: number
  total_voice_sessions: number
  total_web_searches: number
  total_session_seconds: number
  created_at: string | null
  last_active: string | null
  first_open_date: string | null
  last_open_date: string | null
  days_since_first_open: number
  voice_failure_count: number
  nsfw_attempt_count: number
  is_subscribed: boolean
  was_previously_premium: boolean
  is_in_billing_retry: boolean
  notification_granted: boolean
  has_rated: boolean
  engagement_level: string | null
  personalization_score: number
  conversation_count: number
  engagement_score: number
}

interface DashboardStats {
  overview: {
    totalUsers: number
    activeToday: number
    activeThisWeek: number
    activeThisMonth: number
    totalMessages: number
    totalImages: number
    totalVoiceSessions: number
    totalAppOpens: number
    totalVideos: number
    totalWebSearches: number
    totalSessionHours: number
    avgMessagesPerUser: number
    avgImagesPerUser: number
    avgAppOpensPerUser: number
    avgPersonalizationScore: number
  }
  changes: {
    activeThisWeek: number | null
    activeThisMonth: number | null
    newUsers: number | null
  }
  costs: {
    images: number
    voice: number
    webSearches: number
    chat: number
    total: number
    breakdown: {
      imageRate: number
      voiceRate: number
      voiceAvgMin: number
      webSearchRate: number
      chatRate: number
    }
  }
  segmentCounts: Record<string, number>
  topLocales: { locale: string; count: number; percentage: number }[]
  topDevices: { device: string; count: number; percentage: number }[]
  timeline: { date: string; signups: number; active: number }[]
  timelineDays: number
  retentionRate: { day1: number; day7: number }
  notifications?: {
    granted: number
    denied: number
    notYetAsked: number
    reachable: number
    unreachable: number
    totalSent: number
    engagedAfterNotification: number
    engagementRate: number
    peakHours: { hour: number; count: number }[]
  }
}

// Segment definitions
const SEGMENTS: { id: UserSegment; label: string; icon: any; description: string; color: string }[] = [
  { id: 'all', label: 'All Users', icon: Users, description: 'All registered users', color: 'purple' },
  { id: 'today', label: 'Active Today', icon: Zap, description: 'Users active in last 24h', color: 'green' },
  { id: 'new', label: 'New Users', icon: UserPlus, description: 'Registered in last 7 days', color: 'blue' },
  { id: 'subscribed', label: 'Subscribed', icon: Crown, description: 'Active subscribers', color: 'yellow' },
  { id: 'billing_retry', label: 'Billing Retry', icon: CreditCard, description: 'Payment failing', color: 'orange' },
  { id: 'churned', label: 'Churned', icon: UserX, description: 'Previously subscribed', color: 'red' },
  { id: 'power', label: 'Power Users', icon: Star, description: '50+ messages sent', color: 'orange' },
  { id: 'at_risk', label: 'At Risk', icon: AlertTriangle, description: 'Inactive 7+ days', color: 'red' },
  { id: 'voice', label: 'Voice Users', icon: Mic, description: 'Used voice chat', color: 'pink' },
  { id: 'images', label: 'Image Creators', icon: Image, description: 'Generated images', color: 'indigo' },
  { id: 'videos', label: 'Video Creators', icon: Video, description: 'Generated videos', color: 'cyan' },
]

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1']

interface UserListProps {
  analyticsKey: string
  isDark: boolean
  onUserSelect: (userId: string) => void
}

export default function UserList({ analyticsKey, isDark, onUserSelect }: UserListProps) {
  // Dashboard state
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null)
  const [loadingDashboard, setLoadingDashboard] = useState(true)

  // User list state
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal] = useState(0)
  const [sortBy, setSortBy] = useState('last_active')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [localeFilter, setLocaleFilter] = useState('')
  const [deviceFilter, setDeviceFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [availableLocales, setAvailableLocales] = useState<string[]>([])
  const [availableDevices, setAvailableDevices] = useState<string[]>([])
  const [activeSegment, setActiveSegment] = useState<UserSegment>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [minMessages, setMinMessages] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [segmentCounts, setSegmentCounts] = useState<Record<UserSegment, number>>({
    all: 0, today: 0, new: 0, power: 0, at_risk: 0, voice: 0, images: 0, subscribed: 0, billing_retry: 0, churned: 0, videos: 0
  })

  // View mode
  const [viewMode, setViewMode] = useState<'dashboard' | 'users' | 'notifications' | 'retention' | 'funnel' | 'onboarding' | 'insights' | 'errors' | 'alerts' | 'performance'>('dashboard')

  // Onboarding funnel state
  const [onboardingData, setOnboardingData] = useState<any>(null)
  const [loadingOnboarding, setLoadingOnboarding] = useState(false)

  // Auto-refresh state
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())
  const [timelineDays, setTimelineDays] = useState(90)

  // Revenue state
  const [revenue, setRevenue] = useState<any>(null)
  const [loadingRevenue, setLoadingRevenue] = useState(false)

  // Segment broadcast state
  const [showBroadcast, setShowBroadcast] = useState(false)
  const [broadcastTitle, setBroadcastTitle] = useState('')
  const [broadcastBody, setBroadcastBody] = useState('')
  const [broadcastTargetView, setBroadcastTargetView] = useState('chat')
  const [broadcastSending, setBroadcastSending] = useState(false)
  const [broadcastResult, setBroadcastResult] = useState<{ sent: number; failed: number; noToken: number; total: number } | null>(null)

  // Fetch dashboard stats
  const fetchDashboard = async (silent = false) => {
    if (!silent) setLoadingDashboard(true)
    try {
      const response = await fetch(`/api/analytics/users?key=${encodeURIComponent(analyticsKey)}&dashboard=true&timelineDays=${timelineDays}`)
      const data = await response.json()
      if (response.ok) {
        setDashboard(data)
        setLastRefreshed(new Date())
      }
    } catch (err) {
      console.error('Failed to fetch dashboard:', err)
    } finally {
      if (!silent) setLoadingDashboard(false)
    }
  }

  // Fetch ASC revenue
  const fetchRevenue = async () => {
    setLoadingRevenue(true)
    try {
      const res = await fetch(`/api/analytics/asc-revenue?key=${encodeURIComponent(analyticsKey)}&range=30d`)
      if (res.ok) {
        const data = await res.json()
        setRevenue(data)
      }
    } catch (err) {
      console.error('Failed to fetch revenue:', err)
    }
    setLoadingRevenue(false)
  }

  // Fetch users
  const fetchUsers = async (silent = false) => {
    if (!silent) setLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams({
        key: analyticsKey,
        page: page.toString(),
        limit: '50',
        sortBy,
        sortOrder,
      })

      if (localeFilter) params.append('locale', localeFilter)
      if (deviceFilter) params.append('device', deviceFilter)
      if (activeSegment !== 'all') params.append('segment', activeSegment)
      if (dateFrom) params.append('dateFrom', dateFrom)
      if (dateTo) params.append('dateTo', dateTo)
      if (minMessages) params.append('minMessages', minMessages)

      const response = await fetch(`/api/analytics/users?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch users')
      }

      setUsers(data.users)
      setTotal(data.total)
      setTotalPages(data.totalPages)
      if (data.filters) {
        setAvailableLocales(data.filters.locales || [])
        setAvailableDevices(data.filters.devices || [])
      }
      if (data.segmentCounts) {
        setSegmentCounts(data.segmentCounts)
      }
      setLastRefreshed(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  useEffect(() => {
    if (analyticsKey) {
      fetchDashboard()
      fetchUsers()
      fetchRevenue()
    }
  }, [analyticsKey])

  useEffect(() => {
    if (analyticsKey) {
      fetchDashboard()
    }
  }, [timelineDays])

  useEffect(() => {
    if (analyticsKey) {
      fetchUsers()
    }
  }, [analyticsKey, page, sortBy, sortOrder, localeFilter, deviceFilter, activeSegment, dateFrom, dateTo, minMessages])

  // Auto-refresh every 30 seconds to keep "Last Active" times updated
  useEffect(() => {
    if (!autoRefresh || !analyticsKey) return

    const interval = setInterval(() => {
      fetchDashboard(true) // Silent refresh
      fetchUsers(true) // Silent refresh
    }, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [autoRefresh, analyticsKey, page, sortBy, sortOrder, localeFilter, deviceFilter, activeSegment, dateFrom, dateTo, minMessages])

  // Fetch onboarding funnel on-demand
  useEffect(() => {
    if (viewMode === 'onboarding' && !onboardingData && !loadingOnboarding && analyticsKey) {
      setLoadingOnboarding(true)
      fetch(`/api/analytics/onboarding?key=${encodeURIComponent(analyticsKey)}&mode=funnel`)
        .then(res => res.json())
        .then(data => setOnboardingData(data))
        .catch(err => console.error('Failed to fetch onboarding data:', err))
        .finally(() => setLoadingOnboarding(false))
    }
  }, [viewMode, analyticsKey])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('desc')
    }
    setPage(1)
  }

  const handleSegmentChange = (segment: UserSegment) => {
    setActiveSegment(segment)
    setPage(1)
    setShowBroadcast(false)
    setBroadcastResult(null)
  }

  // Segment broadcast
  const sendSegmentBroadcast = async () => {
    if (!broadcastTitle || !broadcastBody || broadcastSending) return

    const segmentMap: Record<string, string> = {
      subscribed: 'subscribed',
      churned: 'churned',
      billing_retry: 'billing_retry',
      at_risk: 'at_risk',
    }
    const segment = segmentMap[activeSegment]
    if (!segment) return

    if (!confirm(`Send "${broadcastTitle}" to all ${segmentCounts[activeSegment] || 0} ${activeSegment} users?`)) return

    setBroadcastSending(true)
    setBroadcastResult(null)
    try {
      const res = await fetch('/api/analytics/push-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: analyticsKey,
          mode: 'segment',
          segment,
          title: broadcastTitle,
          body: broadcastBody,
          targetView: broadcastTargetView,
        }),
      })
      const data = await res.json()
      setBroadcastResult({ sent: data.sent || 0, failed: data.failed || 0, noToken: data.noToken || 0, total: data.total || 0 })
      setBroadcastTitle('')
      setBroadcastBody('')
    } catch (err) {
      setBroadcastResult({ sent: 0, failed: 1, noToken: 0, total: 0 })
    }
    setBroadcastSending(false)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 60000) return 'Just now'
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`

    return date.toLocaleDateString()
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getEngagementColor = (score: number) => {
    if (score >= 70) return 'text-green-500'
    if (score >= 40) return 'text-yellow-500'
    return 'text-red-500'
  }

  const exportCSV = () => {
    const headers = ['Name', 'Device ID', 'Locale', 'Device', 'OS', 'App Version', 'Subscribed', 'Messages', 'Images', 'Videos', 'Voice Sessions', 'Web Searches', 'App Opens', 'Notifications', 'First Open', 'Last Active', 'Engagement Score']
    const rows = users.map(u => [
      u.user_name || '',
      u.device_id,
      u.locale,
      u.device_model,
      u.os_version,
      u.app_version,
      u.is_subscribed ? 'Yes' : 'No',
      u.total_messages_sent,
      u.total_images_generated,
      u.total_videos_generated,
      u.total_voice_sessions,
      u.total_web_searches,
      u.total_app_opens,
      u.notification_granted ? 'Granted' : 'No',
      u.first_open_date || u.created_at || 'Never',
      u.last_active || 'Never',
      u.engagement_score,
    ])

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `users-${activeSegment}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const filteredUsers = searchQuery
    ? users.filter(u =>
        u.device_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (u.user_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.locale.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.device_model.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : users

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${isDark ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
            <Users className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h2 className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              User Analytics
            </h2>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Comprehensive user insights and segmentation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Last Updated */}
          <span className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Updated {lastRefreshed.toLocaleTimeString()}
          </span>

          {/* View Toggle */}
          <div className={`flex rounded-lg p-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'} overflow-x-auto`}>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'notifications', label: 'Notifications', icon: Send },
              { id: 'performance', label: 'Performance', icon: Activity },
              { id: 'retention', label: 'Retention', icon: Target },
              { id: 'funnel', label: 'Funnel', icon: GitBranch },
              { id: 'onboarding', label: 'Onboarding', icon: Footprints },
              { id: 'insights', label: 'AI Insights', icon: Sparkles },
              { id: 'errors', label: 'Errors', icon: AlertTriangle },
              { id: 'alerts', label: 'Alerts', icon: Bell },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setViewMode(id as any)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  viewMode === id
                    ? 'bg-purple-500 text-white'
                    : isDark ? 'text-gray-400 hover:text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 inline mr-1" />
                {label}
              </button>
            ))}
          </div>

          {/* Auto-refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              autoRefresh
                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                : isDark ? 'bg-gray-800 text-gray-400 border border-gray-700' : 'bg-gray-100 text-gray-500 border border-gray-200'
            }`}
          >
            <Activity className={`w-3 h-3 inline mr-1 ${autoRefresh ? 'animate-pulse' : ''}`} />
            {autoRefresh ? 'Live' : 'Paused'}
          </button>

          <Button
            onClick={() => { fetchDashboard(); fetchUsers(); }}
            variant="outline"
            size="sm"
            className={isDark ? 'border-gray-700' : ''}
          >
            <RefreshCw className={`w-4 h-4 ${loading || loadingDashboard ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            onClick={exportCSV}
            variant="outline"
            size="sm"
            className={isDark ? 'border-gray-700' : ''}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Dashboard View */}
      {viewMode === 'dashboard' && loadingDashboard && !dashboard && (
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      )}
      {viewMode === 'dashboard' && dashboard && (
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Users', value: formatNumber(dashboard.overview.totalUsers), icon: Users, color: 'purple', change: null as number | null },
              { label: 'WAU', value: formatNumber(dashboard.overview.activeThisWeek), icon: TrendingUp, color: 'blue', change: dashboard.changes?.activeThisWeek ?? null },
              { label: 'MAU', value: formatNumber(dashboard.overview.activeThisMonth), icon: Activity, color: 'green', change: dashboard.changes?.activeThisMonth ?? null },
              { label: 'New Users (7d)', value: formatNumber(dashboard.segmentCounts.new || 0), icon: UserPlus, color: 'cyan', change: dashboard.changes?.newUsers ?? null },
              { label: 'Subscribed', value: formatNumber(dashboard.segmentCounts.subscribed || 0), icon: Crown, color: 'yellow', change: null },
              { label: 'Billing Retry', value: formatNumber(dashboard.segmentCounts.billing_retry || 0), icon: CreditCard, color: 'orange', change: null },
              { label: 'Churned', value: formatNumber(dashboard.segmentCounts.churned || 0), icon: UserX, color: 'red', change: null },
              { label: 'Messages', value: formatNumber(dashboard.overview.totalMessages), icon: MessageSquare, color: 'indigo', change: null },
              { label: 'Images', value: formatNumber(dashboard.overview.totalImages), icon: Image, color: 'pink', change: null },
              { label: 'Videos', value: formatNumber(dashboard.overview.totalVideos), icon: Video, color: 'cyan', change: null },
              { label: 'Voice Sessions', value: formatNumber(dashboard.overview.totalVoiceSessions), icon: Mic, color: 'red', change: null },
              { label: 'Notifications', value: formatNumber(dashboard.segmentCounts.notification_granted || 0), icon: BellRing, color: 'emerald', change: null },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</span>
                </div>
                <div className="flex items-end justify-between">
                  <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {stat.value}
                  </p>
                  {stat.change !== null && (
                    <span className={`text-xs font-medium flex items-center gap-0.5 ${
                      stat.change > 0 ? 'text-green-500' : stat.change < 0 ? 'text-red-500' : isDark ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      <TrendingUp className={`w-3 h-3 ${stat.change < 0 ? 'rotate-180' : ''}`} />
                      {stat.change > 0 ? '+' : ''}{stat.change}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ASC Revenue */}
          {revenue && !revenue.error && (
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    Revenue (ASC)
                  </h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                    Last 30 days
                  </span>
                </div>
                <button
                  onClick={fetchRevenue}
                  disabled={loadingRevenue}
                  className={`text-xs px-2 py-1 rounded ${isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {loadingRevenue ? <RefreshCw className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
                </button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>MRR</span>
                  <p className={`text-xl font-bold text-green-500`}>${revenue.mrr?.toFixed(2) || '0.00'}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>This Month</span>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>${revenue.revenueThisMonth?.toFixed(2) || '0.00'}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>New Subs</span>
                  <p className={`text-xl font-bold text-blue-500`}>{revenue.newSubscriptions || 0}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Renewals</span>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{revenue.renewals || 0}</p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Refunds</span>
                  <p className={`text-xl font-bold text-red-500`}>{revenue.refunds || 0}</p>
                </div>
              </div>
              {/* Revenue Timeline Chart */}
              {revenue.dailyTimeline?.length > 0 && (
                <div className="mt-4">
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={revenue.dailyTimeline}>
                      <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                        tickFormatter={(d: string) => new Date(d).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                      />
                      <YAxis
                        tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                        tickFormatter={(v: number) => `$${v}`}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: isDark ? '#1f2937' : '#fff',
                          border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                          borderRadius: '8px',
                          fontSize: 12,
                        }}
                        formatter={(value: number | undefined) => [`$${(value ?? 0).toFixed(2)}`, 'Revenue']}
                        labelFormatter={(d: string) => new Date(d).toLocaleDateString('en', { month: 'long', day: 'numeric', year: 'numeric' })}
                      />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10b981"
                        fill="#10b981"
                        fillOpacity={0.15}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
              {/* By Product Breakdown */}
              {revenue.byProduct && Object.keys(revenue.byProduct).length > 0 && (
                <div className="mt-4">
                  <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>By Product</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(revenue.byProduct).map(([sku, data]: [string, any]) => (
                      <span
                        key={sku}
                        className={`text-xs px-2.5 py-1 rounded-lg ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {sku}: ${data.revenue.toFixed(2)} ({data.units} units)
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {revenue.warning && (
                <p className={`text-xs mt-2 ${isDark ? 'text-yellow-500' : 'text-yellow-600'}`}>{revenue.warning}</p>
              )}
            </div>
          )}
          {loadingRevenue && !revenue && (
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'} flex items-center gap-2`}>
              <RefreshCw className="w-4 h-4 animate-spin text-green-500" />
              <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Loading revenue data...</span>
            </div>
          )}

          {/* Estimated API Costs */}
          {dashboard.costs && (
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-500" />
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Estimated API Costs
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-full ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                  All time
                </span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Image className="w-3.5 h-3.5 text-pink-500" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Images</span>
                  </div>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ${dashboard.costs.images.toFixed(2)}
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatNumber(dashboard.overview.totalImages)} × ${dashboard.costs.breakdown.imageRate}
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Mic className="w-3.5 h-3.5 text-red-500" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Voice</span>
                  </div>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ${dashboard.costs.voice.toFixed(2)}
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatNumber(dashboard.overview.totalVoiceSessions)} × ~{dashboard.costs.breakdown.voiceAvgMin}min × ${dashboard.costs.breakdown.voiceRate}
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <Search className="w-3.5 h-3.5 text-indigo-500" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Web Search</span>
                  </div>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ${dashboard.costs.webSearches.toFixed(2)}
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatNumber(dashboard.overview.totalWebSearches)} × ${dashboard.costs.breakdown.webSearchRate}
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-500" />
                    <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Chat</span>
                  </div>
                  <p className={`text-xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    ${dashboard.costs.chat.toFixed(2)}
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    {formatNumber(dashboard.overview.totalMessages)} × ~${dashboard.costs.breakdown.chatRate}
                  </p>
                </div>
                <div className={`p-4 rounded-xl border-2 ${isDark ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <DollarSign className="w-3.5 h-3.5 text-green-500" />
                    <span className={`text-xs font-medium ${isDark ? 'text-green-400' : 'text-green-600'}`}>Total</span>
                  </div>
                  <p className={`text-xl font-bold text-green-500`}>
                    ${dashboard.costs.total.toFixed(2)}
                  </p>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                    ~${dashboard.overview.totalUsers > 0 ? (dashboard.costs.total / dashboard.overview.totalUsers).toFixed(3) : '0'}/user
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Timeline */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Activity Timeline
                </h3>
                <div className="flex gap-1">
                  {[
                    { label: '30d', value: 30 },
                    { label: '60d', value: 60 },
                    { label: '90d', value: 90 },
                    { label: '180d', value: 180 },
                    { label: 'All', value: 365 },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTimelineDays(opt.value)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        timelineDays === opt.value
                          ? 'bg-purple-600 text-white'
                          : isDark
                            ? 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dashboard.timeline}>
                    <defs>
                      <linearGradient id="activeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="signupsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis
                      dataKey="date"
                      tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                      tickFormatter={(d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    />
                    <Area type="monotone" dataKey="active" stroke="#8b5cf6" fillOpacity={1} fill="url(#activeGradient)" name="Active Users" />
                    <Area type="monotone" dataKey="signups" stroke="#10b981" fillOpacity={1} fill="url(#signupsGradient)" name="New Signups" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top Locales */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                User Distribution by Locale
              </h3>
              <div className="space-y-3">
                {dashboard.topLocales.slice(0, 6).map((item, index) => (
                  <div key={item.locale} className="flex items-center gap-3">
                    <div className="w-16 text-sm font-medium" style={{ color: COLORS[index % COLORS.length] }}>
                      {item.locale}
                    </div>
                    <div className="flex-1">
                      <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{
                            width: `${item.percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>
                    </div>
                    <div className={`w-16 text-right text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.count} ({item.percentage}%)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Retention & Engagement */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Retention */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-medium mb-4 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Target className="w-4 h-4" />
                Retention Rates
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Day 1 Retention</span>
                    <span className={`text-sm font-medium ${dashboard.retentionRate.day1 >= 50 ? 'text-green-500' : 'text-yellow-500'}`}>
                      {dashboard.retentionRate.day1}%
                    </span>
                  </div>
                  <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className={`h-2 rounded-full ${dashboard.retentionRate.day1 >= 50 ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${dashboard.retentionRate.day1}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Day 7 Retention</span>
                    <span className={`text-sm font-medium ${dashboard.retentionRate.day7 >= 30 ? 'text-green-500' : 'text-yellow-500'}`}>
                      {dashboard.retentionRate.day7}%
                    </span>
                  </div>
                  <div className={`h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                    <div
                      className={`h-2 rounded-full ${dashboard.retentionRate.day7 >= 30 ? 'bg-green-500' : 'bg-yellow-500'}`}
                      style={{ width: `${dashboard.retentionRate.day7}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Averages */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-medium mb-4 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Activity className="w-4 h-4" />
                User Engagement
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Messages/User</span>
                  <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {dashboard.overview.avgMessagesPerUser}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Avg Images/User</span>
                  <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {dashboard.overview.avgImagesPerUser}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Session Hours</span>
                  <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {formatNumber(dashboard.overview.totalSessionHours)}h
                  </span>
                </div>
              </div>
            </div>

            {/* Top Devices */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-medium mb-4 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Smartphone className="w-4 h-4" />
                Top Devices
              </h3>
              <div className="space-y-2">
                {dashboard.topDevices.slice(0, 5).map((item, index) => (
                  <div key={item.device} className="flex items-center justify-between">
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {item.device}
                    </span>
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {item.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User List View */}
      {viewMode === 'users' && (
        <>
          {/* Segment Tabs */}
          <div className={`p-2 rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'} overflow-x-auto`}>
            <div className="flex gap-2 min-w-max">
              {SEGMENTS.map((segment) => {
                const count = segmentCounts[segment.id] || 0
                const isActive = activeSegment === segment.id
                return (
                  <button
                    key={segment.id}
                    onClick={() => handleSegmentChange(segment.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                      isActive
                        ? `bg-${segment.color}-500 text-white shadow-lg`
                        : isDark
                          ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                    style={isActive ? { backgroundColor: COLORS[SEGMENTS.findIndex(s => s.id === segment.id) % COLORS.length] } : {}}
                  >
                    <segment.icon className="w-4 h-4" />
                    <span className="font-medium">{segment.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      isActive
                        ? 'bg-white/20'
                        : isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}>
                      {formatNumber(count)}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Segment Broadcast */}
          {['subscribed', 'churned', 'billing_retry', 'at_risk'].includes(activeSegment) && (
            <div className={`rounded-xl ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <button
                onClick={() => { setShowBroadcast(!showBroadcast); setBroadcastResult(null) }}
                className={`w-full flex items-center justify-between p-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
              >
                <div className="flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-purple-500" />
                  <span className="text-sm font-medium">Send to {SEGMENTS.find(s => s.id === activeSegment)?.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'}`}>
                    {segmentCounts[activeSegment] || 0} users
                  </span>
                </div>
                {showBroadcast ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showBroadcast && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Title (max 27 chars)</label>
                      <input
                        type="text"
                        maxLength={27}
                        placeholder="Tu IA tiene algo nuevo"
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        className={`w-full mt-1 text-sm rounded-lg px-3 py-2 ${
                          isDark ? 'bg-gray-900 text-gray-200 border-gray-700 placeholder-gray-600' : 'bg-white text-gray-800 border-gray-200 placeholder-gray-400'
                        } border`}
                      />
                    </div>
                    <div>
                      <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Target View</label>
                      <select
                        value={broadcastTargetView}
                        onChange={(e) => setBroadcastTargetView(e.target.value)}
                        className={`w-full mt-1 text-sm rounded-lg px-3 py-2 ${
                          isDark ? 'bg-gray-900 text-gray-200 border-gray-700' : 'bg-white text-gray-800 border-gray-200'
                        } border`}
                      >
                        <option value="chat">Open → Chat</option>
                        <option value="images">Open → Images</option>
                        <option value="voice">Open → Voice</option>
                        <option value="learn">Open → Learn</option>
                        <option value="settings">Open → Settings</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Body (max 80 chars)</label>
                    <input
                      type="text"
                      maxLength={80}
                      placeholder="Message body..."
                      value={broadcastBody}
                      onChange={(e) => setBroadcastBody(e.target.value)}
                      className={`w-full mt-1 text-sm rounded-lg px-3 py-2 ${
                        isDark ? 'bg-gray-900 text-gray-200 border-gray-700 placeholder-gray-600' : 'bg-white text-gray-800 border-gray-200 placeholder-gray-400'
                      } border`}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={sendSegmentBroadcast}
                      disabled={broadcastSending || !broadcastTitle || !broadcastBody}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        broadcastSending
                          ? 'bg-purple-500/20 text-purple-400 cursor-wait'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      } disabled:opacity-40 disabled:cursor-not-allowed`}
                    >
                      {broadcastSending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                      ) : (
                        <><Send className="w-4 h-4" /> Send to Segment</>
                      )}
                    </button>
                    {broadcastResult && (
                      <span className={`text-sm ${broadcastResult.sent > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {broadcastResult.sent} sent · {broadcastResult.failed} failed · {broadcastResult.noToken} no token
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Filters */}
          <div className={`rounded-xl ${isDark ? 'bg-gray-800' : 'bg-gray-50'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`w-full flex items-center justify-between p-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}
            >
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filters</span>
                {(localeFilter || deviceFilter || dateFrom || dateTo || minMessages) && (
                  <span className="px-2 py-0.5 rounded-full bg-purple-500 text-white text-xs">
                    Active
                  </span>
                )}
              </div>
              {showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showFilters && (
              <div className="p-4 pt-0 grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* Search */}
                <div className="col-span-2 md:col-span-1">
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Search</label>
                  <div className="relative mt-1">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      placeholder="Device ID, locale..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                        isDark
                          ? 'bg-gray-900 text-gray-200 border-gray-700'
                          : 'bg-white text-gray-800 border-gray-200'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                </div>

                {/* Locale Filter */}
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Locale</label>
                  <select
                    value={localeFilter}
                    onChange={(e) => { setLocaleFilter(e.target.value); setPage(1); }}
                    className={`w-full mt-1 px-3 py-2 rounded-lg ${
                      isDark
                        ? 'bg-gray-900 text-gray-200 border-gray-700'
                        : 'bg-white text-gray-800 border-gray-200'
                    } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="">All Locales</option>
                    {availableLocales.map(locale => (
                      <option key={locale} value={locale}>{locale}</option>
                    ))}
                  </select>
                </div>

                {/* Device Filter */}
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Device</label>
                  <select
                    value={deviceFilter}
                    onChange={(e) => { setDeviceFilter(e.target.value); setPage(1); }}
                    className={`w-full mt-1 px-3 py-2 rounded-lg ${
                      isDark
                        ? 'bg-gray-900 text-gray-200 border-gray-700'
                        : 'bg-white text-gray-800 border-gray-200'
                    } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  >
                    <option value="">All Devices</option>
                    {availableDevices.map(device => (
                      <option key={device} value={device}>{device}</option>
                    ))}
                  </select>
                </div>

                {/* Min Messages */}
                <div>
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Min Messages</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={minMessages}
                    onChange={(e) => { setMinMessages(e.target.value); setPage(1); }}
                    className={`w-full mt-1 px-3 py-2 rounded-lg ${
                      isDark
                        ? 'bg-gray-900 text-gray-200 border-gray-700'
                        : 'bg-white text-gray-800 border-gray-200'
                    } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                  />
                </div>

                {/* Date Range */}
                <div className="col-span-2 md:col-span-1">
                  <label className={`text-xs font-medium ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Date Range</label>
                  <div className="flex gap-2 mt-1">
                    <input
                      type="date"
                      value={dateFrom}
                      onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                      className={`flex-1 px-2 py-2 rounded-lg text-sm ${
                        isDark
                          ? 'bg-gray-900 text-gray-200 border-gray-700'
                          : 'bg-white text-gray-800 border-gray-200'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                    <input
                      type="date"
                      value={dateTo}
                      onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                      className={`flex-1 px-2 py-2 rounded-lg text-sm ${
                        isDark
                          ? 'bg-gray-900 text-gray-200 border-gray-700'
                          : 'bg-white text-gray-800 border-gray-200'
                      } border focus:outline-none focus:ring-2 focus:ring-purple-500`}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/30 border-red-800' : 'bg-red-50 border-red-200'} border text-red-500`}>
              {error}
            </div>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between">
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Showing {filteredUsers.length} of {total.toLocaleString()} users
            </p>
          </div>

          {/* Table */}
          <div className={`rounded-xl overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className={isDark ? 'bg-gray-800' : 'bg-gray-50'}>
                  <tr>
                    {[
                      { key: 'device_id', label: 'User', icon: Users, hasInfo: false },
                      { key: 'locale', label: 'Locale', icon: Globe, hasInfo: false },
                      { key: 'total_messages_sent', label: 'Messages', icon: MessageSquare, hasInfo: false },
                      { key: 'total_images_generated', label: 'Images', icon: Image, hasInfo: false },
                      { key: 'total_videos_generated', label: 'Videos', icon: Video, hasInfo: false },
                      { key: 'total_voice_sessions', label: 'Voice', icon: Mic, hasInfo: false },
                      { key: 'total_app_opens', label: 'Opens', icon: Activity, hasInfo: false },
                      { key: 'first_open_date', label: 'First Open', icon: Calendar, hasInfo: false },
                      { key: 'last_active', label: 'Last Active', icon: Clock, hasInfo: false },
                      { key: 'engagement_score', label: 'Score', icon: Target, hasInfo: true },
                    ].map(({ key, label, icon: Icon, hasInfo }) => (
                      <th
                        key={key}
                        onClick={() => handleSort(key)}
                        className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-opacity-80 ${
                          isDark ? 'text-gray-400' : 'text-gray-500'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {Icon && <Icon className="w-3 h-3" />}
                          {label}
                          {hasInfo && (
                            <span
                              className="relative group"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Info className="w-3 h-3 text-gray-400 hover:text-purple-400 cursor-help" />
                              <div className={`absolute top-full right-0 mt-2 px-3 py-2 text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 w-56 ${isDark ? 'bg-gray-700 text-gray-200' : 'bg-gray-900 text-white'}`}>
                                <div className="font-semibold mb-1">Engagement Score (0-100)</div>
                                <div className="text-left normal-case font-normal space-y-0.5">
                                  <div>Messages: up to 30pts</div>
                                  <div>Conversations: up to 15pts</div>
                                  <div>Images: up to 10pts</div>
                                  <div>Voice: up to 10pts</div>
                                  <div>Videos: up to 10pts</div>
                                  <div>Web searches: up to 8pts</div>
                                  <div>Session time: up to 7pts</div>
                                  <div>Personalization: up to 5pts</div>
                                  <div>Subscribed: 5pts</div>
                                </div>
                              </div>
                            </span>
                          )}
                          {sortBy === key && (
                            <ArrowUpDown className={`w-3 h-3 ${sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                          )}
                        </div>
                      </th>
                    ))}
                    <th className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-gray-700' : 'divide-gray-200'}`}>
                  {loading ? (
                    [...Array(10)].map((_, i) => (
                      <tr key={i} className={isDark ? 'bg-gray-900' : 'bg-white'}>
                        {[...Array(11)].map((_, j) => (
                          <td key={j} className="px-4 py-3">
                            <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'} animate-pulse`}></div>
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : filteredUsers.length === 0 ? (
                    <tr className={isDark ? 'bg-gray-900' : 'bg-white'}>
                      <td colSpan={11} className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        onClick={() => onUserSelect(user.id)}
                        className={`cursor-pointer transition-colors ${
                          isDark
                            ? 'bg-gray-900 hover:bg-gray-800'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {user.is_subscribed && !user.is_in_billing_retry && <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />}
                            {user.is_in_billing_retry && <CreditCard className="w-3 h-3 text-orange-500 flex-shrink-0" />}
                            {user.was_previously_premium && !user.is_subscribed && !user.is_in_billing_retry && <UserX className="w-3 h-3 text-red-500 flex-shrink-0" />}
                            {user.notification_granted && <BellRing className="w-3 h-3 text-green-500 flex-shrink-0" />}
                            <div className="min-w-0">
                              {user.user_name ? (
                                <>
                                  <p className={`text-sm font-medium truncate ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                    {user.user_name}
                                  </p>
                                  <p className={`font-mono text-xs truncate ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                    {user.device_id.substring(0, 8)}...
                                  </p>
                                </>
                              ) : (
                                <p className={`font-mono text-sm truncate ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                                  {user.device_id.substring(0, 12)}...
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.locale}
                        </td>
                        <td className={`px-4 py-3 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {Math.max(user.total_messages_sent, user.conversation_count).toLocaleString()}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.total_images_generated}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.total_videos_generated}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.total_voice_sessions}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.total_app_opens}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(user.first_open_date || user.created_at)}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          {formatDate(user.last_active)}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-bold ${getEngagementColor(user.engagement_score)}`}>
                            {user.engagement_score}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              onUserSelect(user.id)
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Page {page} of {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  variant="outline"
                  size="sm"
                  className={isDark ? 'border-gray-700' : ''}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className={`px-3 py-1 rounded ${isDark ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
                  {page} / {totalPages}
                </span>
                <Button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  variant="outline"
                  size="sm"
                  className={isDark ? 'border-gray-700' : ''}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Notifications Analytics View */}
      {viewMode === 'notifications' && dashboard && (
        <div className="space-y-6">
          {/* Notification Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              {
                label: 'Granted',
                value: dashboard.notifications?.granted || 0,
                icon: BellRing,
                color: 'green',
                description: 'Users who granted permission'
              },
              {
                label: 'Denied',
                value: dashboard.notifications?.denied || 0,
                icon: Bell,
                color: 'red',
                description: 'Prompted but declined'
              },
              {
                label: 'Not Yet Asked',
                value: dashboard.notifications?.notYetAsked || 0,
                icon: Clock,
                color: 'yellow',
                description: 'Haven\'t been prompted yet'
              },
              {
                label: 'Notifications Sent',
                value: dashboard.notifications?.totalSent || 0,
                icon: Send,
                color: 'blue',
                description: 'Total sent'
              },
              {
                label: 'Engagement Rate',
                value: `${dashboard.notifications?.engagementRate || 0}%`,
                icon: Zap,
                color: 'purple',
                description: 'Opened app after notification'
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                  <span className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</span>
                </div>
                <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
                </p>
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{stat.description}</p>
              </div>
            ))}
          </div>

          {/* Reachability Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-medium mb-4 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Bell className="w-4 h-4" />
                Notification Permission Status
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPie>
                    <Pie
                      data={[
                        { name: 'Granted', value: dashboard.notifications?.granted || 0, fill: '#10b981' },
                        { name: 'Denied', value: dashboard.notifications?.denied || 0, fill: '#ef4444' },
                        { name: 'Not Yet Asked', value: dashboard.notifications?.notYetAsked || 0, fill: '#eab308' },
                      ]}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      label={({ name, percent }: any) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                    >
                      <Cell fill="#10b981" />
                      <Cell fill="#ef4444" />
                      <Cell fill="#eab308" />
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                    />
                  </RechartsPie>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Granted ({dashboard.notifications?.granted || 0})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Denied ({dashboard.notifications?.denied || 0})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Not Yet Asked ({dashboard.notifications?.notYetAsked || 0})
                  </span>
                </div>
              </div>
            </div>

            {/* Peak Activity Hours */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-medium mb-4 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <Clock className="w-4 h-4" />
                Peak Activity Hours (Best Times to Send)
              </h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dashboard.notifications?.peakHours || []}>
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#e5e7eb'} />
                    <XAxis
                      dataKey="hour"
                      tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }}
                      tickFormatter={(h) => `${h}:00`}
                    />
                    <YAxis tick={{ fill: isDark ? '#9ca3af' : '#6b7280', fontSize: 10 }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: isDark ? '#1f2937' : '#ffffff',
                        border: 'none',
                        borderRadius: '8px',
                      }}
                      formatter={(value: any) => [`${value} users active`, 'Activity']}
                      labelFormatter={(hour) => `${hour}:00`}
                    />
                    <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Notifications are automatically sent at each user's preferred time based on their activity patterns
              </p>
            </div>
          </div>

          {/* Engagement After Notification */}
          <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
            <h3 className={`text-sm font-medium mb-4 flex items-center gap-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              <TrendingUp className="w-4 h-4" />
              Notification Engagement Funnel
            </h3>
            <div className="space-y-4">
              {/* Funnel visualization */}
              {[
                {
                  label: 'Users with Push Enabled',
                  value: dashboard.notifications?.reachable || 0,
                  percentage: 100,
                  color: 'purple'
                },
                {
                  label: 'Notifications Delivered',
                  value: dashboard.notifications?.totalSent || 0,
                  percentage: dashboard.notifications?.reachable
                    ? Math.round((dashboard.notifications?.totalSent || 0) / dashboard.notifications.reachable * 100)
                    : 0,
                  color: 'blue'
                },
                {
                  label: 'Engaged (Opened App)',
                  value: dashboard.notifications?.engagedAfterNotification || 0,
                  percentage: dashboard.notifications?.engagementRate || 0,
                  color: 'green'
                },
              ].map((step, index) => (
                <div key={step.label} className="flex items-center gap-4">
                  <div className="w-32 text-right">
                    <span className={`text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {step.label}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className={`h-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}>
                      <div
                        className={`h-8 rounded-lg bg-${step.color}-500 transition-all flex items-center justify-end pr-3`}
                        style={{ width: `${Math.max(step.percentage, 5)}%` }}
                      >
                        <span className="text-white text-sm font-medium">
                          {formatNumber(step.value)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="w-16 text-left">
                    <span className={`text-sm font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {step.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Smart Notification Info */}
          <div className={`p-6 rounded-xl ${isDark ? 'bg-purple-900/20 border-purple-800' : 'bg-purple-50 border-purple-200'} border`}>
            <h3 className={`text-sm font-medium mb-3 flex items-center gap-2 ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
              <Sparkles className="w-4 h-4" />
              Smart Notification System
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className={`text-xs font-medium mb-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>AI-Powered Content</p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  GPT generates personalized, value-driven messages based on user behavior patterns
                </p>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Optimal Timing</p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Notifications sent at each user's peak activity hours (morning/afternoon/evening)
                </p>
              </div>
              <div>
                <p className={`text-xs font-medium mb-1 ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>Segment Targeting</p>
                <p className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Users grouped by behavior: never started, image lovers, voice users, power users
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Dashboard View */}
      {viewMode === 'performance' && (
        <PerformanceDashboard analyticsKey={analyticsKey} />
      )}

      {/* Retention Cohorts View */}
      {viewMode === 'retention' && (
        <RetentionCohorts analyticsKey={analyticsKey} />
      )}

      {/* Conversion Funnel View */}
      {viewMode === 'funnel' && (
        <ConversionFunnel analyticsKey={analyticsKey} />
      )}

      {/* AI Insights View */}
      {viewMode === 'insights' && (
        <BehaviorInsights analyticsKey={analyticsKey} />
      )}

      {/* Error Tracking View */}
      {viewMode === 'errors' && (
        <ErrorTracking analyticsKey={analyticsKey} onUserClick={onUserSelect} />
      )}

      {/* Alerts View */}
      {viewMode === 'alerts' && (
        <AlertsPanel analyticsKey={analyticsKey} />
      )}

      {/* Onboarding View */}
      {viewMode === 'onboarding' && (
        <div className="space-y-6">
          {loadingOnboarding && (
            <div className="flex items-center justify-center py-20">
              <RefreshCw className="w-8 h-8 animate-spin text-purple-500" />
            </div>
          )}
          {onboardingData && !onboardingData.error && (
            <>
              {/* Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Completion Rate', value: `${onboardingData.metrics?.completionRate || 0}%`, color: 'green' },
                  { label: 'Skip Rate', value: `${onboardingData.metrics?.skipRate || 0}%`, color: 'red' },
                  { label: 'Name Entry Rate', value: `${onboardingData.metrics?.nameEntryRate || 0}%`, color: 'blue' },
                  { label: 'Trial Tap Rate', value: `${onboardingData.metrics?.trialTapRate || 0}%`, color: 'purple' },
                ].map((metric) => (
                  <div
                    key={metric.label}
                    className={`p-4 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{metric.label}</p>
                    <p className={`text-2xl font-bold text-${metric.color}-500`}>{metric.value}</p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { label: 'Started', value: onboardingData.totals?.started || 0 },
                  { label: 'Completed', value: onboardingData.totals?.completed || 0 },
                  { label: 'Skipped', value: onboardingData.totals?.skipped || 0 },
                  { label: 'Name Entered', value: onboardingData.totals?.nameEntered || 0 },
                  { label: 'Name Skipped', value: onboardingData.totals?.nameSkipped || 0 },
                  { label: 'Chat Exchanges', value: onboardingData.totals?.chatExchanges || 0 },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className={`p-3 rounded-lg text-center ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}
                  >
                    <p className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {stat.value.toLocaleString()}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Funnel Visualization */}
              <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  Onboarding Funnel
                </h3>
                <div className="space-y-3">
                  {(onboardingData.steps || []).map((step: any, index: number) => {
                    const maxCount = Math.max(...(onboardingData.steps || []).map((s: any) => s.count))
                    const widthPercent = maxCount > 0 ? (step.count / maxCount) * 100 : 0
                    const colors = ['bg-blue-500', 'bg-cyan-500', 'bg-teal-500', 'bg-green-500', 'bg-lime-500', 'bg-yellow-500', 'bg-emerald-500']

                    return (
                      <div key={step.step}>
                        <div className="relative rounded-lg overflow-hidden">
                          <div
                            className={`absolute inset-y-0 left-0 ${colors[index % colors.length]} opacity-20`}
                            style={{ width: `${widthPercent}%` }}
                          />
                          <div className="relative flex items-center justify-between p-3">
                            <div>
                              <p className={`font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>{step.step}</p>
                            </div>
                            <div className="flex items-center gap-4 text-right">
                              <div>
                                <p className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                                  {step.count.toLocaleString()}
                                </p>
                                <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                                  {step.percentage}% of started
                                </p>
                              </div>
                              {index > 0 && (
                                <div className={`text-sm ${step.dropoffFromPrevious > 30 ? 'text-red-500' : isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                  <span className="font-medium">{step.conversionFromPrevious}%</span>
                                  <p className="text-xs">from prev</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        {index < (onboardingData.steps || []).length - 1 && step.dropoffFromPrevious > 0 && (
                          <div className="flex items-center justify-center py-1">
                            <div className={`text-xs px-2 py-0.5 rounded ${
                              step.dropoffFromPrevious > 30
                                ? isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-600'
                                : isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'
                            }`}>
                              ↓ {step.dropoffFromPrevious}% dropoff
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>

              <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'} text-right`}>
                {onboardingData.cached && '(cached) '}
                GA4 data may have 24-48h delay
              </p>
            </>
          )}
          {onboardingData?.error && (
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <p className="text-red-500">Error: {onboardingData.error}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
