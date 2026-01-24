'use client'

import { cn } from '@/lib/utils'

// Base skeleton component with pulse animation
interface SkeletonProps {
  className?: string
  style?: React.CSSProperties
}

export function Skeleton({ className, style }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 rounded',
        className
      )}
      style={style}
    />
  )
}

// Stat card loading skeleton
export function StatCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-3" />
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-32" />
        </div>
        <Skeleton className="h-12 w-12 rounded-xl" />
      </div>
    </div>
  )
}

// Quality gauge skeleton
export function QualityGaugeSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex flex-col items-center">
        <Skeleton className="h-4 w-28 mb-4" />
        <Skeleton className="h-32 w-32 rounded-full mb-4" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

// Issue card skeleton
export function IssueCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm border border-slate-200 dark:border-slate-700">
      <div className="flex items-start gap-3">
        <Skeleton className="h-6 w-16 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-3 w-3/4 mb-3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  )
}

// Chart loading skeleton
export function ChartSkeleton({ height = 300 }: { height?: number }) {
  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700"
      style={{ height }}
    >
      <div className="flex items-center justify-between mb-4">
        <Skeleton className="h-5 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
          <Skeleton className="h-8 w-16 rounded-lg" />
        </div>
      </div>
      <div className="flex items-end gap-2 h-[calc(100%-60px)]">
        {[40, 65, 50, 80, 45, 70, 55, 75, 60, 85, 50, 72].map((h, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end">
            <Skeleton
              className="w-full rounded-t"
              style={{ height: `${h}%` }}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// Table row skeleton
export function TableRowSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-200 dark:border-slate-700">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === 0 ? 'w-32' : 'flex-1')}
        />
      ))}
    </div>
  )
}

// Full dashboard loading skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartSkeleton height={350} />
        </div>
        <div className="space-y-4">
          <QualityGaugeSkeleton />
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
            <Skeleton className="h-5 w-24 mb-4" />
            <IssueCardSkeleton />
            <div className="mt-3">
              <IssueCardSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// AI Analysis loading skeleton
export function AIAnalysisSkeleton() {
  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-6 border border-blue-100 dark:border-blue-800">
        <Skeleton className="h-5 w-28 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6 mb-2" />
        <Skeleton className="h-4 w-4/6" />
      </div>

      {/* Quick wins */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <Skeleton className="h-5 w-24 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
          <Skeleton className="h-10 w-full rounded-lg" />
        </div>
      </div>

      {/* Issues */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
        <Skeleton className="h-5 w-32 mb-4" />
        <div className="space-y-3">
          <IssueCardSkeleton />
          <IssueCardSkeleton />
          <IssueCardSkeleton />
        </div>
      </div>
    </div>
  )
}

// History list skeleton
export function HistoryListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700">
        <Skeleton className="h-5 w-36" />
      </div>
      <div className="p-4">
        {Array.from({ length: rows }).map((_, i) => (
          <TableRowSkeleton key={i} columns={5} />
        ))}
      </div>
    </div>
  )
}

export default {
  Skeleton,
  StatCardSkeleton,
  QualityGaugeSkeleton,
  IssueCardSkeleton,
  ChartSkeleton,
  TableRowSkeleton,
  DashboardSkeleton,
  AIAnalysisSkeleton,
  HistoryListSkeleton
}
