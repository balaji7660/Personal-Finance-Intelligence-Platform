import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Receipt,
  Calendar,
  CreditCard,
  TrendingUp,
  Tag,
  Download,
  Filter,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import { exportToCSV } from '../../utils/exportUtils'

import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/cards/StatCard'
import DashboardCard from '../../components/cards/DashboardCard'
import ExpenseTable from '../../components/tables/ExpenseTable'
import CategoryPieChart from '../../components/charts/CategoryPieChart'
import ExpenseTrendChart from '../../components/charts/ExpenseTrendChart'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'

export const Expenses = () => {
  const { expenses, addExpense, updateExpense, deleteExpense } = useFinance()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const [editingExpense, setEditingExpense] = useState(null)

  // Computed metrics
  const totalExpenses = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)
  const avgDaily = expenses.length > 0 ? totalExpenses / 30 : 0
  const highestExp = expenses.length > 0 ? Math.max(...expenses.map((e) => Number(e.amount || 0))) : 0

  // Category counts and charts data
  const categoryTotals = useMemo(() => {
    const map = {}
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + Number(e.amount || 0)
    })
    return map
  }, [expenses])

  const highestSpendingCategory = useMemo(() => {
    let topCat = 'None'
    let topVal = 0
    Object.entries(categoryTotals).forEach(([cat, val]) => {
      if (val > topVal) {
        topVal = val
        topCat = cat
      }
    })
    return { name: topCat, value: topVal }
  }, [categoryTotals])

  const categoryPieData = useMemo(() => {
    const colors = {
      Food: '#f97316',
      Travel: '#06b6d4',
      Shopping: '#ec4899',
      Bills: '#eab308',
      Education: '#8b5cf6',
      Healthcare: '#10b981',
      Entertainment: '#6366f1',
      Other: '#64748b',
    }
    return Object.entries(categoryTotals).map(([name, value]) => ({
      name,
      value,
      color: colors[name] || '#64748b',
    }))
  }, [categoryTotals])

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchSearch =
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        (e.notes && e.notes.toLowerCase().includes(search.toLowerCase()))
      const matchCat = selectedCategory === 'All' || e.category === selectedCategory
      return matchSearch && matchCat
    })
  }, [expenses, search, selectedCategory])

  const handleExportCSV = () => {
    exportToCSV(expenses, 'FinSight_Expenses.csv')
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!editingExpense) return
    await updateExpense(editingExpense.id, editingExpense)
    setEditingExpense(null)
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
        title="Expense Management"
        subtitle="Monitor, analyze, and optimize your day-to-day spending habits"
        breadcrumbs={['Dashboard', 'Expenses']}
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

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(totalExpenses)}
          subtitle="August 2026"
          icon={Receipt}
          colorScheme="rose"
        />
        <StatCard
          title="Daily Average"
          value={formatCurrency(avgDaily)}
          subtitle="Based on 30-day cycle"
          icon={Calendar}
          colorScheme="amber"
        />
        <StatCard
          title="Highest Category"
          value={highestSpendingCategory.name}
          subtitle={formatCurrency(highestSpendingCategory.value)}
          icon={Tag}
          colorScheme="brand"
        />
        <StatCard
          title="Transactions"
          value={expenses.length}
          subtitle="Recorded this month"
          icon={CreditCard}
          colorScheme="emerald"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard
            title="Monthly Expense Trend"
            subtitle="Spending curve over the last 6 months"
          >
            <ExpenseTrendChart
              data={[
                { month: 'Mar', expenses: 39000 },
                { month: 'Apr', expenses: 44000 },
                { month: 'May', expenses: 41000 },
                { month: 'Jun', expenses: 46000 },
                { month: 'Jul', expenses: 40500 },
                { month: 'Aug', expenses: totalExpenses },
              ]}
              height={260}
            />
          </DashboardCard>
        </div>

        <div>
          <DashboardCard
            title="Category Summary"
            subtitle="Distribution of spending"
          >
            <CategoryPieChart data={categoryPieData} height={260} />
          </DashboardCard>
        </div>
      </div>

      {/* Expenses Table with Filters & Search */}
      <DashboardCard
        title="Expense Records"
        subtitle={`Showing ${filteredExpenses.length} transactions`}
        action={
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/expenses/history')}
            className="text-xs font-semibold text-brand-600 dark:text-brand-400"
          >
            Full History View
          </Button>
        }
      >
        <div className="flex flex-col sm:flex-row gap-3 mb-5 items-stretch sm:items-center justify-between">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search description or note..."
            className="w-full sm:w-72"
          />
          <FilterBar
            options={['All', 'Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Healthcare', 'Entertainment', 'Other']}
            activeValue={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        <ExpenseTable
          expenses={filteredExpenses}
          onEdit={(exp) => setEditingExpense(exp)}
          onDelete={(id) => setDeleteTargetId(id)}
        />
      </DashboardCard>

      {/* Edit Expense Modal */}
      <Modal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        title="Edit Expense Record"
      >
        {editingExpense && (
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              label="Description"
              value={editingExpense.description}
              onChange={(e) =>
                setEditingExpense({ ...editingExpense, description: e.target.value })
              }
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Amount (₹)"
                type="number"
                value={editingExpense.amount}
                onChange={(e) =>
                  setEditingExpense({ ...editingExpense, amount: e.target.value })
                }
                required
              />
              <Select
                label="Category"
                value={editingExpense.category}
                onChange={(e) =>
                  setEditingExpense({ ...editingExpense, category: e.target.value })
                }
                options={['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Healthcare', 'Entertainment', 'Other']}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Payment Method"
                value={editingExpense.paymentMethod}
                onChange={(e) =>
                  setEditingExpense({ ...editingExpense, paymentMethod: e.target.value })
                }
                options={['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Other']}
              />
              <Input
                label="Date"
                type="date"
                value={editingExpense.date}
                onChange={(e) =>
                  setEditingExpense({ ...editingExpense, date: e.target.value })
                }
                required
              />
            </div>
            <Input
              label="Notes"
              value={editingExpense.notes || ''}
              onChange={(e) =>
                setEditingExpense({ ...editingExpense, notes: e.target.value })
              }
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setEditingExpense(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Expense Record"
        message="Are you sure you want to delete this expense record? This will adjust your budget utilization as well."
      />
    </div>
  )
}

export default Expenses
