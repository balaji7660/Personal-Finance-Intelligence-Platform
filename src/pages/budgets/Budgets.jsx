import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  PieChart,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Percent,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/cards/StatCard'
import BudgetCard from '../../components/cards/BudgetCard'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'

export const Budgets = () => {
  const { budgets, deleteBudget, updateBudget, addBudget } = useFinance()
  const navigate = useNavigate()

  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const [editingBudget, setEditingBudget] = useState(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const [newBudgetForm, setNewBudgetForm] = useState({
    name: '',
    category: 'Food',
    limit: '',
    spent: '0',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  })

  // Computed metrics
  const totalLimit = budgets.reduce((acc, curr) => acc + Number(curr.limit || 0), 0)
  const totalSpent = budgets.reduce((acc, curr) => acc + Number(curr.spent || 0), 0)
  const remainingBudget = Math.max(0, totalLimit - totalSpent)
  const overallUtilization = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0
  const overspentCount = budgets.filter((b) => b.spent > b.limit).length

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!newBudgetForm.name || !newBudgetForm.limit) return
    await addBudget(newBudgetForm)
    setNewBudgetForm({
      name: '',
      category: 'Food',
      limit: '',
      spent: '0',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    })
    setCreateModalOpen(false)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingBudget) return
    await updateBudget(editingBudget.id, editingBudget)
    setEditingBudget(null)
  }

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteBudget(deleteTargetId)
      setDeleteTargetId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Budget Management"
        subtitle="Set spending guardrails to ensure healthy monthly savings"
        breadcrumbs={['Dashboard', 'Budgets']}
      >
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/budgets/create')}
        >
          Create Budget
        </Button>
      </PageHeader>

      {/* Overspending Global Banner Alert */}
      {overspentCount > 0 && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/60 text-rose-600 flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-rose-900 dark:text-rose-200">
                Budget Alert: {overspentCount} categor{overspentCount === 1 ? 'y has' : 'ies have'} exceeded limit!
              </p>
              <p className="text-xs text-rose-700 dark:text-rose-400">
                Consider rebalancing discretionary spending or allocating excess savings.
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/analytics/budget')}
            className="border-rose-300 text-rose-700 hover:bg-rose-100 hidden sm:inline-flex"
          >
            AI Recommendations
          </Button>
        </div>
      )}

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Budget Limit"
          value={formatCurrency(totalLimit)}
          subtitle="Monthly cap"
          icon={PieChart}
          colorScheme="brand"
        />
        <StatCard
          title="Amount Spent"
          value={formatCurrency(totalSpent)}
          subtitle={`${overallUtilization.toFixed(1)}% utilized`}
          icon={TrendingDown}
          colorScheme="rose"
        />
        <StatCard
          title="Remaining Budget"
          value={formatCurrency(remainingBudget)}
          subtitle="Available for rest of month"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatCard
          title="Utilization Rate"
          value={`${overallUtilization.toFixed(0)}%`}
          subtitle={overallUtilization > 80 ? 'Approaching max' : 'Healthy pace'}
          icon={Percent}
          colorScheme={overallUtilization > 80 ? 'amber' : 'emerald'}
        />
      </div>

      {/* Category Budget Cards Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Category Budgets ({budgets.length})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            icon={Plus}
            onClick={() => setCreateModalOpen(true)}
            className="text-xs font-semibold text-brand-600"
          >
            Quick Add
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={(b) => setEditingBudget(b)}
              onDelete={(id) => setDeleteTargetId(id)}
              onViewDetails={(b) => navigate(`/budgets/${b.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Quick Add Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create Category Budget"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Budget Name"
            placeholder="e.g. Food & Dining Monthly"
            value={newBudgetForm.name}
            onChange={(e) => setNewBudgetForm({ ...newBudgetForm, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={newBudgetForm.category}
              onChange={(e) => setNewBudgetForm({ ...newBudgetForm, category: e.target.value })}
              options={['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Healthcare', 'Entertainment', 'Other']}
            />
            <Input
              label="Monthly Limit (₹)"
              type="number"
              placeholder="e.g. 12000"
              value={newBudgetForm.limit}
              onChange={(e) => setNewBudgetForm({ ...newBudgetForm, limit: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={newBudgetForm.startDate}
              onChange={(e) => setNewBudgetForm({ ...newBudgetForm, startDate: e.target.value })}
              required
            />
            <Input
              label="End Date (Optional)"
              type="date"
              value={newBudgetForm.endDate}
              onChange={(e) => setNewBudgetForm({ ...newBudgetForm, endDate: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Budget Modal */}
      <Modal
        isOpen={!!editingBudget}
        onClose={() => setEditingBudget(null)}
        title="Edit Budget Limit"
      >
        {editingBudget && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Budget Name"
              value={editingBudget.name}
              onChange={(e) => setEditingBudget({ ...editingBudget, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Monthly Limit (₹)"
                type="number"
                value={editingBudget.limit}
                onChange={(e) => setEditingBudget({ ...editingBudget, limit: e.target.value })}
                required
              />
              <Input
                label="Spent So Far (₹)"
                type="number"
                value={editingBudget.spent}
                onChange={(e) => setEditingBudget({ ...editingBudget, spent: e.target.value })}
                required
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setEditingBudget(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Budget"
        message="Are you sure you want to delete this category budget?"
      />
    </div>
  )
}

export default Budgets
