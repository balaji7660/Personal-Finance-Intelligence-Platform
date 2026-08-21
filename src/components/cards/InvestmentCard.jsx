import React from 'react'
import { TrendingUp, TrendingDown, Edit2, Trash2, ShieldCheck, ShieldAlert } from 'lucide-react'
import { formatCurrency, formatPercentage } from '../../utils/currencyFormatter'
import { formatDate } from '../../utils/dateUtils'

export const InvestmentCard = ({
  investment,
  onEdit,
  onDelete,
  onViewDetails,
}) => {
  const { id, name, type, investedAmount, currentValue, purchaseDate, riskLevel } = investment
  const returns = currentValue - investedAmount
  const returnPercentage = investedAmount > 0 ? (returns / investedAmount) * 100 : 0
  const isPositive = returns >= 0

  const riskBadgeColors = {
    Low: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
    Moderate: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800',
    High: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800',
  }

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 p-5 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {type}
              </span>
              <span
                className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${
                  riskBadgeColors[riskLevel] || riskBadgeColors.Moderate
                }`}
              >
                {riskLevel} Risk
              </span>
            </div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base mt-2">{name}</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Purchased: {formatDate(purchaseDate)}
            </p>
          </div>
          <div className="flex items-center gap-1">
            {onEdit && (
              <button
                onClick={() => onEdit(investment)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Edit"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 py-3 my-2 border-y border-slate-100 dark:border-slate-800/80">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Invested</span>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {formatCurrency(investedAmount)}
            </p>
          </div>
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400">Current Value</span>
            <p className="text-base font-bold text-slate-900 dark:text-white">
              {formatCurrency(currentValue)}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-1.5">
          <span
            className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
              isPositive
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {formatPercentage(returnPercentage)}
          </span>
          <span className="text-xs text-slate-500">
            ({isPositive ? '+' : ''}{formatCurrency(returns)})
          </span>
        </div>

        {onViewDetails && (
          <button
            onClick={() => onViewDetails(investment)}
            className="text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline"
          >
            View Details
          </button>
        )}
      </div>
    </div>
  )
}

export default InvestmentCard
