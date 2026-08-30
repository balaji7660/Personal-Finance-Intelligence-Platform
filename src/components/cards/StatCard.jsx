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
      bg: 'bg-brand-50/80 dark:bg-brand-950/40',
      text: 'text-brand-600 dark:text-brand-400',
      border: 'border-brand-200/50 dark:border-brand-800/40',
      glow: 'hover:border-brand-500/50 hover:shadow-glow-primary',
    },
    emerald: {
      bg: 'bg-emerald-50/80 dark:bg-emerald-950/40',
      text: 'text-emerald-600 dark:text-emerald-400',
      border: 'border-emerald-200/50 dark:border-emerald-800/40',
      glow: 'hover:border-emerald-500/50 hover:shadow-glow-emerald',
    },
    rose: {
      bg: 'bg-rose-50/80 dark:bg-rose-950/40',
      text: 'text-rose-600 dark:text-rose-400',
      border: 'border-rose-200/50 dark:border-rose-800/40',
      glow: 'hover:border-rose-500/50 hover:shadow-glow-rose',
    },
    violet: {
      bg: 'bg-violet-50/80 dark:bg-violet-950/40',
      text: 'text-violet-600 dark:text-violet-400',
      border: 'border-violet-200/50 dark:border-violet-800/40',
      glow: 'hover:border-violet-500/50 hover:shadow-glow-violet',
    },
    cyan: {
      bg: 'bg-cyan-50/80 dark:bg-cyan-950/40',
      text: 'text-cyan-600 dark:text-cyan-400',
      border: 'border-cyan-200/50 dark:border-cyan-800/40',
      glow: 'hover:border-cyan-500/50 hover:shadow-glow-primary',
    },
    amber: {
      bg: 'bg-amber-50/80 dark:bg-amber-950/40',
      text: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200/50 dark:border-amber-800/40',
      glow: 'hover:border-amber-500/50 hover:shadow-glow-primary',
    },
  }

  const currentTheme = colorMap[colorScheme] || colorMap.brand

  return (
    <div
      onClick={onClick}
      className={`glass-card p-5 rounded-2xl transition-all duration-300 hover:-translate-y-1 ${currentTheme.glow} flex flex-col justify-between ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {title}
          </p>
          <p className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-1">
            {value}
          </p>
        </div>
        {Icon && (
          <div
            className={`w-11 h-11 rounded-2xl flex items-center justify-center ${currentTheme.bg} ${currentTheme.text} border ${currentTheme.border} shadow-sm backdrop-blur-md`}
          >
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 mt-2 pt-2.5 border-t border-slate-100 dark:border-slate-800/60 text-xs font-medium">
        {change !== undefined && (
          <span
            className={`inline-flex items-center gap-0.5 font-bold px-2 py-0.5 rounded-md ${
              isPositive
                ? 'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/60 border border-emerald-200/50 dark:border-emerald-800/40'
                : 'text-rose-700 bg-rose-50 dark:text-rose-300 dark:bg-rose-950/60 border border-rose-200/50 dark:border-rose-800/40'
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
