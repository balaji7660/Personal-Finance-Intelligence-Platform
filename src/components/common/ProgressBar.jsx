import React from 'react'

export const ProgressBar = ({
  value = 0,
  max = 100,
  color = 'bg-brand-600',
  size = 'md',
  showLabel = false,
  label,
  animate = true,
  className = '',
}) => {
  const percentage = Math.min(100, Math.max(0, max > 0 ? (value / max) * 100 : 0))

  const heights = {
    xs: 'h-1',
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }

  // Dynamic status color if color is not explicitly a custom hex/class
  let barColorClass = color
  if (color === 'auto') {
    if (percentage >= 90) barColorClass = 'bg-rose-500'
    else if (percentage >= 75) barColorClass = 'bg-amber-500'
    else barColorClass = 'bg-emerald-500'
  }

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center text-xs font-medium mb-1.5 text-slate-600 dark:text-slate-300">
          <span>{label || 'Progress'}</span>
          <span>{percentage.toFixed(1)}%</span>
        </div>
      )}
      <div className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full ${barColorClass} ${animate ? 'transition-all duration-500 ease-out' : ''}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
