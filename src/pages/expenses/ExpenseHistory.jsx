import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Download, ArrowUpDown, Filter, Search } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { exportToCSV } from '../../utils/exportUtils'
import PageHeader from '../../components/common/PageHeader'
import ExpenseTable from '../../components/tables/ExpenseTable'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'

export const ExpenseHistory = () => {
  const { expenses, deleteExpense } = useFinance()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [paymentMethod, setPaymentMethod] = useState('All')
  const [sortBy, setSortBy] = useState('date-desc')
  const [deleteTargetId, setDeleteTargetId] = useState(null)

  const filteredAndSortedExpenses = useMemo(() => {
    let list = expenses.filter((e) => {
      const matchSearch =
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        (e.notes && e.notes.toLowerCase().includes(search.toLowerCase()))
      const matchCat = category === 'All' || e.category === category
      const matchPayment = paymentMethod === 'All' || e.paymentMethod === paymentMethod
      return matchSearch && matchCat && matchPayment
    })

    list.sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date)
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date)
      if (sortBy === 'amount-desc') return b.amount - a.amount
      if (sortBy === 'amount-asc') return a.amount - b.amount
      return 0
    })

    return list
  }, [expenses, search, category, paymentMethod, sortBy])

  const handleExportCSV = () => {
    exportToCSV(filteredAndSortedExpenses, 'FinSight_Expense_History.csv')
  }

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteExpense(deleteTargetId)
      setDeleteTargetId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense History & Audit Log"
        subtitle="Complete chronological statement of all outlays and transactions"
        breadcrumbs={['Expenses', 'History']}
      >
        <Button variant="outline" size="sm" icon={Download} onClick={handleExportCSV}>
          Export CSV
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/expenses/add')}
        >
          Add Expense
        </Button>
      </PageHeader>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-card space-y-4">
        {/* Filters Controls */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search all expenses..."
            className="w-full lg:w-72"
          />

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-700 dark:text-slate-300"
            >
              <option value="All">All Payment Methods</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Credit Card</option>
              <option value="Debit Card">Debit Card</option>
              <option value="Cash">Cash</option>
              <option value="Bank Transfer">Bank Transfer</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-700 dark:text-slate-300 font-medium"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>

        <FilterBar
          options={['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Healthcare', 'Entertainment', 'Other']}
          activeValue={category}
          onChange={setCategory}
        />

        <div className="pt-2">
          <ExpenseTable
            expenses={filteredAndSortedExpenses}
            onEdit={(exp) => navigate(`/expenses/edit/${exp.id}`)}
            onDelete={(id) => setDeleteTargetId(id)}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense Record"
        message="Are you sure you want to delete this transaction from history?"
      />
    </div>
  )
}

export default ExpenseHistory
