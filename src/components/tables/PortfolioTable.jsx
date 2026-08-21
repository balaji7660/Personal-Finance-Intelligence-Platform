import React from 'react'
import { TrendingUp, TrendingDown, Edit2, Trash2 } from 'lucide-react'
import { formatCurrency, formatPercentage } from '../../utils/currencyFormatter'
import DataTable from '../common/DataTable'

export const PortfolioTable = ({
  investments = [],
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'name',
      label: 'Asset',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">{val}</p>
          <span className="text-xs text-slate-400">{row.quantity ? `${row.quantity} units` : ''}</span>
        </div>
      ),
    },
    {
      key: 'type',
      label: 'Type',
      render: (val) => (
        <span className="px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
          {val}
        </span>
      ),
    },
    {
      key: 'investedAmount',
      label: 'Invested Amount',
      align: 'right',
      render: (val) => formatCurrency(val),
    },
    {
      key: 'currentValue',
      label: 'Current Value',
      align: 'right',
      render: (val) => (
        <span className="font-semibold text-slate-900 dark:text-white">
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      key: 'return',
      label: 'Total Returns',
      align: 'right',
      render: (_, row) => {
        const returns = (row.currentValue || 0) - (row.investedAmount || 0)
        const isPositive = returns >= 0
        return (
          <span
            className={`font-semibold ${
              isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            {isPositive ? '+' : ''}{formatCurrency(returns)}
          </span>
        )
      },
    },
    {
      key: 'returnPercent',
      label: 'Return %',
      align: 'right',
      render: (_, row) => {
        const returns = (row.currentValue || 0) - (row.investedAmount || 0)
        const pct = row.investedAmount > 0 ? (returns / row.investedAmount) * 100 : 0
        const isPositive = pct >= 0
        return (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
              isPositive
                ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400'
                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400'
            }`}
          >
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {formatPercentage(pct)}
          </span>
        )
      },
    },
    {
      key: 'riskLevel',
      label: 'Risk',
      render: (val) => (
        <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
          {val || 'Moderate'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1">
          {onEdit && (
            <button
              onClick={() => onEdit(row)}
              className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Edit"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(row.id)}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              title="Delete"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={investments} emptyMessage="No investment assets recorded." />
}

export default PortfolioTable
