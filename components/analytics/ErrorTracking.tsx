'use client'

import { useState, useEffect } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertTriangle, TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface ErrorSummary {
  errorType: string
  count: number
  uniqueUsers: number
  avgReconnectAttempts: number
  firstSeen: string | null
  lastSeen: string | null
  trend: 'increasing' | 'stable' | 'decreasing'
}

interface UserWithErrors {
  userId: string
  userIdShort: string
  errorCount: number
  lastError: string | null
  errorTypes: string[]
  deviceModel: string
  appVersion: string
  locale: string
}

interface VoiceFailure {
  userId: string
  userIdShort: string
  errorType: string
  errorMessage: string
  reconnectAttempts: number
  sessionDuration: number
  timestamp: string
  deviceModel: string
}

interface ErrorData {
  summary: {
    totalErrors: number
    voiceErrors: number
    nsfwAttempts: number
    usersAffected: number
    errorRate: number
  }
  errorsByType: ErrorSummary[]
  errorTimeline: { date: string; count: number }[]
  usersWithMostErrors: UserWithErrors[]
  recentErrors: VoiceFailure[]
  totalUsers: number
  generatedAt: string
  cached: boolean
}

interface Props {
  analyticsKey: string
  onUserClick?: (userId: string) => void
}

export default function ErrorTracking({ analyticsKey, onUserClick }: Props) {
  const [data, setData] = useState<ErrorData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'recent'>('overview')

  useEffect(() => {
    async function fetchErrors() {
      try {
        const res = await fetch(`/api/analytics/errors?key=${analyticsKey}`)
        if (!res.ok) throw new Error('Failed to fetch error data')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchErrors()
  }, [analyticsKey])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-4 gap-4 mb-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
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

  const TrendIcon = ({ trend }: { trend: 'increasing' | 'stable' | 'decreasing' }) => {
    if (trend === 'increasing') return <TrendingUp className="w-4 h-4 text-red-500" />
    if (trend === 'decreasing') return <TrendingDown className="w-4 h-4 text-green-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Error Tracking</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monitor voice failures and issues</p>
        </div>
        {data.cached && (
          <span className="text-xs text-gray-400">(cached)</span>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-1">
            <AlertTriangle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-gray-600 dark:text-gray-400">Total Errors</span>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{data.summary.totalErrors}</p>
        </div>
        <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Voice Errors</span>
          <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{data.summary.voiceErrors}</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Users Affected</span>
          <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{data.summary.usersAffected}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
          <span className="text-sm text-gray-600 dark:text-gray-400">Error Rate</span>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.summary.errorRate}%</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-gray-200 dark:border-gray-700">
        {(['overview', 'users', 'recent'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {tab === 'overview' ? 'Overview' : tab === 'users' ? 'Affected Users' : 'Recent Errors'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
          {/* Error Timeline Chart */}
          <div className="h-48 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.errorTimeline}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 10 }}
                  stroke="#9CA3AF"
                  tickFormatter={(val) => val.slice(5)}
                />
                <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: 'none',
                    borderRadius: '8px',
                    color: '#F9FAFB',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#EF4444"
                  fill="#EF4444"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Error Types Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-300">Error Type</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600 dark:text-gray-300">Count</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600 dark:text-gray-300">Users</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600 dark:text-gray-300">Avg Retries</th>
                  <th className="text-center py-2 px-3 font-medium text-gray-600 dark:text-gray-300">Trend</th>
                </tr>
              </thead>
              <tbody>
                {data.errorsByType.map((err) => (
                  <tr key={err.errorType} className="border-b border-gray-100 dark:border-gray-700/50">
                    <td className="py-2 px-3 font-mono text-xs text-gray-900 dark:text-white">
                      {err.errorType}
                    </td>
                    <td className="text-center py-2 px-3 text-gray-700 dark:text-gray-300">{err.count}</td>
                    <td className="text-center py-2 px-3 text-gray-700 dark:text-gray-300">{err.uniqueUsers}</td>
                    <td className="text-center py-2 px-3 text-gray-700 dark:text-gray-300">{err.avgReconnectAttempts}</td>
                    <td className="text-center py-2 px-3">
                      <TrendIcon trend={err.trend} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'users' && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-300">User</th>
                <th className="text-center py-2 px-3 font-medium text-gray-600 dark:text-gray-300">Errors</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-300">Types</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-300">Device</th>
                <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-300">Version</th>
              </tr>
            </thead>
            <tbody>
              {data.usersWithMostErrors.map((user) => (
                <tr
                  key={user.userId}
                  className="border-b border-gray-100 dark:border-gray-700/50 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  onClick={() => onUserClick?.(user.userId)}
                >
                  <td className="py-2 px-3 font-mono text-xs text-blue-600 dark:text-blue-400">
                    {user.userIdShort}
                  </td>
                  <td className="text-center py-2 px-3">
                    <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs font-medium">
                      {user.errorCount}
                    </span>
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex flex-wrap gap-1">
                      {user.errorTypes.slice(0, 2).map(type => (
                        <span key={type} className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-xs">
                          {type}
                        </span>
                      ))}
                      {user.errorTypes.length > 2 && (
                        <span className="text-xs text-gray-500">+{user.errorTypes.length - 2}</span>
                      )}
                    </div>
                  </td>
                  <td className="py-2 px-3 text-xs text-gray-600 dark:text-gray-400">{user.deviceModel}</td>
                  <td className="py-2 px-3 text-xs text-gray-600 dark:text-gray-400">{user.appVersion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'recent' && (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {data.recentErrors.map((err, idx) => (
            <div
              key={`${err.userId}-${idx}`}
              className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => onUserClick?.(err.userId)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="font-mono text-xs text-blue-600 dark:text-blue-400">{err.userIdShort}</span>
                <span className="text-xs text-gray-500">{new Date(err.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded text-xs font-medium">
                  {err.errorType}
                </span>
                <span className="text-xs text-gray-500">{err.deviceModel}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{err.errorMessage}</p>
              {err.reconnectAttempts > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {err.reconnectAttempts} reconnect attempt{err.reconnectAttempts > 1 ? 's' : ''}
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400 mt-4 text-right">
        Generated: {new Date(data.generatedAt).toLocaleString()}
      </p>
    </div>
  )
}
