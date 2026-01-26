'use client'

import { useState, useEffect } from 'react'
import { Smartphone, MessageSquare, Image, Mic } from 'lucide-react'

interface FunnelStep {
  step: string
  description: string
  count: number
  percentage: number
  conversionFromPrevious: number
  dropoffFromPrevious: number
  icon: string
}

interface FeatureAdoption {
  total: number
  percentage: number
}

interface FunnelData {
  steps: FunnelStep[]
  overallConversion: number
  biggestDropoff: string
  biggestDropoffRate: number
  featureAdoption: {
    messaging: FeatureAdoption
    imageGeneration: FeatureAdoption
    voiceChat: FeatureAdoption
    multiFeature: FeatureAdoption
    powerUsers: FeatureAdoption
  }
  totalUsers: number
  generatedAt: string
  cached: boolean
}

interface Props {
  analyticsKey: string
  onStepClick?: (step: string) => void
}

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphone: Smartphone,
  'message-square': MessageSquare,
  image: Image,
  mic: Mic,
}

export default function ConversionFunnel({ analyticsKey, onStepClick }: Props) {
  const [data, setData] = useState<FunnelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFunnel() {
      try {
        const res = await fetch(`/api/analytics/funnel?key=${analyticsKey}`)
        if (!res.ok) throw new Error('Failed to fetch funnel data')
        const json = await res.json()
        setData(json)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }
    fetchFunnel()
  }, [analyticsKey])

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
      </div>
    )
  }

  if (!data) return null

  const maxCount = Math.max(...data.steps.map(s => s.count))

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Conversion Funnel</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">User journey from app open to voice chat</p>
        </div>
        {data.cached && (
          <span className="text-xs text-gray-400">(cached)</span>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{data.overallConversion}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Overall Conversion</p>
        </div>
        <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-red-600 dark:text-red-400">{data.biggestDropoffRate}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Biggest Dropoff</p>
        </div>
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-center">
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data.featureAdoption.powerUsers.percentage}%</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">Power Users</p>
        </div>
      </div>

      {/* Funnel Visualization */}
      <div className="space-y-3 mb-6">
        {data.steps.map((step, index) => {
          const Icon = iconMap[step.icon] || Smartphone
          const widthPercent = maxCount > 0 ? (step.count / maxCount) * 100 : 0
          const isDropoff = step.step === data.biggestDropoff

          return (
            <div key={step.step}>
              <div
                className={`relative rounded-lg overflow-hidden cursor-pointer transition-all hover:ring-2 hover:ring-blue-400 ${
                  isDropoff ? 'ring-2 ring-red-400' : ''
                }`}
                onClick={() => onStepClick?.(step.step)}
              >
                {/* Background bar */}
                <div
                  className={`absolute inset-y-0 left-0 ${
                    index === 0 ? 'bg-blue-500' :
                    index === 1 ? 'bg-green-500' :
                    index === 2 ? 'bg-purple-500' :
                    'bg-orange-500'
                  } opacity-20`}
                  style={{ width: `${widthPercent}%` }}
                />

                {/* Content */}
                <div className="relative flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      index === 0 ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                      index === 1 ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
                      index === 2 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' :
                      'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{step.step}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 text-right">
                    <div>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {step.count.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{step.percentage}% of total</p>
                    </div>

                    {index > 0 && (
                      <div className={`text-sm ${step.dropoffFromPrevious > 30 ? 'text-red-500' : 'text-gray-500'}`}>
                        <span className="font-medium">{step.conversionFromPrevious}%</span>
                        <p className="text-xs">from prev</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Dropoff indicator */}
              {index < data.steps.length - 1 && step.dropoffFromPrevious > 0 && (
                <div className="flex items-center justify-center py-1">
                  <div className={`text-xs px-2 py-0.5 rounded ${
                    step.dropoffFromPrevious > 30
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                  }`}>
                    ↓ {step.dropoffFromPrevious}% dropoff
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Feature Adoption Summary */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Feature Adoption</h4>
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{data.featureAdoption.messaging.percentage}%</p>
            <p className="text-gray-500">Messaging</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{data.featureAdoption.imageGeneration.percentage}%</p>
            <p className="text-gray-500">Images</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{data.featureAdoption.voiceChat.percentage}%</p>
            <p className="text-gray-500">Voice</p>
          </div>
          <div>
            <p className="font-semibold text-gray-900 dark:text-white">{data.featureAdoption.multiFeature.percentage}%</p>
            <p className="text-gray-500">Multi</p>
          </div>
          <div>
            <p className="font-semibold text-blue-600 dark:text-blue-400">{data.featureAdoption.powerUsers.percentage}%</p>
            <p className="text-gray-500">Power</p>
          </div>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-4 text-right">
        Generated: {new Date(data.generatedAt).toLocaleString()}
      </p>
    </div>
  )
}
