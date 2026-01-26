'use client'

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface CohortData {
  cohortWeek: string
  cohortStart: string
  cohortSize: number
  day1: number
  day7: number
  day30: number
  day1Count: number
  day7Count: number
  day30Count: number
}

interface RetentionData {
  cohorts: CohortData[]
  averages: { day1: number; day7: number; day30: number }
  trend: 'improving' | 'declining' | 'stable'
  totalUsers: number
  generatedAt: string
  cached: boolean
}

interface Props {
  analyticsKey: string
}

export default function RetentionCohorts({ analyticsKey }: Props) {
  const [data, setData] = useState<RetentionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRetention() {
      try {
        const res = await fetch(`/api/analytics/retention?key=${analyticsKey}&weeks=8`)
        if (!res.ok) throw new Error('Failed to fetch retention data')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchRetention()
  }, [analyticsKey])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
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

  const getRetentionColor = (value: number) => {
    if (value < 0) return 'bg-gray-100 dark:bg-gray-700 text-gray-400'
    if (value >= 50) return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
    if (value >= 30) return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
    return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
  }

  const trendIcon = {
    improving: '↑',
    declining: '↓',
    stable: '→',
  }

  const trendColor = {
    improving: 'text-green-500',
    declining: 'text-red-500',
    stable: 'text-gray-500',
  }

  // Prepare chart data (reverse to show oldest first)
  const chartData = [...data.cohorts].reverse().map(c => ({
    week: c.cohortWeek.replace('2026-', ''),
    'Day 1': c.day1 >= 0 ? c.day1 : null,
    'Day 7': c.day7 >= 0 ? c.day7 : null,
    'Day 30': c.day30 >= 0 ? c.day30 : null,
  }))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Retention Cohorts</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Track how users return over time by signup week</p>
        </div>
        <div className="text-right">
          <span className={`text-sm font-medium ${trendColor[data.trend]}`}>
            {trendIcon[data.trend]} {data.trend.charAt(0).toUpperCase() + data.trend.slice(1)}
          </span>
          {data.cached && (
            <span className="ml-2 text-xs text-gray-400">(cached)</span>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.averages.day1}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg D1 Retention</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.averages.day7}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg D7 Retention</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.averages.day30}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Avg D30 Retention</p>
        </div>
      </div>

      {/* Retention Chart */}
      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
            <XAxis dataKey="week" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9CA3AF" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1F2937',
                border: 'none',
                borderRadius: '8px',
                color: '#F9FAFB',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="Day 1" stroke="#10B981" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Day 7" stroke="#3B82F6" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="Day 30" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Cohort Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left py-2 px-3 font-medium text-gray-600 dark:text-gray-300">Cohort</th>
              <th className="text-center py-2 px-3 font-medium text-gray-600 dark:text-gray-300">Users</th>
              <th className="text-center py-2 px-3 font-medium text-gray-600 dark:text-gray-300">D1</th>
              <th className="text-center py-2 px-3 font-medium text-gray-600 dark:text-gray-300">D7</th>
              <th className="text-center py-2 px-3 font-medium text-gray-600 dark:text-gray-300">D30</th>
            </tr>
          </thead>
          <tbody>
            {data.cohorts.map((cohort) => (
              <tr key={cohort.cohortWeek} className="border-b border-gray-100 dark:border-gray-700/50">
                <td className="py-2 px-3">
                  <div className="font-medium text-gray-900 dark:text-white">{cohort.cohortWeek}</div>
                  <div className="text-xs text-gray-500">{cohort.cohortStart}</div>
                </td>
                <td className="text-center py-2 px-3 text-gray-700 dark:text-gray-300">{cohort.cohortSize}</td>
                <td className="text-center py-2 px-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRetentionColor(cohort.day1)}`}>
                    {cohort.day1 >= 0 ? `${cohort.day1}%` : 'N/A'}
                  </span>
                </td>
                <td className="text-center py-2 px-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRetentionColor(cohort.day7)}`}>
                    {cohort.day7 >= 0 ? `${cohort.day7}%` : 'N/A'}
                  </span>
                </td>
                <td className="text-center py-2 px-3">
                  <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${getRetentionColor(cohort.day30)}`}>
                    {cohort.day30 >= 0 ? `${cohort.day30}%` : 'N/A'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-right">
        Generated: {new Date(data.generatedAt).toLocaleString()}
      </p>
    </div>
  )
}
