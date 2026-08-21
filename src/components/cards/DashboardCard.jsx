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
      className={`rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-card hover:shadow-card-hover transition-all duration-200 flex flex-col ${className}`}
    >
      {(title || action) && (
        <div
          className={`flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800/80 ${headerClassName}`}
        >
          <div>
            {title && (
              <h2 className="text-base font-semibold text-slate-900 dark:text-white">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
