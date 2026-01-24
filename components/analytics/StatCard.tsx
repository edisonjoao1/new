'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeInUp, springScale } from '@/lib/animations'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle?: string
  change?: number
  changeLabel?: string
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  onClick?: () => void
}

const variantStyles = {
  default: {
    bg: 'bg-white dark:bg-slate-800',
    border: 'border-slate-200 dark:border-slate-700',
    icon: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
  },
  success: {
    bg: 'bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
    border: 'border-emerald-200 dark:border-emerald-800',
    icon: 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400'
  },
  warning: {
    bg: 'bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20',
    border: 'border-amber-200 dark:border-amber-800',
    icon: 'bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-400'
  },
  danger: {
    bg: 'bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-400'
  },
  info: {
    bg: 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400'
  }
}

const sizeStyles = {
  sm: {
    padding: 'p-4',
    title: 'text-xs',
    value: 'text-xl',
    subtitle: 'text-xs',
    icon: 'h-10 w-10'
  },
  md: {
    padding: 'p-5',
    title: 'text-sm',
    value: 'text-2xl',
    subtitle: 'text-xs',
    icon: 'h-12 w-12'
  },
  lg: {
    padding: 'p-6',
    title: 'text-sm',
    value: 'text-3xl',
    subtitle: 'text-sm',
    icon: 'h-14 w-14'
  }
}

export default function StatCard({
  title,
  value,
  subtitle,
  change,
  changeLabel,
  icon,
  variant = 'default',
  size = 'md',
  className,
  onClick
}: StatCardProps) {
  const styles = variantStyles[variant]
  const sizes = sizeStyles[size]

  const getTrendIcon = () => {
    if (change === undefined || change === 0) return <Minus className="h-3 w-3" />
    if (change > 0) return <TrendingUp className="h-3 w-3" />
    return <TrendingDown className="h-3 w-3" />
  }

  const getTrendColor = () => {
    if (change === undefined || change === 0) return 'text-slate-500'
    if (change > 0) return 'text-emerald-600 dark:text-emerald-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <motion.div
      {...fadeInUp}
      {...(onClick ? springScale : {})}
      className={cn(
        'rounded-xl shadow-sm border transition-all duration-200',
        styles.bg,
        styles.border,
        sizes.padding,
        onClick && 'cursor-pointer hover:shadow-md',
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className={cn('font-medium text-slate-500 dark:text-slate-400 mb-1', sizes.title)}>
            {title}
          </p>
          <motion.p
            className={cn('font-bold text-slate-900 dark:text-white tracking-tight', sizes.value)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {value}
          </motion.p>
          {(subtitle || change !== undefined) && (
            <div className={cn('flex items-center gap-2 mt-2', sizes.subtitle)}>
              {change !== undefined && (
                <span className={cn('flex items-center gap-0.5 font-medium', getTrendColor())}>
                  {getTrendIcon()}
                  {Math.abs(change)}%
                </span>
              )}
              {changeLabel && (
                <span className="text-slate-500 dark:text-slate-400">
                  {changeLabel}
                </span>
              )}
              {subtitle && !changeLabel && (
                <span className="text-slate-500 dark:text-slate-400">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('flex-shrink-0 rounded-xl flex items-center justify-center', styles.icon, sizes.icon)}>
            {icon}
          </div>
        )}
      </div>
    </motion.div>
  )
}

// Compact stat for inline display
interface CompactStatProps {
  label: string
  value: string | number
  change?: number
  className?: string
}

export function CompactStat({ label, value, change, className }: CompactStatProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="text-sm text-slate-500 dark:text-slate-400">{label}</span>
      <span className="font-semibold text-slate-900 dark:text-white">{value}</span>
      {change !== undefined && (
        <span className={cn(
          'text-xs font-medium flex items-center gap-0.5',
          change > 0 ? 'text-emerald-600' : change < 0 ? 'text-red-600' : 'text-slate-500'
        )}>
          {change > 0 ? <TrendingUp className="h-3 w-3" /> : change < 0 ? <TrendingDown className="h-3 w-3" /> : null}
          {Math.abs(change)}%
        </span>
      )}
    </div>
  )
}
