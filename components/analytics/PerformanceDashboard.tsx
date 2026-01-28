'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Activity, Mic, Image, AlertTriangle, Users, TrendingUp, TrendingDown, Clock } from 'lucide-react'

interface PerformanceMetrics {
  responseTime: {
    average: number
    p50: number
    p90: number
    p99: number
    slowCount: number
    verySlowCount: number
  }
  voice: {
    connectionSuccessRate: number
    avgSessionDuration: number
    reconnectRate: number
    totalSessions: number
    successfulSessions: number
    failedSessions: number
  }
  images: {
    successRate: number
    totalGenerated: number
    totalFailed: number
    avgPerUser: number
  }
  errors: {
    totalErrors: number
    errorRate: number
    topErrorTypes: { type: string; count: number }[]
  }
  engagement: {
    avgMessagesPerUser: number
    avgSessionsPerUser: number
    activeUserRate: number
  }
  timeline: {
    date: string
    responseTime: number
    errorRate: number
    voiceSuccessRate: number
  }[]
  generatedAt: string
  cached: boolean
}

interface Props {
  analyticsKey: string
}

export default function PerformanceDashboard({ analyticsKey }: Props) {
  const [data, setData] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPerformance() {
      try {
        const res = await fetch(`/api/analytics/performance?key=${analyticsKey}`)
        if (!res.ok) throw new Error('Failed to fetch performance data')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchPerformance()
  }, [analyticsKey])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-red-500">Error: {error}</p>
      </div>
    )
  }

  if (!data) return null

  const getStatusColor = (rate: number, isSuccess = true) => {
    if (isSuccess) {
      if (rate >= 90) return 'text-green-600 dark:text-green-400'
      if (rate >= 70) return 'text-yellow-600 dark:text-yellow-400'
      return 'text-red-600 dark:text-red-400'
    } else {
      if (rate <= 5) return 'text-green-600 dark:text-green-400'
      if (rate <= 15) return 'text-yellow-600 dark:text-yellow-400'
      return 'text-red-600 dark:text-red-400'
    }
  }

  const getStatusBg = (rate: number, isSuccess = true) => {
    if (isSuccess) {
      if (rate >= 90) return 'bg-green-50 dark:bg-green-900/20'
      if (rate >= 70) return 'bg-yellow-50 dark:bg-yellow-900/20'
      return 'bg-red-50 dark:bg-red-900/20'
    } else {
      if (rate <= 5) return 'bg-green-50 dark:bg-green-900/20'
      if (rate <= 15) return 'bg-yellow-50 dark:bg-yellow-900/20'
      return 'bg-red-50 dark:bg-red-900/20'
    }
  }

  const formatDuration = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Performance Dashboard
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Real-time app performance metrics</p>
          </div>
          {data.cached && (
            <span className="text-xs text-gray-400">(cached)</span>
          )}
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Voice Success Rate */}
          <div className={`rounded-lg p-4 ${getStatusBg(data.voice.connectionSuccessRate)}`}>
            <div className="flex items-center gap-2 mb-1">
              <Mic className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Voice Success</span>
            </div>
            <p className={`text-2xl font-bold ${getStatusColor(data.voice.connectionSuccessRate)}`}>
              {data.voice.connectionSuccessRate}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {data.voice.successfulSessions}/{data.voice.totalSessions} sessions
            </p>
          </div>

          {/* Image Success Rate */}
          <div className={`rounded-lg p-4 ${getStatusBg(data.images.successRate)}`}>
            <div className="flex items-center gap-2 mb-1">
              <Image className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Image Success</span>
            </div>
            <p className={`text-2xl font-bold ${getStatusColor(data.images.successRate)}`}>
              {data.images.successRate}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {data.images.totalGenerated - data.images.totalFailed}/{data.images.totalGenerated} images
            </p>
          </div>

          {/* Error Rate */}
          <div className={`rounded-lg p-4 ${getStatusBg(data.errors.errorRate, false)}`}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
            </div>
            <p className={`text-2xl font-bold ${getStatusColor(data.errors.errorRate, false)}`}>
              {data.errors.errorRate}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {data.errors.totalErrors} total errors
            </p>
          </div>

          {/* Active User Rate */}
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Active Users</span>
            </div>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {data.engagement.activeUserRate}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {data.engagement.avgMessagesPerUser} msgs/user avg
            </p>
          </div>
        </div>
      </div>

      {/* Voice Performance Detail */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Mic className="w-4 h-4" />
          Voice Performance
        </h4>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.voice.totalSessions}</p>
            <p className="text-xs text-gray-500">Total Sessions</p>
          </div>
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{data.voice.successfulSessions}</p>
            <p className="text-xs text-gray-500">Successful</p>
          </div>
          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{data.voice.failedSessions}</p>
            <p className="text-xs text-gray-500">Failed</p>
          </div>
          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{data.voice.reconnectRate}%</p>
            <p className="text-xs text-gray-500">Reconnect Rate</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-300">
            Average Session Duration: <strong>{formatDuration(data.voice.avgSessionDuration)}</strong>
          </span>
        </div>
      </div>

      {/* Timeline Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4">
          Voice Success Rate Over Time
        </h4>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.timeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10 }}
                stroke="#9CA3AF"
                tickFormatter={(val) => val.slice(5)}
              />
              <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB',
                }}
                formatter={(value) => [`${value}%`, 'Success Rate']}
              />
              <Area
                type="monotone"
                dataKey="voiceSuccessRate"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Error Types */}
      {data.errors.topErrorTypes.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Top Error Types
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.errors.topErrorTypes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis type="number" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <YAxis
                  type="category"
                  dataKey="type"
                  tick={{ fontSize: 10 }}
                  stroke="#9CA3AF"
                  width={120}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                  }}
                />
                <Bar dataKey="count" fill="#EF4444" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Engagement Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h4 className="text-md font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          Engagement Metrics
        </h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.engagement.avgMessagesPerUser}</p>
            <p className="text-sm text-gray-500">Messages/User</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.engagement.avgSessionsPerUser}</p>
            <p className="text-sm text-gray-500">Voice Sessions/User</p>
          </div>
          <div className="text-center p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.images.avgPerUser}</p>
            <p className="text-sm text-gray-500">Images/User</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 text-right">
        Generated: {new Date(data.generatedAt).toLocaleString()}
      </p>
    </div>
  )
}
