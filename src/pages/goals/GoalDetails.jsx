import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit2,
  Trash2,
  Target,
  Calendar,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  DollarSign,
  Plus,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import { formatDate } from '../../utils/dateUtils'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/cards/StatCard'
import DashboardCard from '../../components/cards/DashboardCard'
import ProgressBar from '../../components/common/ProgressBar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import ConfirmDialog from '../../components/common/ConfirmDialog'

export const GoalDetails = () => {
  const { id } = useParams()
  const { goals, updateGoal, deleteGoal } = useFinance()
  const navigate = useNavigate()

  const [contributeModalOpen, setContributeModalOpen] = useState(false)
  const [contributionAmount, setContributionAmount] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const goal = goals.find((g) => String(g.id) === String(id))

  if (!goal) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Goal not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/goals')} className="mt-4">
          Back to Goals
        </Button>
      </div>
    )
  }

  const { name, type, targetAmount, savedAmount, targetDate, priority, notes } = goal
  const remaining = Math.max(0, targetAmount - savedAmount)
  const percentage = targetAmount > 0 ? Math.min(100, (savedAmount / targetAmount) * 100) : 0
  const isCompleted = savedAmount >= targetAmount

  // Calculate monthly savings required
  const calculateRequiredMonthly = () => {
    if (remaining <= 0) return 0
    const now = new Date()
    const target = new Date(targetDate)
    const diffMonths = Math.max(
      1,
      (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth())
    )
    return Math.round(remaining / diffMonths)
  }

  const requiredMonthlySavings = calculateRequiredMonthly()

  const handleContribute = async (e) => {
    e.preventDefault()
    if (!contributionAmount) return
    const newSaved = Number(savedAmount) + Number(contributionAmount)
    await updateGoal(id, { savedAmount: newSaved })
    setContributionAmount('')
    setContributeModalOpen(false)
  }

  const handleDelete = async () => {
    await deleteGoal(id)
    navigate('/goals')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={name}
        subtitle={`${type} • Target completion by ${formatDate(targetDate)}`}
        breadcrumbs={['Goals', 'Details']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/goals')}
        >
          Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => setContributeModalOpen(true)}
        >
          Add Contribution
        </Button>
        <Button
          variant="secondary"
          size="sm"
          icon={Edit2}
          onClick={() => navigate(`/goals/edit/${id}`)}
        >
          Edit
        </Button>
      </PageHeader>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Target Corpus"
          value={formatCurrency(targetAmount)}
          subtitle="Full target requirement"
          icon={Target}
          colorScheme="brand"
        />
        <StatCard
          title="Saved So Far"
          value={formatCurrency(savedAmount)}
          subtitle={`${percentage.toFixed(0)}% achieved`}
          icon={TrendingUp}
          colorScheme="emerald"
        />
        <StatCard
          title="Remaining Target"
          value={formatCurrency(remaining)}
          subtitle="To reach goal"
          icon={Calendar}
          colorScheme="amber"
        />
        <StatCard
          title="Monthly Required"
          value={formatCurrency(requiredMonthlySavings)}
          subtitle="Per month to finish on time"
          icon={CheckCircle2}
          colorScheme="violet"
        />
      </div>

      {/* Main Goal Progress Card */}
      <DashboardCard title="Milestone Trajectory">
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              {formatCurrency(savedAmount)}{' '}
              <span className="text-xs font-normal text-slate-500">
                accumulated of {formatCurrency(targetAmount)}
              </span>
            </span>
            <span className="text-base font-bold text-brand-600 dark:text-brand-400">
              {percentage.toFixed(1)}% Completed
            </span>
          </div>

          <ProgressBar
            value={savedAmount}
            max={targetAmount}
            color={isCompleted ? 'bg-emerald-500' : 'bg-brand-600'}
            size="lg"
          />

          {isCompleted ? (
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-800 dark:text-emerald-200 font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              <span>🎉 Congratulations! You have achieved 100% of your financial goal milestone!</span>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 text-xs text-blue-800 dark:text-blue-200 flex items-center justify-between">
              <div>
                <p className="font-semibold">Consistent Monthly Savings Needed</p>
                <p className="text-blue-600 dark:text-blue-300 mt-0.5">
                  Save <strong>{formatCurrency(requiredMonthlySavings)}/month</strong> to reach your target by {formatDate(targetDate)}.
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                onClick={() => setContributeModalOpen(true)}
              >
                Deposit Now
              </Button>
            </div>
          )}
        </div>
      </DashboardCard>

      {/* Goal Strategy & Notes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Goal Parameters & Strategy">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Goal Category</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{type}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Priority Level</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{priority} Priority</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Target Maturity Date</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(targetDate)}</span>
            </div>
            <div className="pt-2">
              <span className="text-slate-500 font-medium block mb-1">Notes:</span>
              <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                {notes || 'No specific strategy notes attached to this goal.'}
              </p>
            </div>
          </div>
        </DashboardCard>

        <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-950 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-semibold mb-3">
              <Sparkles className="w-4 h-4 text-amber-300" /> FinSight Smart Plan
            </div>
            <h4 className="text-lg font-bold">Recommended Vehicle</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              For this {priority.toLowerCase()} priority goal maturing on {formatDate(targetDate)}, we suggest setting up an
              automated recurring SIP of <strong>{formatCurrency(requiredMonthlySavings)}</strong> on the 1st of every month
              right after your salary is credited.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-300">
            <span>Probability of Target: 94%</span>
            <span className="font-semibold text-emerald-400">On Track</span>
          </div>
        </div>
      </div>

      {/* Add Contribution Modal */}
      <Modal
        isOpen={contributeModalOpen}
        onClose={() => setContributeModalOpen(false)}
        title="Add Savings Contribution"
        subtitle={`Deposit funds towards "${name}"`}
      >
        <form onSubmit={handleContribute} className="space-y-4">
          <Input
            label="Deposit Amount in INR (₹)"
            type="number"
            placeholder="e.g. 5000"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
            required
          />
          <p className="text-xs text-slate-500">
            Current saved: {formatCurrency(savedAmount)} • Remaining: {formatCurrency(remaining)}
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setContributeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Record Contribution
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Financial Goal"
        message="Are you sure you want to delete this financial goal?"
      />
    </div>
  )
}

export default GoalDetails
