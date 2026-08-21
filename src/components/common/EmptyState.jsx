import React from 'react'
import { FolderOpen } from 'lucide-react'
import Button from './Button'

export const EmptyState = ({
  icon: Icon = FolderOpen,
  title = 'No data available',
  description = 'There is currently nothing to display in this section.',
  actionText,
  onAction,
  actionIcon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
      <div className="w-14 h-14 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} icon={actionIcon} variant="primary" size="md">
          {actionText}
        </Button>
      )}
    </div>
  )
}

export default EmptyState
