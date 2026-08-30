import React from 'react'

export const DashboardCard = ({
  title,
  subtitle,
  children,
  action,
  className = '',
  headerClassName = '',
}) => {
  return (
    <div
      className={`glass-card rounded-2xl transition-all duration-300 flex flex-col hover:border-slate-300 dark:hover:border-slate-700/80 ${className}`}
    >
      {(title || action) && (
        <div
          className={`flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 ${headerClassName}`}
        >
          <div>
            {title && (
              <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                {subtitle}
              </p>
            )}
          </div>
          {action && <div className="flex items-center gap-2">{action}</div>}
        </div>
      )}
      <div className="p-6 flex-1">{children}</div>
    </div>
  )
}

export default DashboardCard
