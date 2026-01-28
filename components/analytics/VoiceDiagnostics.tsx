'use client'

import { useState, useEffect } from 'react'
import { Mic, AlertTriangle, Smartphone, Clock, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react'

interface VoiceDiagnosticsData {
  summary: {
    totalFailures: number
    totalVoiceSessions: number
    totalVoiceFailures: number
    successRate: number
    dateRange: {
      from: string
      to: string
    }
  }
  failuresByType: {
    type: string
    count: number
    percentage: number
    topErrors: { error: string; count: number }[]
    deviceCount: number
    devices: string[]
    appVersions: string[]
    recentErrors: string[]
  }[]
  hourlyTimeline: { hour: string; count: number }[]
  deviceBreakdown: { device: string; count: number }[]
  versionBreakdown: { version: string; count: number }[]
  recentErrors: {
    type: string
    error: string
    device: string
    time: string
    appVersion: string
  }[]
  usersWithFailures: {
    id: string
    sessions: number
    failures: number
    lastFailureType: string
    device: string
    appVersion: string
  }[]
  generatedAt: string
}

interface Props {
  analyticsKey: string
  isDark: boolean
}

export default function VoiceDiagnostics({ analyticsKey, isDark }: Props) {
  const [data, setData] = useState<VoiceDiagnosticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedType, setExpandedType] = useState<string | null>(null)
  const [days, setDays] = useState(7)

  const fetchData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/analytics/voice-diagnostics?key=${analyticsKey}&days=${days}`)
      if (!res.ok) throw new Error('Failed to fetch voice diagnostics')
      const json = await res.json()
      setData(json)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [analyticsKey, days])

  const getStatusColor = (rate: number) => {
    if (rate >= 90) return 'text-green-500'
    if (rate >= 70) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getStatusBg = (rate: number) => {
    if (rate >= 90) return isDark ? 'bg-green-900/20' : 'bg-green-50'
    if (rate >= 70) return isDark ? 'bg-yellow-900/20' : 'bg-yellow-50'
    return isDark ? 'bg-red-900/20' : 'bg-red-50'
  }

  if (loading) {
    return (
      <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="animate-pulse space-y-4">
          <div className={`h-6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded w-1/3`}></div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-24 ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded`}></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <p className="text-red-500">Error: {error}</p>
        <button onClick={fetchData} className="mt-2 text-purple-500 hover:underline">
          Try again
        </button>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDark ? 'bg-red-900/30' : 'bg-red-100'}`}>
              <Mic className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Voice Diagnostics
              </h3>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                Detailed voice connection failure analysis
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <select
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              className={`px-3 py-1.5 rounded-lg text-sm ${
                isDark ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-gray-900 border-gray-200'
              } border`}
            >
              <option value={1}>Last 24h</option>
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={30}>Last 30 days</option>
            </select>
            <button
              onClick={fetchData}
              className={`p-2 rounded-lg ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`rounded-lg p-4 ${getStatusBg(data.summary.successRate)}`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Success Rate</p>
            <p className={`text-2xl font-bold ${getStatusColor(data.summary.successRate)}`}>
              {data.summary.successRate}%
            </p>
          </div>
          <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Sessions</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data.summary.totalVoiceSessions}
            </p>
          </div>
          <div className={`rounded-lg p-4 ${isDark ? 'bg-red-900/20' : 'bg-red-50'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Total Failures</p>
            <p className="text-2xl font-bold text-red-500">
              {data.summary.totalVoiceFailures}
            </p>
          </div>
          <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-700/50' : 'bg-gray-100'}`}>
            <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>Failure Docs</p>
            <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
              {data.summary.totalFailures}
            </p>
          </div>
        </div>
      </div>

      {/* Failures by Type */}
      {data.failuresByType.length > 0 && (
        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h4 className={`text-md font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <AlertTriangle className="w-4 h-4 text-red-500" />
            Failures by Type
          </h4>
          <div className="space-y-3">
            {data.failuresByType.map((failure) => (
              <div
                key={failure.type}
                className={`rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700/30' : 'border-gray-200 bg-gray-50'}`}
              >
                <button
                  onClick={() => setExpandedType(expandedType === failure.type ? null : failure.type)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4">
                    <span className={`font-mono text-sm px-2 py-1 rounded ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}>
                      {failure.type}
                    </span>
                    <span className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                      {failure.count}
                    </span>
                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                      ({failure.percentage}%)
                    </span>
                  </div>
                  {expandedType === failure.type ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>

                {expandedType === failure.type && (
                  <div className={`px-4 pb-4 pt-0 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      {/* Top Errors */}
                      <div>
                        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Top Errors
                        </p>
                        <div className="space-y-1">
                          {failure.topErrors.map((err, i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className={`font-mono truncate mr-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                                {err.error.substring(0, 50)}...
                              </span>
                              <span className="text-red-500 font-medium">{err.count}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Affected Devices */}
                      <div>
                        <p className={`text-xs font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          Affected Devices ({failure.deviceCount})
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {failure.devices.map((device, i) => (
                            <span
                              key={i}
                              className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-700'}`}
                            >
                              {device}
                            </span>
                          ))}
                        </div>
                        <p className={`text-xs font-medium mt-3 mb-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                          App Versions
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {failure.appVersions.map((version, i) => (
                            <span
                              key={i}
                              className={`text-xs px-2 py-0.5 rounded ${isDark ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-700'}`}
                            >
                              v{version}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Errors */}
      {data.recentErrors.length > 0 && (
        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h4 className={`text-md font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Clock className="w-4 h-4 text-orange-500" />
            Recent Errors (Last {data.recentErrors.length})
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  <th className="text-left py-2 px-3">Time</th>
                  <th className="text-left py-2 px-3">Type</th>
                  <th className="text-left py-2 px-3">Error</th>
                  <th className="text-left py-2 px-3">Device</th>
                  <th className="text-left py-2 px-3">Version</th>
                </tr>
              </thead>
              <tbody>
                {data.recentErrors.slice(0, 20).map((err, i) => (
                  <tr
                    key={i}
                    className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                  >
                    <td className={`py-2 px-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {new Date(err.time).toLocaleString()}
                    </td>
                    <td className="py-2 px-3">
                      <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${isDark ? 'bg-red-900/30 text-red-400' : 'bg-red-100 text-red-700'}`}>
                        {err.type}
                      </span>
                    </td>
                    <td className={`py-2 px-3 font-mono text-xs max-w-xs truncate ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {err.error.substring(0, 60)}...
                    </td>
                    <td className={`py-2 px-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {err.device}
                    </td>
                    <td className={`py-2 px-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {err.appVersion}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users with Most Failures */}
      {data.usersWithFailures.length > 0 && (
        <div className={`rounded-xl p-6 ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <h4 className={`text-md font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            <Smartphone className="w-4 h-4 text-purple-500" />
            Users with Most Failures
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                  <th className="text-left py-2 px-3">User ID</th>
                  <th className="text-left py-2 px-3">Sessions</th>
                  <th className="text-left py-2 px-3">Failures</th>
                  <th className="text-left py-2 px-3">Success Rate</th>
                  <th className="text-left py-2 px-3">Last Error</th>
                  <th className="text-left py-2 px-3">Device</th>
                </tr>
              </thead>
              <tbody>
                {data.usersWithFailures.map((user, i) => {
                  const userSuccessRate = user.sessions > 0
                    ? Math.round(((user.sessions - user.failures) / user.sessions) * 100)
                    : 0
                  return (
                    <tr
                      key={i}
                      className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <td className={`py-2 px-3 font-mono text-xs ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {user.id}
                      </td>
                      <td className={`py-2 px-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {user.sessions}
                      </td>
                      <td className="py-2 px-3 text-red-500 font-medium">
                        {user.failures}
                      </td>
                      <td className={`py-2 px-3 ${getStatusColor(userSuccessRate)}`}>
                        {userSuccessRate}%
                      </td>
                      <td className="py-2 px-3">
                        <span className={`font-mono text-xs px-1.5 py-0.5 rounded ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'}`}>
                          {user.lastFailureType}
                        </span>
                      </td>
                      <td className={`py-2 px-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {user.device} (v{user.appVersion})
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* No Data State */}
      {data.failuresByType.length === 0 && data.recentErrors.length === 0 && (
        <div className={`rounded-xl p-12 text-center ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
          <Mic className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} />
          <p className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            No Voice Failure Documents Found
          </p>
          <p className={`text-sm mt-2 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            Detailed failure documents will appear here after deploying the updated app.
          </p>
        </div>
      )}

      <p className={`text-xs text-right ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
        Generated: {new Date(data.generatedAt).toLocaleString()}
      </p>
    </div>
  )
}
