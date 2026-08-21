import React from 'react'
import { AlertCircle, Edit2, Trash2, ArrowRight } from 'lucide-react'
import { formatCurrency } from '../../utils/currencyFormatter'
import ProgressBar from '../common/ProgressBar'

export const BudgetCard = ({
  budget,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const { id, name, category, limit, spent } = budget
  const remaining = Math.max(0, limit - spent)
  const percentage = limit > 0 ? (spent / limit) * 100 : 0
  const isOverspent = percentage > 100
  const isNearLimit = percentage >= 80 && !isOverspent

  return (
    <div
      className={`rounded-2xl border bg-white dark:bg-slate-900 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between ${
        isOverspent
          ? 'border-rose-300 dark:border-rose-900/60 bg-rose-50/10'
          : isNearLimit
          ? 'border-amber-300 dark:border-amber-900/60 bg-amber-50/10'
          : 'border-slate-200/80 dark:border-slate-800/80'
      }`}
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: budget.color || '#2b8aff' }} />
              <h3 className="font-semibold text-slate-900 dark:text-white text-base">{name}</h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 ml-4.5">{category}</p>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(budget)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Edit Budget"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Delete Budget"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="my-4">
          <div className="flex justify-between items-baseline mb-1.5">
            <div className="text-lg font-bold text-slate-900 dark:text-white">
              {formatCurrency(spent)}{' '}
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400">
                / {formatCurrency(limit)}
              </span>
            </div>
            <span
              className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                isOverspent
                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                  : isNearLimit
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}
            >
              {percentage.toFixed(0)}% Used
            </span>
          </div>

          <ProgressBar
            value={spent}
            max={limit}
            color={isOverspent ? 'bg-rose-500' : isNearLimit ? 'bg-amber-500' : 'bg-emerald-500'}
            size="md"
          />
        </div>

        {/* Warning messages */}
        {isOverspent && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 mb-3 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1.5 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Over budget by {formatCurrency(spent - limit)}</span>
          </div>
        )}
        {isNearLimit && (
          <div className="flex items-center gap-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 mb-3 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1.5 rounded-lg">
            <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
            <span>Over 80% used. Watch spending.</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
        <span>Remaining: <strong className="text-slate-800 dark:text-slate-200">{formatCurrency(remaining)}</strong></span>
        {onViewDetails && (
          <button
            onClick={() => onViewDetails(budget)}
            className="inline-flex items-center gap-1 font-semibold text-brand-600 dark:text-brand-400 hover:underline"
          >
            Details <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  )
}

export default BudgetCard
