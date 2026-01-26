'use client'

import { useState, useEffect } from 'react'
import { Lightbulb, TrendingUp, TrendingDown, Minus, AlertCircle, RefreshCw, Sparkles } from 'lucide-react'

interface Pattern {
  pattern: string
  affectedUsers: string
  impact: 'high' | 'medium' | 'low'
  recommendation: string
}

interface Recommendation {
  priority: 'high' | 'medium' | 'low'
  action: string
  expectedImpact: string
  effort: 'low' | 'medium' | 'high'
}

interface Trend {
  metric: string
  direction: 'increasing' | 'decreasing' | 'stable'
  change: string
}

interface InsightsData {
  patterns: Pattern[]
  recommendations: Recommendation[]
  trends: Trend[]
  metrics: {
    totalUsers: number
    activeThisWeek: number
    featureAdoption: {
      messaging: number
      imageGeneration: number
      voiceChat: number
      powerUsers: number
    }
    retention: {
      day1: number
      day7: number
      day30: number
    }
  }
  generatedAt: string
  cached: boolean
  message?: string
}

interface Props {
  analyticsKey: string
}

export default function BehaviorInsights({ analyticsKey }: Props) {
  const [data, setData] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function fetchInsights(generate = false) {
    try {
      if (generate) {
        setGenerating(true)
        const res = await fetch('/api/analytics/behavior-insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key: analyticsKey }),
        })
        if (!res.ok) throw new Error('Failed to generate insights')
        const json = await res.json()
        setData(json)
      } else {
        const res = await fetch(`/api/analytics/behavior-insights?key=${analyticsKey}`)
        if (!res.ok) throw new Error('Failed to fetch insights')
        const json = await res.json()
        setData(json)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
      setGenerating(false)
    }
  }

  useEffect(() => {
    fetchInsights()
  }, [analyticsKey])

  const impactColors = {
    high: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
    low: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  }

  const priorityColors = {
    high: 'bg-red-500',
    medium: 'bg-yellow-500',
    low: 'bg-blue-500',
  }

  const effortLabels = {
    low: 'Quick win',
    medium: 'Moderate',
    high: 'Big project',
  }

  const TrendIcon = ({ direction }: { direction: 'increasing' | 'decreasing' | 'stable' }) => {
    if (direction === 'increasing') return <TrendingUp className="w-4 h-4 text-green-500" />
    if (direction === 'decreasing') return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-gray-500" />
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={() => fetchInsights(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  // No insights yet - prompt to generate
  if (!data || data.message) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="text-center py-8">
          <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">AI-Powered Insights</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Generate intelligent analysis of your user behavior patterns
          </p>
          <button
            onClick={() => fetchInsights(true)}
            disabled={generating}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            {generating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Generate Insights
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI-Powered Insights
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Intelligent analysis of user behavior</p>
        </div>
        <div className="flex items-center gap-2">
          {data.cached && <span className="text-xs text-gray-400">(cached)</span>}
          <button
            onClick={() => fetchInsights(true)}
            disabled={generating}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
            title="Regenerate insights"
          >
            <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Key Patterns */}
      {data.patterns.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Key Patterns
          </h4>
          <div className="space-y-3">
            {data.patterns.map((pattern, idx) => (
              <div key={idx} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 dark:text-white mb-1">{pattern.pattern}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{pattern.recommendation}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${impactColors[pattern.impact]}`}>
                      {pattern.impact} impact
                    </span>
                    <span className="text-xs text-gray-500">{pattern.affectedUsers} users</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Recommendations
          </h4>
          <div className="space-y-2">
            {data.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                <div className={`w-2 h-2 rounded-full mt-2 ${priorityColors[rec.priority]}`} />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">{rec.action}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="text-green-600 dark:text-green-400">{rec.expectedImpact}</span>
                    <span>• {effortLabels[rec.effort]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trends */}
      {data.trends.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Trends</h4>
          <div className="grid grid-cols-2 gap-3">
            {data.trends.map((trend, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <TrendIcon direction={trend.direction} />
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{trend.metric}</p>
                  <p className="text-xs text-gray-500">{trend.change}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-gray-400 text-right">
        Generated: {new Date(data.generatedAt).toLocaleString()}
      </p>
    </div>
  )
}
