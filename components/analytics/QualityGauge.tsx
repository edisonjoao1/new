'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface QualityGaugeProps {
  score: number
  label?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const sizeConfig = {
  sm: { diameter: 100, stroke: 8, fontSize: 'text-xl', labelSize: 'text-xs' },
  md: { diameter: 140, stroke: 10, fontSize: 'text-3xl', labelSize: 'text-sm' },
  lg: { diameter: 180, stroke: 12, fontSize: 'text-4xl', labelSize: 'text-base' }
}

const getScoreColor = (score: number) => {
  if (score >= 90) return { stroke: '#10b981', bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', label: 'Excellent' }
  if (score >= 80) return { stroke: '#22c55e', bg: 'bg-green-50 dark:bg-green-900/20', text: 'text-green-600 dark:text-green-400', label: 'Very Good' }
  if (score >= 70) return { stroke: '#84cc16', bg: 'bg-lime-50 dark:bg-lime-900/20', text: 'text-lime-600 dark:text-lime-400', label: 'Good' }
  if (score >= 60) return { stroke: '#eab308', bg: 'bg-yellow-50 dark:bg-yellow-900/20', text: 'text-yellow-600 dark:text-yellow-400', label: 'Fair' }
  if (score >= 50) return { stroke: '#f97316', bg: 'bg-orange-50 dark:bg-orange-900/20', text: 'text-orange-600 dark:text-orange-400', label: 'Needs Work' }
  return { stroke: '#ef4444', bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', label: 'Critical' }
}

export default function QualityGauge({
  score,
  label = 'Quality Score',
  size = 'md',
  showLabel = true,
  className
}: QualityGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const config = sizeConfig[size]
  const scoreInfo = getScoreColor(score)

  const radius = (config.diameter - config.stroke) / 2
  const circumference = radius * 2 * Math.PI
  const progress = (animatedScore / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedScore(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {showLabel && (
        <p className={cn('font-medium text-slate-500 dark:text-slate-400 mb-3', config.labelSize)}>
          {label}
        </p>
      )}
      <div className="relative" style={{ width: config.diameter, height: config.diameter }}>
        {/* Background circle */}
        <svg
          className="transform -rotate-90"
          width={config.diameter}
          height={config.diameter}
        >
          <circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={config.stroke}
            className="text-slate-200 dark:text-slate-700"
          />
          {/* Progress circle */}
          <motion.circle
            cx={config.diameter / 2}
            cy={config.diameter / 2}
            r={radius}
            fill="none"
            stroke={scoreInfo.stroke}
            strokeWidth={config.stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: circumference - progress }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className={cn('font-bold', config.fontSize, scoreInfo.text)}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            {animatedScore}
          </motion.span>
          {size !== 'sm' && (
            <motion.span
              className={cn('text-xs text-slate-500 dark:text-slate-400 mt-1')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              out of 100
            </motion.span>
          )}
        </div>
      </div>
      {/* Quality label */}
      <motion.div
        className={cn('mt-3 px-3 py-1 rounded-full text-xs font-medium', scoreInfo.bg, scoreInfo.text)}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        {scoreInfo.label}
      </motion.div>
    </div>
  )
}

// Mini inline quality indicator
interface QualityBadgeProps {
  score: number
  showScore?: boolean
  className?: string
}

export function QualityBadge({ score, showScore = true, className }: QualityBadgeProps) {
  const scoreInfo = getScoreColor(score)

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium',
      scoreInfo.bg,
      scoreInfo.text,
      className
    )}>
      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: scoreInfo.stroke }}
      />
      {showScore && <span>{score}</span>}
      <span>{scoreInfo.label}</span>
    </span>
  )
}

// Sparkline quality indicator for trends
interface QualitySparklineProps {
  scores: number[]
  width?: number
  height?: number
  className?: string
}

export function QualitySparkline({ scores, width = 80, height = 24, className }: QualitySparklineProps) {
  if (scores.length < 2) return null

  const min = Math.min(...scores)
  const max = Math.max(...scores)
  const range = max - min || 1

  const points = scores.map((score, i) => {
    const x = (i / (scores.length - 1)) * width
    const y = height - ((score - min) / range) * height
    return `${x},${y}`
  }).join(' ')

  const latestScore = scores[scores.length - 1]
  const scoreInfo = getScoreColor(latestScore)

  return (
    <div className={cn('inline-flex items-center gap-2', className)}>
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          points={points}
          fill="none"
          stroke={scoreInfo.stroke}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* End dot */}
        <circle
          cx={width}
          cy={height - ((latestScore - min) / range) * height}
          r={3}
          fill={scoreInfo.stroke}
        />
      </svg>
      <span className={cn('text-sm font-medium', scoreInfo.text)}>
        {latestScore}
      </span>
    </div>
  )
}
