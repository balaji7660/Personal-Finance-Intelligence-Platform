import React from 'react'
import { Target, Calendar, ArrowRight, Edit2, Trash2 } from 'lucide-react'
import { formatCurrency } from '../../utils/currencyFormatter'
import { formatDate } from '../../utils/dateUtils'
import ProgressBar from '../common/ProgressBar'

export const GoalCard = ({
  goal,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const { id, name, type, targetAmount, savedAmount, targetDate, priority } = goal
  const remaining = Math.max(0, targetAmount - savedAmount)
  const percentage = targetAmount > 0 ? Math.min(100, (savedAmount / targetAmount) * 100) : 0
  const isCompleted = savedAmount >= targetAmount

  const priorityColors = {
    High: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
    Medium: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    Low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                {type}
              </span>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  priorityColors[priority] || priorityColors.Medium
                }`}
              >
                {priority} Priority
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base mt-2">{name}</h3>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(goal)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Edit Goal"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Delete Goal"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="my-3">
          <div className="flex justify-between items-baseline mb-1.5">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {formatCurrency(savedAmount)}{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                / {formatCurrency(targetAmount)}
              </span>
            </span>
            <span className="text-xs font-semibold text-brand-600 dark:text-brand-400">
              {percentage.toFixed(0)}%
            </span>
          </div>
          <ProgressBar
            value={savedAmount}
            max={targetAmount}
            color={isCompleted ? 'bg-emerald-500' : 'bg-brand-600'}
            size="md"
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>Target: {formatDate(targetDate)}</span>
          </div>
          <div>
            Remaining: <strong className="text-slate-700 dark:text-slate-300">{formatCurrency(remaining)}</strong>
          </div>
        </div>
      </div>

      {onViewDetails && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
          <button
            onClick={() => onViewDetails(goal)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Goal Details <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  )
}

export default GoalCard
