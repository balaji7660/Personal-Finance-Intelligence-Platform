import React from 'react'
import { CheckCircle2, Clock } from 'lucide-react'
import { formatCurrency } from '../../utils/currencyFormatter'
import { formatDate } from '../../utils/dateUtils'
import DataTable from '../common/DataTable'

export const RecentTransactionsTable = ({ transactions = [], limit = 5 }) => {
  const displayData = transactions.slice(0, limit)

  const columns = [
    {
      key: 'date',
      label: 'Date',
      render: (val) => <span className="text-xs text-slate-500">{formatDate(val)}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (val, row) => (
        <div>
          <span className="font-semibold text-slate-900 dark:text-white line-clamp-1">{val}</span>
          <span className="text-xs text-slate-400">{row.category}</span>
        </div>
      ),
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      render: (val) => <span className="text-xs text-slate-600 dark:text-slate-400">{val || 'UPI'}</span>,
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          <CheckCircle2 className="w-3 h-3" />
          {val || 'Completed'}
        </span>
      ),
    },
    {
      key: 'amount',
      label: 'Amount',
      align: 'right',
      render: (val) => (
        <span className="font-bold text-slate-900 dark:text-white text-sm">
          -{formatCurrency(val)}
        </span>
      ),
    },
  ]

  return (
    <DataTable
      columns={columns}
      data={displayData}
      emptyMessage="No recent transactions found."
    />
  )
}

export default RecentTransactionsTable
