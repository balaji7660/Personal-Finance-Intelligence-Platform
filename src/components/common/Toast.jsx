import React from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export const Toast = ({ message, type = 'success', onClose }) => {
  if (!message) return null

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
    },
    error: {
      bg: 'bg-rose-50 dark:bg-rose-950/80 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200',
      icon: AlertCircle,
      iconColor: 'text-rose-500',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
      icon: Info,
      iconColor: 'text-blue-500',
    },
    warning: {
      bg: 'bg-amber-50 dark:bg-amber-950/80 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200',
      icon: AlertCircle,
      iconColor: 'text-amber-500',
    },
  }

  const config = typeConfig[type] || typeConfig.info
  const Icon = config.icon

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-md animate-bounce-short">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg ${config.bg}`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconColor}`} />
        <p className="text-sm font-medium">{message}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Toast
