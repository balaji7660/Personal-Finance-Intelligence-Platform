import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Target, CheckCircle2, Calendar, TrendingUp, Sparkles } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/cards/StatCard'
import GoalCard from '../../components/cards/GoalCard'
import FilterBar from '../../components/common/FilterBar'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'

export const Goals = () => {
  const { goals, deleteGoal, updateGoal, addGoal } = useFinance()
  const navigate = useNavigate()

  const [selectedType, setSelectedType] = useState('All')
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const [editingGoal, setEditingGoal] = useState(null)
  const [createModalOpen, setCreateModalOpen] = useState(false)

  const [newGoalForm, setNewGoalForm] = useState({
    name: '',
    type: 'Emergency Fund',
    targetAmount: '',
    savedAmount: '0',
    targetDate: '',
    priority: 'High',
  })

  // Metrics
  const totalTarget = goals.reduce((acc, curr) => acc + Number(curr.targetAmount || 0), 0)
  const totalSaved = goals.reduce((acc, curr) => acc + Number(curr.savedAmount || 0), 0)
  const remainingSavings = Math.max(0, totalTarget - totalSaved)
  const completedGoals = goals.filter((g) => g.savedAmount >= g.targetAmount).length

  const filteredGoals = goals.filter((g) => {
    if (selectedType === 'All') return true
    return g.type === selectedType
  })

  const handleCreateSubmit = async (e) => {
    e.preventDefault()
    if (!newGoalForm.name || !newGoalForm.targetAmount) return
    await addGoal(newGoalForm)
    setNewGoalForm({
      name: '',
      type: 'Emergency Fund',
      targetAmount: '',
      savedAmount: '0',
      targetDate: '',
      priority: 'High',
    })
    setCreateModalOpen(false)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingGoal) return
    await updateGoal(editingGoal.id, editingGoal)
    setEditingGoal(null)
  }

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteGoal(deleteTargetId)
      setDeleteTargetId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Goals & Milestones"
        subtitle="Set strategic life targets, measure savings progress, and stay motivated"
        breadcrumbs={['Dashboard', 'Goals']}
      >
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/goals/create')}
        >
          Create Goal
        </Button>
      </PageHeader>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Target Corpus"
          value={formatCurrency(totalTarget)}
          subtitle="Across all active goals"
          icon={Target}
          colorScheme="brand"
        />
        <StatCard
          title="Total Saved"
          value={formatCurrency(totalSaved)}
          subtitle={`${totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}% achieved`}
          icon={TrendingUp}
          colorScheme="emerald"
        />
        <StatCard
          title="Remaining Target"
          value={formatCurrency(remainingSavings)}
          subtitle="To reach financial independence"
          icon={Calendar}
          colorScheme="amber"
        />
        <StatCard
          title="Completed Goals"
          value={`${completedGoals} / ${goals.length}`}
          subtitle="Milestones achieved"
          icon={CheckCircle2}
          colorScheme="cyan"
        />
      </div>

      {/* Filter and Grid */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Active Financial Goals ({filteredGoals.length})
          </h2>
          <FilterBar
            options={['All', 'Emergency Fund', 'Travel', 'Car', 'House', 'Education', 'Retirement', 'Other']}
            activeValue={selectedType}
            onChange={setSelectedType}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={(g) => setEditingGoal(g)}
              onDelete={(id) => setDeleteTargetId(id)}
              onViewDetails={(g) => navigate(`/goals/${g.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Quick Add Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Financial Goal"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4">
          <Input
            label="Goal Name"
            placeholder="e.g. Dream House Downpayment"
            value={newGoalForm.name}
            onChange={(e) => setNewGoalForm({ ...newGoalForm, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Goal Type"
              value={newGoalForm.type}
              onChange={(e) => setNewGoalForm({ ...newGoalForm, type: e.target.value })}
              options={['Emergency Fund', 'Education', 'Travel', 'Car', 'House', 'Retirement', 'Other']}
            />
            <Select
              label="Priority"
              value={newGoalForm.priority}
              onChange={(e) => setNewGoalForm({ ...newGoalForm, priority: e.target.value })}
              options={['High', 'Medium', 'Low']}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Amount (₹)"
              type="number"
              value={newGoalForm.targetAmount}
              onChange={(e) => setNewGoalForm({ ...newGoalForm, targetAmount: e.target.value })}
              required
            />
            <Input
              label="Saved So Far (₹)"
              type="number"
              value={newGoalForm.savedAmount}
              onChange={(e) => setNewGoalForm({ ...newGoalForm, savedAmount: e.target.value })}
            />
          </div>
          <Input
            label="Target Date"
            type="date"
            value={newGoalForm.targetDate}
            onChange={(e) => setNewGoalForm({ ...newGoalForm, targetDate: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Goal
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingGoal}
        onClose={() => setEditingGoal(null)}
        title="Update Goal Progress"
      >
        {editingGoal && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Goal Name"
              value={editingGoal.name}
              onChange={(e) => setEditingGoal({ ...editingGoal, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Target Amount (₹)"
                type="number"
                value={editingGoal.targetAmount}
                onChange={(e) => setEditingGoal({ ...editingGoal, targetAmount: e.target.value })}
                required
              />
              <Input
                label="Saved Amount (₹)"
                type="number"
                value={editingGoal.savedAmount}
                onChange={(e) => setEditingGoal({ ...editingGoal, savedAmount: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Target Date"
                type="date"
                value={editingGoal.targetDate}
                onChange={(e) => setEditingGoal({ ...editingGoal, targetDate: e.target.value })}
                required
              />
              <Select
                label="Priority"
                value={editingGoal.priority}
                onChange={(e) => setEditingGoal({ ...editingGoal, priority: e.target.value })}
                options={['High', 'Medium', 'Low']}
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setEditingGoal(null)}>
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
        title="Delete Financial Goal"
        message="Are you sure you want to remove this goal from your milestones?"
      />
    </div>
  )
}

export default Goals
