"use client"

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
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
  Filter,
  Download,
  Calendar,
  Minus,
  MonitorSmartphone,
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
  period: string
  allProperties: Array<{ id: string; name: string }>
  totalPropertiesDiscovered: number
  generatedAt: string
}

const COLORS = ['#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#E5E7EB', '#F3F4F6', '#F9FAFB']

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
      // Store in session
      sessionStorage.setItem('analytics_key', key)
    } catch (err) {
      setError('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }, [period])

  useEffect(() => {
    // Check if already authenticated in session
    const storedKey = sessionStorage.getItem('analytics_key')
    if (storedKey) {
      fetchData(storedKey)
    }
  }, [])

  // Auto-refresh every 60 seconds if enabled
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

  const TrendIndicator = ({ value, suffix = '%' }: { value: string; suffix?: string }) => {
    const num = parseFloat(value)
    if (num > 0) {
      return (
        <span className="flex items-center text-green-600 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          +{value}{suffix}
        </span>
      )
    } else if (num < 0) {
      return (
        <span className="flex items-center text-red-600 text-sm">
          <TrendingDown className="w-4 h-4 mr-1" />
          {value}{suffix}
        </span>
      )
    }
    return (
      <span className="flex items-center text-gray-500 text-sm">
        <Minus className="w-4 h-4 mr-1" />
        0{suffix}
      </span>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="bg-white text-black min-h-screen flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-light mb-2 tracking-tight">Analytics Dashboard</h1>
            <p className="text-gray-500 font-light">Enter your password to view analytics</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-black transition-colors font-light"
            />
            {error && (
              <p className="text-red-500 text-sm font-light">{error}</p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-light"
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
      <main className="bg-white text-black min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full" />
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
    },
    {
      label: 'WAU',
      value: data.totals.wau.toLocaleString(),
      icon: Activity,
      color: 'from-purple-500 to-pink-500',
      change: null,
    },
    {
      label: 'MAU',
      value: data.totals.mau.toLocaleString(),
      icon: TrendingUp,
      color: 'from-orange-500 to-yellow-500',
      change: null,
    },
    {
      label: 'Sessions',
      value: data.totals.totalSessions.toLocaleString(),
      icon: BarChart3,
      color: 'from-green-500 to-emerald-500',
      change: data.comparison.changes.sessions,
    },
    {
      label: 'Events',
      value: data.totals.totalEvents.toLocaleString(),
      icon: Zap,
      color: 'from-indigo-500 to-purple-500',
      change: data.comparison.changes.events,
    },
    {
      label: 'New Users',
      value: data.totals.totalNewUsers.toLocaleString(),
      icon: UserPlus,
      color: 'from-teal-500 to-cyan-500',
      change: data.comparison.changes.newUsers,
    },
  ]

  const selectedPropertyName = selectedProperty === 'all'
    ? 'All Apps'
    : data.allProperties.find(p => p.id === selectedProperty)?.name || 'All Apps'

  // Prepare bar chart data for top apps
  const topAppsData = data.properties.slice(0, 8).map(p => ({
    name: p.name.length > 15 ? p.name.substring(0, 15) + '...' : p.name,
    mau: p.mau,
    dau: p.dau,
  }))

  return (
    <main className="bg-gray-50 text-black min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        >
          <div>
            <div className="h-px w-16 bg-black mb-4" />
            <h1 className="text-4xl md:text-5xl font-light tracking-tight">App Analytics</h1>
            <p className="text-gray-500 font-light mt-2">
              Last updated: {new Date(data.generatedAt).toLocaleString()}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {/* Period Selector */}
            <div className="flex items-center bg-white border border-gray-200 rounded-full overflow-hidden">
              {['7d', '30d', '90d'].map((p) => (
                <button
                  key={p}
                  onClick={() => handlePeriodChange(p)}
                  className={`px-4 py-2 text-sm font-light transition-colors ${
                    period === p ? 'bg-black text-white' : 'hover:bg-gray-50'
                  }`}
                >
                  {p === '7d' ? '7 Days' : p === '30d' ? '30 Days' : '90 Days'}
                </button>
              ))}
            </div>

            {/* Property Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowPropertyDropdown(!showPropertyDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-full hover:border-black transition-colors font-light"
              >
                <Filter className="w-4 h-4" />
                <span className="max-w-[150px] truncate">{selectedPropertyName}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${showPropertyDropdown ? 'rotate-180' : ''}`} />
              </button>
              {showPropertyDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-80 overflow-y-auto">
                  <button
                    onClick={() => handlePropertyChange('all')}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors font-light ${selectedProperty === 'all' ? 'bg-gray-50' : ''}`}
                  >
                    All Apps
                  </button>
                  <div className="border-t border-gray-100" />
                  {data.allProperties.map((prop) => (
                    <button
                      key={prop.id}
                      onClick={() => handlePropertyChange(prop.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors font-light ${selectedProperty === prop.id ? 'bg-gray-50' : ''}`}
                    >
                      <div className="truncate">{prop.name}</div>
                      <div className="text-xs text-gray-400">{prop.id}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auto-refresh toggle */}
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded-full border transition-colors font-light text-sm ${
                autoRefresh
                  ? 'bg-green-50 border-green-200 text-green-700'
                  : 'bg-white border-gray-200 hover:border-black'
              }`}
            >
              {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh'}
            </button>

            {/* Export CSV */}
            <Button
              onClick={exportToCSV}
              variant="outline"
              className="rounded-full border-gray-200 hover:border-black"
            >
              <Download className="w-4 h-4 mr-2" />
              CSV
            </Button>

            <Button
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
              className="rounded-full border-gray-200 hover:border-black"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </motion.div>

        {/* Realtime Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-gray-500 font-light">Active users in last 30 minutes</span>
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
                        <span className="text-gray-600">{c.country}</span>
                        <span className="font-medium">{c.users}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Stats with Trend Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {statCards.map((stat) => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <div className={`w-10 h-10 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-light mb-1">{stat.value}</div>
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-light">{stat.label}</div>
                {stat.change && <TrendIndicator value={stat.change} />}
              </div>
            </div>
          ))}
        </motion.div>

        {/* User Activity Over Time Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8"
        >
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-light tracking-tight">User Activity Over Time</h2>
                <p className="text-sm text-gray-500 font-light">Active users per day</p>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Period</span>
                  <span className="font-medium">{data.totals.mau.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">vs prev</span>
                  <TrendIndicator value={data.comparison.changes.users} />
                </div>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data.timeSeries}>
                  <defs>
                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="displayDate"
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: '#9ca3af' }}
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    labelStyle={{ fontWeight: 500 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#000000"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorUsers)"
                    name="Active Users"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Two Column: Top Apps Bar Chart + Events Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid md:grid-cols-2 gap-8 mb-8"
        >
          {/* Top Apps Bar Chart */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-xl font-light tracking-tight mb-6">Top Apps by MAU</h2>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topAppsData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 12, fill: '#9ca3af' }} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    tick={{ fontSize: 11, fill: '#6b7280' }}
                    width={100}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="mau" fill="#000000" radius={[0, 4, 4, 0]} name="MAU" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Events Breakdown */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-light tracking-tight">Top Events</h2>
              <span className="text-sm text-gray-400">{period}</span>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {data.events.slice(0, 12).map((event, i) => {
                const maxCount = data.events[0]?.count || 1
                const percentage = (event.count / maxCount) * 100
                return (
                  <div key={event.eventName} className="flex items-center gap-3">
                    <span className="w-6 text-sm text-gray-400 font-light">{i + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-light text-sm truncate max-w-[200px]">{event.eventName}</span>
                        <span className="text-sm text-gray-600">{event.count.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-black to-gray-600 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Three Column Layout: Countries, Stickiness, Period Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid md:grid-cols-3 gap-8 mb-8"
        >
          {/* Countries */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Globe className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-light tracking-tight">Top Countries</h2>
            </div>
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
                        <span className="text-sm text-gray-600">{country.users.toLocaleString()}</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-black rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Stickiness Ratios */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h2 className="text-xl font-light mb-6 tracking-tight">Stickiness Ratios</h2>
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
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
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
          </div>

          {/* Period Comparison */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center gap-2 mb-6">
              <Calendar className="w-5 h-5 text-gray-500" />
              <h2 className="text-xl font-light tracking-tight">vs Previous Period</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Users', current: data.comparison.current.users, previous: data.comparison.previous.users, change: data.comparison.changes.users },
                { label: 'Sessions', current: data.comparison.current.sessions, previous: data.comparison.previous.sessions, change: data.comparison.changes.sessions },
                { label: 'Events', current: data.comparison.current.events, previous: data.comparison.previous.events, change: data.comparison.changes.events },
                { label: 'New Users', current: data.comparison.current.newUsers, previous: data.comparison.previous.newUsers, change: data.comparison.changes.newUsers },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
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
          </div>
        </motion.div>

        {/* Projects Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-light mb-4 tracking-tight">
            Active Apps ({data.properties.length})
          </h2>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">App</th>
                    <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">DAU</th>
                    <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">WAU</th>
                    <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">MAU</th>
                    <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Sessions</th>
                    <th className="text-right px-4 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">Events</th>
                    <th className="text-right px-6 py-4 text-xs uppercase tracking-wider text-gray-500 font-medium">DAU/MAU</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {data.properties.map((property) => (
                    <tr
                      key={property.id}
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handlePropertyChange(property.id)}
                    >
                      <td className="px-6 py-4">
                        <div className="font-light">{property.name}</div>
                        <div className="text-xs text-gray-400">{property.id}</div>
                      </td>
                      <td className="text-right px-4 py-4 font-light">{property.dau.toLocaleString()}</td>
                      <td className="text-right px-4 py-4 font-light">{property.wau.toLocaleString()}</td>
                      <td className="text-right px-4 py-4 font-light">{property.mau.toLocaleString()}</td>
                      <td className="text-right px-4 py-4 font-light text-gray-500">{property.sessions.toLocaleString()}</td>
                      <td className="text-right px-4 py-4 font-light text-gray-500">{property.events.toLocaleString()}</td>
                      <td className="text-right px-6 py-4">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          parseFloat(property.dauMau) >= 20
                            ? 'bg-green-100 text-green-700'
                            : parseFloat(property.dauMau) >= 10
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {property.dauMau}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>

        {/* Website Stats (Separate from app metrics) */}
        {data.website && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8"
          >
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <MonitorSmartphone className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-500 font-light">Website (not included in app totals)</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-lg font-light">{data.website.name}</div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-xl font-light">{data.website.users.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Users</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-light">{data.website.sessions.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-light">{data.website.pageViews.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">Page Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-light">{data.website.newUsers.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">New Users</div>
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
          className="text-center mt-12 text-sm text-gray-400 font-light"
        >
          Data from Google Analytics 4 &bull; {data.totalPropertiesDiscovered} properties auto-discovered &bull; Click row to filter &bull; {autoRefresh ? 'Auto-refreshing every 60s' : 'Manual refresh'}
        </motion.div>
      </div>
    </main>
  )
}
