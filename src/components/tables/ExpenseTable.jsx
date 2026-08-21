import React from 'react'
import { Edit2, Trash2, Tag, CreditCard, Calendar } from 'lucide-react'
import { formatCurrency } from '../../utils/currencyFormatter'
import { formatDate } from '../../utils/dateUtils'
import DataTable from '../common/DataTable'

const categoryBadgeColors = {
  Food: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-200 dark:border-orange-900',
  Travel: 'bg-cyan-50 text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900',
  Shopping: 'bg-pink-50 text-pink-700 dark:bg-pink-950/60 dark:text-pink-300 border-pink-200 dark:border-pink-900',
  Bills: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950/60 dark:text-yellow-300 border-yellow-200 dark:border-yellow-900',
  Education: 'bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-900',
  Healthcare: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
  Entertainment: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
  Other: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
}

export const ExpenseTable = ({
  expenses = [],
  onEdit,
  onDelete,
}) => {
  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (val) => (
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{formatDate(val)}</span>
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Description',
      render: (val, row) => (
        <div>
          <p className="font-semibold text-slate-900 dark:text-white line-clamp-1">{val}</p>
          {row.notes && <p className="text-xs text-slate-400 line-clamp-1">{row.notes}</p>}
        </div>
      ),
    },
    {
      key: 'category',
      label: 'Category',
      render: (val) => (
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
            categoryBadgeColors[val] || categoryBadgeColors.Other
          }`}
        >
          <Tag className="w-3 h-3" />
          {val}
        </span>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      render: (val) => (
        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
          <CreditCard className="w-3.5 h-3.5" />
          <span className="text-xs">{val || 'UPI'}</span>
        </div>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (val) => (
        <span className="font-bold text-slate-900 dark:text-white text-sm">
          {formatCurrency(val)}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Actions',
      align: 'center',
      render: (_, row) => (
        <div className="flex items-center justify-center gap-1.5">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(row)
              }}
              className="p-1.5 text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Edit Expense"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(row.id)
              }}
              className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Delete Expense"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ),
    },
  ]

  return <DataTable columns={columns} data={expenses} emptyMessage="No expenses found." />
}

export default ExpenseTable
