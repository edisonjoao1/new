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
} from 'lucide-react'
import RetentionCohorts from './RetentionCohorts'
import ConversionFunnel from './ConversionFunnel'
import ErrorTracking from './ErrorTracking'
import BehaviorInsights from './BehaviorInsights'
import AlertsPanel from './AlertsPanel'
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

type UserSegment = 'all' | 'today' | 'new' | 'power' | 'at_risk' | 'voice' | 'images'

interface User {
  id: string
  device_id: string
  locale: string
  device_model: string
  os_version: string
  app_version: string
  total_app_opens: number
  total_messages_sent: number
  total_images_generated: number
  total_voice_sessions: number
  total_session_seconds: number
  created_at: string | null
  last_active: string | null
  first_open_date: string | null
  last_open_date: string | null
  days_since_first_open: number
  voice_failure_count: number
  nsfw_attempt_count: number
  is_premium: boolean
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
    totalSessionHours: number
    avgMessagesPerUser: number
    avgImagesPerUser: number
    avgAppOpensPerUser: number
  }
  segmentCounts: Record<string, number>
  topLocales: { locale: string; count: number; percentage: number }[]
  topDevices: { device: string; count: number; percentage: number }[]
  timeline: { date: string; signups: number; active: number }[]
  retentionRate: { day1: number; day7: number }
}

// Segment definitions
const SEGMENTS: { id: UserSegment; label: string; icon: any; description: string; color: string }[] = [
  { id: 'all', label: 'All Users', icon: Users, description: 'All registered users', color: 'purple' },
  { id: 'today', label: 'Active Today', icon: Zap, description: 'Users active in last 24h', color: 'green' },
  { id: 'new', label: 'New Users', icon: UserPlus, description: 'Registered in last 7 days', color: 'blue' },
  { id: 'power', label: 'Power Users', icon: Crown, description: '50+ messages sent', color: 'yellow' },
  { id: 'at_risk', label: 'At Risk', icon: AlertTriangle, description: 'Inactive 7+ days', color: 'red' },
  { id: 'voice', label: 'Voice Users', icon: Mic, description: 'Used voice chat', color: 'pink' },
  { id: 'images', label: 'Image Creators', icon: Image, description: 'Generated images', color: 'indigo' },
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
    all: 0, today: 0, new: 0, power: 0, at_risk: 0, voice: 0, images: 0
  })

  // View mode
  const [viewMode, setViewMode] = useState<'dashboard' | 'users' | 'retention' | 'funnel' | 'insights' | 'errors' | 'alerts'>('dashboard')

  // Auto-refresh state
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  // Fetch dashboard stats
  const fetchDashboard = async (silent = false) => {
    if (!silent) setLoadingDashboard(true)
    try {
      const response = await fetch(`/api/analytics/users?key=${encodeURIComponent(analyticsKey)}&dashboard=true`)
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
    }
  }, [analyticsKey])

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
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, analyticsKey, page, sortBy, sortOrder, localeFilter, deviceFilter, activeSegment, dateFrom, dateTo, minMessages])

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
    const headers = ['Device ID', 'Locale', 'Device', 'OS', 'App Version', 'Messages', 'Images', 'Voice Sessions', 'App Opens', 'First Open', 'Last Active', 'Engagement Score']
    const rows = users.map(u => [
      u.device_id,
      u.locale,
      u.device_model,
      u.os_version,
      u.app_version,
      u.total_messages_sent,
      u.total_images_generated,
      u.total_voice_sessions,
      u.total_app_opens,
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
              { id: 'retention', label: 'Retention', icon: Target },
              { id: 'funnel', label: 'Funnel', icon: GitBranch },
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
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { label: 'Total Users', value: formatNumber(dashboard.overview.totalUsers), icon: Users, color: 'purple' },
              { label: 'Active Today', value: formatNumber(dashboard.overview.activeToday), icon: Zap, color: 'green' },
              { label: 'Active This Week', value: formatNumber(dashboard.overview.activeThisWeek), icon: TrendingUp, color: 'blue' },
              { label: 'App Opens', value: formatNumber(dashboard.overview.totalAppOpens), icon: Activity, color: 'cyan' },
              { label: 'Total Messages', value: formatNumber(dashboard.overview.totalMessages), icon: MessageSquare, color: 'indigo' },
              { label: 'Images Generated', value: formatNumber(dashboard.overview.totalImages), icon: Image, color: 'pink' },
              { label: 'Voice Sessions', value: formatNumber(dashboard.overview.totalVoiceSessions), icon: Mic, color: 'red' },
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
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Activity Timeline */}
            <div className={`p-6 rounded-xl ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
              <h3 className={`text-sm font-medium mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                Activity Timeline (Last 30 Days)
              </h3>
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
                      { key: 'device_id', label: 'User ID', icon: Users, hasInfo: false },
                      { key: 'locale', label: 'Locale', icon: Globe, hasInfo: false },
                      { key: 'device_model', label: 'Device', icon: Smartphone, hasInfo: false },
                      { key: 'total_messages_sent', label: 'Messages', icon: MessageSquare, hasInfo: false },
                      { key: 'total_images_generated', label: 'Images', icon: Image, hasInfo: false },
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
                                  <div>Messages: up to 40pts</div>
                                  <div>Conversations: up to 20pts</div>
                                  <div>Images: up to 15pts</div>
                                  <div>Voice: up to 15pts</div>
                                  <div>Session time: up to 10pts</div>
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
                      <td colSpan={10} className={`px-4 py-8 text-center ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
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
                            {user.is_premium && <Crown className="w-3 h-3 text-yellow-500" />}
                            <span className={`font-mono text-sm ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                              {user.device_id.substring(0, 12)}...
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                            isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {user.locale}
                          </span>
                        </td>
                        <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.device_model}
                        </td>
                        <td className={`px-4 py-3 text-sm font-medium ${isDark ? 'text-white' : 'text-gray-900'}`}>
                          {user.total_messages_sent.toLocaleString()}
                        </td>
                        <td className={`px-4 py-3 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          {user.total_images_generated}
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
    </div>
  )
}
