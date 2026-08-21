import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Printer,
  Target,
  CheckCircle2,
  Calendar,
  TrendingUp,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import { formatDate } from '../../utils/dateUtils'
import { exportToCSV, printReport } from '../../utils/exportUtils'
import PageHeader from '../../components/common/PageHeader'
import DashboardCard from '../../components/cards/DashboardCard'
import StatCard from '../../components/cards/StatCard'
import ProgressBar from '../../components/common/ProgressBar'
import Button from '../../components/common/Button'

export const GoalReport = () => {
  const { goals } = useFinance()
  const navigate = useNavigate()

  const totalTarget = goals.reduce((acc, curr) => acc + Number(curr.targetAmount || 0), 0)
  const totalSaved = goals.reduce((acc, curr) => acc + Number(curr.savedAmount || 0), 0)
  const completedGoals = goals.filter((g) => g.savedAmount >= g.targetAmount).length

  const handleExport = () => {
    exportToCSV(goals, 'FinSight_Goals_Report.csv')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Goals & Milestones Audit Report"
        subtitle="Tracking capital accumulation towards long-term life objectives"
        breadcrumbs={['Reports', 'Goal Report']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/reports')}
        >
          Back
        </Button>
        <Button variant="outline" size="sm" icon={Printer} onClick={printReport}>
          Print
        </Button>
        <Button variant="primary" size="sm" icon={Download} onClick={handleExport}>
          Export CSV
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Target Corpus"
          value={formatCurrency(totalTarget)}
          subtitle="Cumulative target"
          colorScheme="brand"
        />
        <StatCard
          title="Accumulated Savings"
          value={formatCurrency(totalSaved)}
          subtitle="Saved so far"
          colorScheme="emerald"
        />
        <StatCard
          title="Completion Rate"
          value={`${totalTarget > 0 ? ((totalSaved / totalTarget) * 100).toFixed(0) : 0}%`}
          subtitle="Aggregate progress"
          colorScheme="cyan"
        />
        <StatCard
          title="Goals Completed"
          value={`${completedGoals} / ${goals.length}`}
          subtitle="Milestones achieved"
          colorScheme="violet"
        />
      </div>

      <DashboardCard title="Individual Milestone Progress Statement">
        <div className="space-y-6">
          {goals.map((goal) => {
            const pct = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0
            const rem = Math.max(0, goal.targetAmount - goal.savedAmount)
            return (
              <div
                key={goal.id}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {goal.name}
                    </h4>
                    <p className="text-xs text-slate-400">
                      {goal.type} • Priority: <strong className="text-slate-700 dark:text-slate-300">{goal.priority}</strong> • Target Date: {formatDate(goal.targetDate)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(goal.savedAmount)}{' '}
                      <span className="text-xs font-normal text-slate-500">
                        / {formatCurrency(goal.targetAmount)}
                      </span>
                    </span>
                  </div>
                </div>

                <ProgressBar
                  value={goal.savedAmount}
                  max={goal.targetAmount}
                  color={pct >= 100 ? 'bg-emerald-500' : 'bg-brand-600'}
                  size="md"
                />

                <div className="flex justify-between text-xs text-slate-500 pt-1">
                  <span>Progress: <strong>{pct.toFixed(1)}%</strong></span>
                  <span>Remaining: <strong>{formatCurrency(rem)}</strong></span>
                </div>
              </div>
            )
          })}
        </div>
      </DashboardCard>
    </div>
  )
}

export default GoalReport
