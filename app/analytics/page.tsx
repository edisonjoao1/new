"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  TrendingUp,
  TrendingDown,
  Activity,
  Eye,
  Zap,
  RefreshCw,
  Lock,
  BarChart3,
  UserPlus,
  Globe,
  Radio,
  ChevronDown,
  ChevronUp,
  Filter,
  Download,
  Calendar,
  Minus,
  MonitorSmartphone,
  Sun,
  Moon,
  Star,
  Search,
  DollarSign,
  Smartphone,
  Monitor,
  Tablet,
  Share2,
  Target,
  Repeat,
  Bell,
  BellOff,
  X,
  Check,
  ArrowRight,
  GitCompare,
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
  PieChart,
  Pie,
  LineChart,
  Line,
  FunnelChart,
  Funnel,
  LabelList,
} from 'recharts'

interface AnalyticsData {
  totals: {
    dau: number
    wau: number
    mau: number
    totalSessions: number
    totalPageViews: number
    totalEvents: number
    totalNewUsers: number
  }
  ratios: {
    dauMau: string
    wauMau: string
    dauWau: string
  }
  properties: Array<{
    id: string
    name: string
    dau: number
    wau: number
    mau: number
    sessions: number
    pageViews: number
    events: number
    newUsers: number
    dauMau: string
  }>
  timeSeries: Array<{
    date: string
    displayDate: string
    users: number
  }>
  realtime: {
    activeUsers: number
    topCountries: Array<{ country: string; users: number }>
  }
  countries: Array<{ country: string; users: number }>
  events: Array<{ eventName: string; count: number }>
  comparison: {
    current: { users: number; sessions: number; events: number; newUsers: number }
    previous: { users: number; sessions: number; events: number; newUsers: number }
    changes: { users: string; sessions: string; events: string; newUsers: string }
  }
  website: {
    id: string
    name: string
    sessions: number
    pageViews: number
    users: number
    newUsers: number
  } | null
  retention: {
    d1: string
    d7: string
    d30: string
  }
  trafficSources: Array<{ source: string; sessions: number }>
  devices: {
    devices: Array<{ device: string; users: number }>
    platforms: Array<{ platform: string; users: number }>
  }
  revenue: {
    totalRevenue: number
    purchaseCount: number
    avgOrderValue: number
    timeSeries: Array<{ date: string; displayDate: string; revenue: number }>
  }
  funnel: Array<{
    name: string
    event: string
    count: number
    rate: number
    dropoff: number
  }>
  period: string
  allProperties: Array<{ id: string; name: string }>
  totalPropertiesDiscovered: number
  generatedAt: string
}

const COLORS = ['#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6', '#F9FAFB']
const CHART_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

// Mini sparkline component
const Sparkline = ({ data, color = '#000' }: { data: number[]; color?: string }) => {
  if (!data || data.length < 2) return null
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const width = 60
  const height = 20
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((v - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  return (
    <svg width={width} height={height} className="inline-block ml-2">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

// Collapsible section component
const CollapsibleSection = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
  badge,
}: {
  title: string
  icon: any
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: string | number
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
          <h2 className="text-xl font-light tracking-tight dark:text-white">{title}</h2>
          {badge !== undefined && (
            <span className="px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
              {badge}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-400" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-400" />
        )}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AnalyticsPage() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedProperty, setSelectedProperty] = useState<string>('all')
  const [showPropertyDropdown, setShowPropertyDropdown] = useState(false)
  const [period, setPeriod] = useState<string>('30d')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])
  const [showAlerts, setShowAlerts] = useState(false)
  const [alerts, setAlerts] = useState<Array<{ metric: string; threshold: number; enabled: boolean }>>([
    { metric: 'DAU', threshold: 100, enabled: false },
    { metric: 'Revenue', threshold: 1000, enabled: false },
  ])
  const [compareMode, setCompareMode] = useState(false)
  const [compareProperties, setCompareProperties] = useState<string[]>([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [customDateRange, setCustomDateRange] = useState({ start: '', end: '' })

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('analytics_favorites')
    if (stored) {
      setFavorites(JSON.parse(stored))
    }
    const storedDarkMode = localStorage.getItem('analytics_dark_mode')
    if (storedDarkMode) {
      setDarkMode(JSON.parse(storedDarkMode))
    }
  }, [])

  // Apply dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('analytics_dark_mode', JSON.stringify(darkMode))
  }, [darkMode])

  // Save favorites
  const toggleFavorite = (propertyId: string) => {
    const newFavorites = favorites.includes(propertyId)
      ? favorites.filter(f => f !== propertyId)
      : [...favorites, propertyId]
    setFavorites(newFavorites)
    localStorage.setItem('analytics_favorites', JSON.stringify(newFavorites))
  }

  const fetchData = useCallback(async (key: string, property?: string, periodParam?: string) => {
    setLoading(true)
    setError('')
    try {
      const propertyQuery = property && property !== 'all' ? `&property=${property}` : ''
      const periodQuery = `&period=${periodParam || period}`
      const res = await fetch(`/api/analytics?key=${encodeURIComponent(key)}${propertyQuery}${periodQuery}`)
      if (res.status === 401) {
        setError('Invalid password')
        setIsAuthenticated(false)
        return
      }
      if (!res.ok) throw new Error('Failed to fetch')
      const json = await res.json()
      setData(json)
      setIsAuthenticated(true)
      sessionStorage.setItem('analytics_key', key)

      // Check alerts
      if (alerts.some(a => a.enabled)) {
        checkAlerts(json)
      }
    } catch (err) {
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }, [period, alerts])

  const checkAlerts = (data: AnalyticsData) => {
    alerts.forEach(alert => {
      if (!alert.enabled) return
      if (alert.metric === 'DAU' && data.totals.dau < alert.threshold) {
        if (Notification.permission === 'granted') {
          new Notification('Analytics Alert', {
            body: `DAU (${data.totals.dau}) is below threshold (${alert.threshold})`,
          })
        }
      }
      if (alert.metric === 'Revenue' && data.revenue.totalRevenue < alert.threshold) {
        if (Notification.permission === 'granted') {
          new Notification('Analytics Alert', {
            body: `Revenue ($${data.revenue.totalRevenue}) is below threshold ($${alert.threshold})`,
          })
        }
      }
    })
  }

  useEffect(() => {
    const storedKey = sessionStorage.getItem('analytics_key')
    if (storedKey) {
      fetchData(storedKey)
    }
  }, [])

  useEffect(() => {
    if (!autoRefresh || !isAuthenticated) return
    const storedKey = sessionStorage.getItem('analytics_key')
    if (!storedKey) return

    const interval = setInterval(() => {
      fetchData(storedKey, selectedProperty, period)
    }, 60000)

    return () => clearInterval(interval)
  }, [autoRefresh, isAuthenticated, selectedProperty, period, fetchData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    fetchData(password)
  }

  const handleRefresh = () => {
    const storedKey = sessionStorage.getItem('analytics_key')
    if (storedKey) {
      fetchData(storedKey, selectedProperty, period)
    }
  }

  const handlePropertyChange = (propertyId: string) => {
    setSelectedProperty(propertyId)
    setShowPropertyDropdown(false)
    const storedKey = sessionStorage.getItem('analytics_key')
    if (storedKey) {
      fetchData(storedKey, propertyId, period)
    }
  }

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod)
    const storedKey = sessionStorage.getItem('analytics_key')
    if (storedKey) {
      fetchData(storedKey, selectedProperty, newPeriod)
    }
  }

  const toggleCompareProperty = (propertyId: string) => {
    if (compareProperties.includes(propertyId)) {
      setCompareProperties(compareProperties.filter(p => p !== propertyId))
    } else if (compareProperties.length < 3) {
      setCompareProperties([...compareProperties, propertyId])
    }
  }

  const exportToCSV = () => {
    if (!data) return

    const headers = ['Project', 'DAU', 'WAU', 'MAU', 'Sessions', 'Page Views', 'Events', 'New Users', 'DAU/MAU']
    const rows = data.properties.map(p => [
      p.name,
      p.dau,
      p.wau,
      p.mau,
      p.sessions,
      p.pageViews,
      p.events,
      p.newUsers,
      `${p.dauMau}%`
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${period}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission()
      if (permission === 'granted') {
        setShowAlerts(true)
      }
    }
  }

  const TrendIndicator = ({ value, suffix = '%' }: { value: string; suffix?: string }) => {
    const num = parseFloat(value)
    if (num > 0) {
      return (
        <span className="flex items-center text-green-600 dark:text-green-400 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          +{value}{suffix}
        </span>
      )
    } else if (num < 0) {
      return (
        <span className="flex items-center text-red-600 dark:text-red-400 text-sm">
          <TrendingDown className="w-4 h-4 mr-1" />
          {value}{suffix}
        </span>
      )
    }
    return (
      <span className="flex items-center text-gray-500 dark:text-gray-400 text-sm">
        <Minus className="w-4 h-4 mr-1" />
        0{suffix}
      </span>
    )
  }

  // Filter properties based on search
  const filteredProperties = useMemo(() => {
    if (!data) return []
    let props = data.properties

    // Sort favorites to top
    props = [...props].sort((a, b) => {
      const aFav = favorites.includes(a.id) ? 0 : 1
      const bFav = favorites.includes(b.id) ? 0 : 1
      return aFav - bFav
    })

    // Filter by search
    if (searchQuery) {
      props = props.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.includes(searchQuery)
      )
    }

    return props
  }, [data, searchQuery, favorites])

  // Get sparkline data from timeSeries
  const sparklineData = useMemo(() => {
    if (!data?.timeSeries) return []
    return data.timeSeries.slice(-7).map(d => d.users)
  }, [data?.timeSeries])

  if (!isAuthenticated) {
    return (
      <main className={`${darkMode ? 'dark' : ''} bg-white dark:bg-gray-950 text-black dark:text-white min-h-screen flex items-center justify-center px-6`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-white dark:text-black" />
            </div>
            <h1 className="text-3xl font-light mb-2 tracking-tight">Analytics Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 font-light">Enter your password to view analytics</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:border-black dark:focus:border-white transition-colors font-light bg-white dark:bg-gray-900"
            />
            {error && (
              <p className="text-red-500 text-sm font-light">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-200 text-white dark:text-black py-3 rounded-xl font-light"
            >
              {loading ? 'Loading...' : 'View Analytics'}
            </Button>
          </form>
        </motion.div>
      </main>
    )
  }

  if (!data) {
    return (
      <main className={`${darkMode ? 'dark' : ''} bg-white dark:bg-gray-950 text-black dark:text-white min-h-screen flex items-center justify-center`}>
        <div className="animate-spin w-8 h-8 border-2 border-black dark:border-white border-t-transparent rounded-full" />
      </main>
    )
  }

  const statCards = [
    {
      label: 'DAU',
      value: data.totals.dau.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      change: data.comparison.changes.users,
      sparkline: sparklineData,
    },
    {
      label: 'WAU',
      value: data.totals.wau.toLocaleString(),
      icon: Activity,
      color: 'from-purple-500 to-pink-500',
      change: null,
      sparkline: null,
    },
    {
      label: 'MAU',
      value: data.totals.mau.toLocaleString(),
      icon: TrendingUp,
      color: 'from-orange-500 to-yellow-500',
      change: null,
      sparkline: null,
    },
    {
      label: 'Sessions',
      value: data.totals.totalSessions.toLocaleString(),
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      change: data.comparison.changes.sessions,
      sparkline: null,
    },
    {
      label: 'New Users',
      value: data.totals.totalNewUsers.toLocaleString(),
      icon: UserPlus,
      color: 'from-teal-500 to-cyan-500',
      change: data.comparison.changes.newUsers,
      sparkline: null,
    },
  ]

  const selectedPropertyName = selectedProperty === 'all'
    ? 'All Apps'
    : data.allProperties.find(p => p.id === selectedProperty)?.name || 'All Apps'

  const topAppsData = data.properties.slice(0, 8).map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    mau: p.mau,
    dau: p.dau,
  }))

  // Properties for comparison
  const comparisonProperties = compareMode && compareProperties.length > 0
    ? data.properties.filter(p => compareProperties.includes(p.id))
    : []

  const deviceIcons: { [key: string]: any } = {
    mobile: Smartphone,
    desktop: Monitor,
    tablet: Tablet,
  }

  return (
    <main className={`${darkMode ? 'dark' : ''} bg-gray-50 dark:bg-gray-950 text-black dark:text-white min-h-screen py-12 px-6 transition-colors`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        >
          <div>
            <div className="h-px w-16 bg-black dark:bg-white mb-4" />
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">App Analytics</h1>
            <p className="text-gray-500 dark:text-gray-400 font-light mt-2">
              Last updated: {new Date(data.generatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Alerts Toggle */}
            <button
              onClick={() => showAlerts ? setShowAlerts(false) : requestNotificationPermission()}
              className={`p-2 rounded-full border transition-colors ${
                showAlerts
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-600'
                  : 'border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white'
              }`}
            >
              {showAlerts ? <Bell className="w-5 h-5" /> : <BellOff className="w-5 h-5" />}
            </button>

            {/* Compare Mode Toggle */}
            <button
              onClick={() => {
                setCompareMode(!compareMode)
                if (!compareMode) setCompareProperties([])
              }}
              className={`px-4 py-2 rounded-full border transition-colors font-light text-sm flex items-center gap-2 ${
                compareMode
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-600'
                  : 'border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white bg-white dark:bg-gray-900'
              }`}
            >
              <GitCompare className="w-4 h-4" />
              Compare
            </button>

            {/* Period Selector */}
            <div className="flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full overflow-hidden">
              {['7d', '30d', '90d'].map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`px-4 py-2 text-sm font-light transition-colors ${
                    period === p
                      ? 'bg-black dark:bg-white text-white dark:text-black'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>

            {/* Custom Date Picker */}
            <div className="relative">
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className="p-2 rounded-full border border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white transition-colors bg-white dark:bg-gray-900"
              >
                <Calendar className="w-5 h-5" />
              </button>
              {showDatePicker && (
                <div className="absolute right-0 mt-2 p-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 w-72">
                  <h3 className="font-medium mb-3 dark:text-white">Custom Date Range</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">Start Date</label>
                      <input
                        type="date"
                        value={customDateRange.start}
                        onChange={(e) => setCustomDateRange({ ...customDateRange, start: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-500 dark:text-gray-400">End Date</label>
                      <input
                        type="date"
                        value={customDateRange.end}
                        onChange={(e) => setCustomDateRange({ ...customDateRange, end: e.target.value })}
                        className="w-full mt-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800"
                      />
                    </div>
                    <Button
                      onClick={() => setShowDatePicker(false)}
                      className="w-full bg-black dark:bg-white text-white dark:text-black rounded-lg"
                      size="sm"
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Property Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full hover:border-black dark:hover:border-white transition-colors font-light"
              >
                <Filter className="w-4 h-4" />
                <span className="max-w-[150px] truncate">{selectedPropertyName}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showPropertyDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showPropertyDropdown && (
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50 max-h-96 overflow-hidden">
                  {/* Search */}
                  <div className="p-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 focus:outline-none focus:border-black dark:focus:border-white"
                      />
                    </div>
                  </div>
                  <div className="overflow-y-auto max-h-72">
                    <button
                      onClick={() => handlePropertyChange('all')}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-light ${selectedProperty === 'all' ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                    >
                      All Apps
                    </button>
                    <div className="border-t border-gray-100 dark:border-gray-800" />
                    {filteredProperties.length > 0 ? (
                      filteredProperties.map((prop) => (
                        <div
                          key={prop.id}
                          className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${selectedProperty === prop.id ? 'bg-gray-50 dark:bg-gray-800' : ''}`}
                        >
                          <button
                            onClick={() => handlePropertyChange(prop.id)}
                            className="flex-1 text-left font-light"
                          >
                            <div className="flex items-center gap-2">
                              {favorites.includes(prop.id) && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                              <span className="truncate">{prop.name}</span>
                            </div>
                            <div className="text-xs text-gray-400">{prop.id}</div>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleFavorite(prop.id)
                            }}
                            className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                          >
                            <Star className={`w-4 h-4 ${favorites.includes(prop.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center text-gray-400 text-sm">
                        No properties found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-full border transition-colors font-light text-sm ${
                autoRefresh
                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400'
                  : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white'
              }`}
            >
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh'}
            </button>

            {/* Export CSV */}
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="rounded-full border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white dark:bg-gray-900"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>

            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              className="rounded-full border-gray-200 dark:border-gray-700 hover:border-black dark:hover:border-white dark:bg-gray-900"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Alerts Panel */}
        <AnimatePresence>
          {showAlerts && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium flex items-center gap-2">
                    <Bell className="w-5 h-5 text-yellow-600" />
                    Alert Settings
                  </h3>
                  <button onClick={() => setShowAlerts(false)}>
                    <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                  </button>
                </div>
                <div className="space-y-3">
                  {alerts.map((alert, i) => (
                    <div key={alert.metric} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            const newAlerts = [...alerts]
                            newAlerts[i].enabled = !newAlerts[i].enabled
                            setAlerts(newAlerts)
                          }}
                          className={`w-10 h-6 rounded-full transition-colors ${
                            alert.enabled ? 'bg-yellow-500' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        >
                          <div className={`w-4 h-4 bg-white rounded-full transition-transform ml-1 ${
                            alert.enabled ? 'translate-x-4' : ''
                          }`} />
                        </button>
                        <span className="font-light">{alert.metric} drops below</span>
                      </div>
                      <input
                        type="number"
                        value={alert.threshold}
                        onChange={(e) => {
                          const newAlerts = [...alerts]
                          newAlerts[i].threshold = parseInt(e.target.value) || 0
                          setAlerts(newAlerts)
                        }}
                        className="w-24 px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm bg-white dark:bg-gray-800"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Compare Mode Panel */}
        <AnimatePresence>
          {compareMode && compareProperties.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  <GitCompare className="w-5 h-5 text-blue-600" />
                  Property Comparison
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-sm text-gray-500 dark:text-gray-400">
                        <th className="pb-3">Property</th>
                        <th className="pb-3 text-right">DAU</th>
                        <th className="pb-3 text-right">WAU</th>
                        <th className="pb-3 text-right">MAU</th>
                        <th className="pb-3 text-right">Sessions</th>
                        <th className="pb-3 text-right">DAU/MAU</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparisonProperties.map((prop, i) => (
                        <tr key={prop.id} className="border-t border-blue-100 dark:border-blue-800">
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[i] }} />
                              {prop.name}
                            </div>
                          </td>
                          <td className="py-3 text-right font-medium">{prop.dau.toLocaleString()}</td>
                          <td className="py-3 text-right font-medium">{prop.wau.toLocaleString()}</td>
                          <td className="py-3 text-right font-medium">{prop.mau.toLocaleString()}</td>
                          <td className="py-3 text-right">{prop.sessions.toLocaleString()}</td>
                          <td className="py-3 text-right">
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                              parseFloat(prop.dauMau) >= 20 ? 'bg-green-100 text-green-700' :
                              parseFloat(prop.dauMau) >= 10 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                            }`}>
                              {prop.dauMau}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Realtime Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-500 dark:text-gray-400 font-light">Active users in last 30 minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-light">{data.realtime.activeUsers}</div>
                <Radio className="w-6 h-6 text-green-500" />
              </div>
              {data.realtime.topCountries.length > 0 && (
                <div className="text-right">
                  <div className="text-xs text-gray-400 uppercase tracking-wider mb-2">Top Countries (Realtime)</div>
                  <div className="space-y-1">
                    {data.realtime.topCountries.slice(0, 3).map((c) => (
                      <div key={c.country} className="flex items-center justify-end gap-2 text-sm">
                        <span className="text-gray-600 dark:text-gray-400">{c.country}</span>
                        <span className="font-medium">{c.users}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Stats with Sparklines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8"
        >
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700 transition-colors"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="flex items-center">
                <div className="text-2xl md:text-3xl font-light">{stat.value}</div>
                {stat.sparkline && <Sparkline data={stat.sparkline} />}
              </div>
              <div className="flex items-center justify-between mt-1">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider font-light">{stat.label}</div>
                {stat.change && <TrendIndicator value={stat.change} />}
              </div>
            </div>
          ))}
        </motion.div>

        {/* User Activity Chart */}
        <CollapsibleSection title="User Activity Over Time" icon={Activity} defaultOpen={true}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-light">Active users per day</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">Period</span>
                <span className="font-medium">{data.totals.mau.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-500 dark:text-gray-400">vs prev</span>
                <TrendIndicator value={data.comparison.changes.users} />
              </div>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.timeSeries}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={darkMode ? '#fff' : '#000'} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={darkMode ? '#fff' : '#000'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} />
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                  tickLine={false}
                  axisLine={{ stroke: darkMode ? '#374151' : '#e5e7eb' }}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                  tickLine={false}
                  axisLine={{ stroke: darkMode ? '#374151' : '#e5e7eb' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : 'white',
                    border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  labelStyle={{ fontWeight: 500 }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  stroke={darkMode ? '#fff' : '#000'}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorUsers)"
                  name="Active Users"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CollapsibleSection>

        <div className="h-8" />

        {/* Top Apps by MAU - Full Width */}
        <CollapsibleSection title="Top Apps by MAU" icon={BarChart3} defaultOpen={true}>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topAppsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#374151' : '#f0f0f0'} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: darkMode ? '#9ca3af' : '#6b7280' }} />
                <YAxis
                  dataKey="name"
                  type="category"
                  tick={{ fontSize: 11, fill: darkMode ? '#9ca3af' : '#6b7280' }}
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1f2937' : 'white',
                    border: `1px solid ${darkMode ? '#374151' : '#e5e7eb'}`,
                    borderRadius: '12px',
                  }}
                />
                <Bar dataKey="mau" fill={darkMode ? '#fff' : '#000'} radius={[0, 4, 4, 0]} name="MAU" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CollapsibleSection>

        <div className="h-8" />

        {/* Three Column: Traffic Sources, Devices, Countries */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <CollapsibleSection title="Traffic Sources" icon={Share2} defaultOpen={true}>
            <div className="space-y-3">
              {data.trafficSources.slice(0, 8).map((source, i) => {
                const maxSessions = data.trafficSources[0]?.sessions || 1
                const percentage = (source.sessions / maxSessions) * 100
                return (
                  <div key={source.source} className="flex items-center gap-3">
                    <span className="w-6 text-sm text-gray-400 font-light">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-light text-sm truncate">{source.source || '(direct)'}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{source.sessions.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Devices & Platforms" icon={MonitorSmartphone} defaultOpen={true}>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Device Type</div>
                <div className="flex gap-4">
                  {data.devices.devices.map((device) => {
                    const Icon = deviceIcons[device.device.toLowerCase()] || Monitor
                    const total = data.devices.devices.reduce((sum, d) => sum + d.users, 0)
                    const percentage = total > 0 ? ((device.users / total) * 100).toFixed(0) : 0
                    return (
                      <div key={device.device} className="flex-1 text-center p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <Icon className="w-5 h-5 mx-auto mb-2 text-gray-500 dark:text-gray-400" />
                        <div className="font-medium">{percentage}%</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 capitalize">{device.device}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Platform</div>
                <div className="space-y-2">
                  {data.devices.platforms.slice(0, 5).map((platform) => {
                    const total = data.devices.platforms.reduce((sum, p) => sum + p.users, 0)
                    const percentage = total > 0 ? (platform.users / total) * 100 : 0
                    return (
                      <div key={platform.platform} className="flex items-center justify-between">
                        <span className="text-sm font-light">{platform.platform}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-black dark:bg-white rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">{percentage.toFixed(0)}%</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Top Countries" icon={Globe} defaultOpen={true}>
            <div className="space-y-3">
              {data.countries.slice(0, 8).map((country, i) => {
                const maxUsers = data.countries[0]?.users || 1
                const percentage = (country.users / maxUsers) * 100
                return (
                  <div key={country.country} className="flex items-center gap-3">
                    <span className="w-6 text-sm text-gray-400 font-light">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-light text-sm">{country.country}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">{country.users.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CollapsibleSection>
        </div>

        {/* Stickiness & Period Comparison */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <CollapsibleSection title="Stickiness Ratios" icon={Target} defaultOpen={true}>
            <div className="space-y-6">
              {[
                { label: 'DAU/MAU', value: data.ratios.dauMau, description: 'Daily engagement', benchmark: '20%+ excellent' },
                { label: 'WAU/MAU', value: data.ratios.wauMau, description: 'Weekly engagement', benchmark: '50%+ excellent' },
                { label: 'DAU/WAU', value: data.ratios.dauWau, description: 'Daily-to-weekly', benchmark: '30%+ typical' },
              ].map((ratio) => (
                <div key={ratio.label}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="font-light">{ratio.label}</span>
                      <p className="text-xs text-gray-400">{ratio.description}</p>
                    </div>
                    <span className="text-2xl font-light">{ratio.value}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        parseFloat(ratio.value) >= 20 ? 'bg-green-500' :
                        parseFloat(ratio.value) >= 10 ? 'bg-yellow-500' : 'bg-gray-400'
                      }`}
                      style={{ width: `${Math.min(parseFloat(ratio.value), 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{ratio.benchmark}</p>
                </div>
              ))}
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="vs Previous Period" icon={Calendar} defaultOpen={true}>
            <div className="space-y-4">
              {[
                { label: 'Users', current: data.comparison.current.users, previous: data.comparison.previous.users, change: data.comparison.changes.users },
                { label: 'Sessions', current: data.comparison.current.sessions, previous: data.comparison.previous.sessions, change: data.comparison.changes.sessions },
                { label: 'New Users', current: data.comparison.current.newUsers, previous: data.comparison.previous.newUsers, change: data.comparison.changes.newUsers },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 dark:border-gray-800 last:border-0">
                  <div>
                    <div className="font-light">{item.label}</div>
                    <div className="text-xs text-gray-400">
                      {item.current.toLocaleString()} vs {item.previous.toLocaleString()}
                    </div>
                  </div>
                  <TrendIndicator value={item.change} />
                </div>
              ))}
            </div>
          </CollapsibleSection>
        </div>

        {/* Projects Table */}
        <CollapsibleSection title={`Active Apps (${data.properties.length})`} icon={BarChart3} defaultOpen={true}>
          <div className="overflow-x-auto -mx-6">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  {compareMode && <th className="w-12 px-4 py-4"></th>}
                  <th className="w-8 px-2 py-4"></th>
                  <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">App</th>
                  <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">DAU</th>
                  <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">WAU</th>
                  <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">MAU</th>
                  <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">Sessions</th>
                  <th className="text-right px-6 py-4 text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-medium">DAU/MAU</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filteredProperties.map((property) => (
                  <tr
                    key={property.id}
                    className={`hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      compareMode && compareProperties.includes(property.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    {compareMode && (
                      <td className="px-4 py-4">
                        <button
                          onClick={() => toggleCompareProperty(property.id)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                            compareProperties.includes(property.id)
                              ? 'bg-blue-500 border-blue-500 text-white'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}
                        >
                          {compareProperties.includes(property.id) && <Check className="w-3 h-3" />}
                        </button>
                      </td>
                    )}
                    <td className="px-2 py-4">
                      <button
                        onClick={() => toggleFavorite(property.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Star className={`w-4 h-4 ${favorites.includes(property.id) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 dark:text-gray-600'}`} />
                      </button>
                    </td>
                    <td
                      className="px-6 py-4 cursor-pointer"
                      onClick={() => handlePropertyChange(property.id)}
                    >
                      <div className="font-light">{property.name}</div>
                      <div className="text-xs text-gray-400">{property.id}</div>
                    </td>
                    <td className="text-right px-4 py-4 font-light">{property.dau.toLocaleString()}</td>
                    <td className="text-right px-4 py-4 font-light">{property.wau.toLocaleString()}</td>
                    <td className="text-right px-4 py-4 font-light">{property.mau.toLocaleString()}</td>
                    <td className="text-right px-4 py-4 font-light text-gray-500 dark:text-gray-400">{property.sessions.toLocaleString()}</td>
                    <td className="text-right px-6 py-4">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        parseFloat(property.dauMau) >= 20
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                          : parseFloat(property.dauMau) >= 10
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}>
                        {property.dauMau}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CollapsibleSection>

        {/* Website Stats */}
        {data.website && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-br from-gray-50 dark:from-gray-900 to-white dark:to-gray-950 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MonitorSmartphone className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                <span className="text-sm text-gray-500 dark:text-gray-400 font-light">Website (not included in app totals)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-light">{data.website.name}</div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-xl font-light">{data.website.users.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-light">{data.website.sessions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-light">{data.website.pageViews.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Page Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-light">{data.website.newUsers.toLocaleString()}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">New Users</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 text-sm text-gray-400 dark:text-gray-500 font-light"
        >
          Data from Google Analytics 4 &bull; {data.totalPropertiesDiscovered} properties auto-discovered &bull; Click row to filter &bull; {autoRefresh ? 'Auto-refreshing every 60s' : 'Manual refresh'}
        </motion.div>
      </div>
    </main>
  )
}
