'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, AlertCircle, Info, X, Bell, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface Alert {
  id: string
  type: 'error_spike' | 'nsfw_spike' | 'engagement_drop' | 'retention_drop' | 'new_users_drop'
  severity: 'critical' | 'warning' | 'info'
  title: string
  description: string
  metric: string
  currentValue: number
  baselineValue: number
  percentChange: number
  affectedUsers?: number
  triggeredAt: string
}

interface AlertsData {
  alerts: Alert[]
  alertCount: {
    critical: number
    warning: number
    info: number
    total: number
  }
  metrics: {
    activeToday: number
    activeYesterday: number
    activeThisWeek: number
    activeLastWeek: number
    newUsersThisWeek: number
    newUsersLastWeek: number
    currentVoiceErrors: number
    baselineVoiceErrors: number
  }
  generatedAt: string
  cached: boolean
}

interface Props {
  analyticsKey: string
  compact?: boolean // For main analytics page banner
  onAlertClick?: (alert: Alert) => void
}

export default function AlertsPanel({ analyticsKey, compact = false, onAlertClick }: Props) {
  const [data, setData] = useState<AlertsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function fetchAlerts() {
      try {
        const res = await fetch(`/api/analytics/alerts?key=${analyticsKey}`)
        if (!res.ok) throw new Error('Failed to fetch alerts')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchAlerts()

    // Refresh alerts every 5 minutes
    const interval = setInterval(fetchAlerts, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [analyticsKey])

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]))
  }

  const severityConfig = {
    critical: {
      icon: AlertTriangle,
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
      textColor: 'text-red-700 dark:text-red-400',
      iconColor: 'text-red-500',
    },
    warning: {
      icon: AlertCircle,
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-800',
      textColor: 'text-yellow-700 dark:text-yellow-400',
      iconColor: 'text-yellow-500',
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
      textColor: 'text-blue-700 dark:text-blue-400',
      iconColor: 'text-blue-500',
    },
  }

  if (loading) {
    if (compact) {
      return null // Don't show loading state for compact banner
    }
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    )
  }

  if (error && !compact) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <p className="text-red-500">Error loading alerts: {error}</p>
      </div>
    )
  }

  if (!data) return null

  const visibleAlerts = data.alerts.filter(a => !dismissedAlerts.has(a.id))
  const criticalAlerts = visibleAlerts.filter(a => a.severity === 'critical')
  const hasAlerts = visibleAlerts.length > 0

  // Compact mode - just show banner for critical/warning alerts
  if (compact) {
    if (!hasAlerts || (criticalAlerts.length === 0 && data.alertCount.warning === 0)) {
      return null // No banner needed
    }

    const topAlert = criticalAlerts[0] || visibleAlerts[0]
    const config = severityConfig[topAlert.severity]
    const Icon = config.icon

    return (
      <Link href="/analytics/users?tab=alerts">
        <div className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 mb-6 cursor-pointer hover:opacity-90 transition-opacity`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon className={`w-5 h-5 ${config.iconColor}`} />
              <div>
                <p className={`font-medium ${config.textColor}`}>{topAlert.title}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">{topAlert.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {visibleAlerts.length > 1 && (
                <span className="text-sm text-gray-500">
                  +{visibleAlerts.length - 1} more
                </span>
              )}
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>
      </Link>
    )
  }

  // Full panel mode
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alerts
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Monitoring for unusual activity</p>
        </div>
        <div className="flex items-center gap-2">
          {data.alertCount.critical > 0 && (
            <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-medium">
              {data.alertCount.critical} Critical
            </span>
          )}
          {data.alertCount.warning > 0 && (
            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded text-xs font-medium">
              {data.alertCount.warning} Warning
            </span>
          )}
          {data.cached && <span className="text-xs text-gray-400">(cached)</span>}
        </div>
      </div>

      {!hasAlerts ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-4 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <Bell className="w-6 h-6 text-green-500" />
          </div>
          <p className="font-medium text-gray-900 dark:text-white">All Clear!</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">No unusual activity detected</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visibleAlerts.map((alert) => {
            const config = severityConfig[alert.severity]
            const Icon = config.icon

            return (
              <div
                key={alert.id}
                className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4 cursor-pointer hover:opacity-90 transition-opacity`}
                onClick={() => onAlertClick?.(alert)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${config.iconColor}`} />
                    <div>
                      <p className={`font-medium ${config.textColor}`}>{alert.title}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{alert.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                        <span>
                          {alert.currentValue} vs {alert.baselineValue} baseline
                        </span>
                        <span className={alert.percentChange > 0 ? 'text-red-500' : 'text-green-500'}>
                          {alert.percentChange > 0 ? '+' : ''}{alert.percentChange}%
                        </span>
                        {alert.affectedUsers && (
                          <span>{alert.affectedUsers} users affected</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      dismissAlert(alert.id)
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
                    title="Dismiss"
                  >
                    <X className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Quick Metrics */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Quick Metrics</h4>
        <div className="grid grid-cols-4 gap-3 text-center text-xs">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{data.metrics.activeToday}</p>
            <p className="text-gray-500">Active Today</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{data.metrics.activeThisWeek}</p>
            <p className="text-gray-500">This Week</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{data.metrics.newUsersThisWeek}</p>
            <p className="text-gray-500">New Users</p>
          </div>
          <div>
            <p className={`font-semibold ${data.metrics.currentVoiceErrors > data.metrics.baselineVoiceErrors ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
              {data.metrics.currentVoiceErrors}
            </p>
            <p className="text-gray-500">Errors (24h)</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-right">
        Last checked: {new Date(data.generatedAt).toLocaleString()}
      </p>
    </div>
  )
}
