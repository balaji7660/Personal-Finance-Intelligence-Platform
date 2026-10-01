import React from 'react'
import { TrendingUp, TrendingDown } from 'lucide-react'

export const StatCard = ({
  title,
  value,
  change,
  isPositive,
  subtitle,
  icon: Icon,
  colorScheme = 'brand',
  className = '',
  onClick,
}) => {
  const colorMap = {
    brand: {
      bg: 'bg-brand-50 dark:bg-brand-950/40',
      text: 'text-brand-600 dark:text-brand-400',
      border: 'border-brand-100 dark:border-brand-900/30',
    },
    emerald: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-100 dark:border-emerald-900/30',
    },
    rose: {
      bg: 'bg-rose-50 dark:bg-rose-950/40',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-100 dark:border-rose-900/30',
    },
    violet: {
      bg: 'bg-violet-50 dark:bg-violet-950/40',
      text: 'text-violet-600 dark:text-violet-400',
      border: 'border-violet-100 dark:border-violet-900/30',
    },
    cyan: {
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
      text: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-100 dark:border-cyan-900/30',
    },
    amber: {
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-100 dark:border-amber-900/30',
    },
  }

  const currentTheme = colorMap[colorScheme] || colorMap.brand

  return (
    <div
      onClick={onClick}
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col justify-between ${
        onClick ? 'cursor-pointer hover:border-brand-300 dark:hover:border-brand-700' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border}`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/60 text-xs">
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 font-semibold ${
              isPositive
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-3.5 h-3.5" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5" />
            )}
            {change}
          </span>
        )}
        {subtitle && (
          <span className="text-slate-500 dark:text-slate-400 truncate">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}

export default StatCard
