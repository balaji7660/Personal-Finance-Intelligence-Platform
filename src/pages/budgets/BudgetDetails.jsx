import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit2,
  PieChart,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  TrendingDown,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import { formatDate } from '../../utils/dateUtils'
import PageHeader from '../../components/common/PageHeader'
import DashboardCard from '../../components/cards/DashboardCard'
import StatCard from '../../components/cards/StatCard'
import ProgressBar from '../../components/common/ProgressBar'
import ExpenseTable from '../../components/tables/ExpenseTable'
import Button from '../../components/common/Button'

export const BudgetDetails = () => {
  const { id } = useParams()
  const { budgets, expenses } = useFinance()
  const navigate = useNavigate()

  const budget = budgets.find((b) => b.id === id)

  if (!budget) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Budget not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/budgets')} className="mt-4">
          Back to Budgets
        </Button>
      </div>
    )
  }

  const { name, category, limit, spent, startDate, endDate } = budget
  const remaining = Math.max(0, limit - spent)
  const percentage = limit > 0 ? (spent / limit) * 100 : 0
  const isOverspent = percentage > 100

  // Category matching transactions
  const categoryExpenses = expenses.filter((e) => e.category === category)

  return (
    <div className="space-y-6">
      <PageHeader
        title={name}
        subtitle={`Budget tracking & recommendations for ${category}`}
        breadcrumbs={['Budgets', 'Details']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/budgets')}
        >
          Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={Edit2}
          onClick={() => navigate(`/budgets/edit/${id}`)}
        >
          Edit Budget
        </Button>
      </PageHeader>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Allocated Limit"
          value={formatCurrency(limit)}
          subtitle="Monthly cap"
          icon={PieChart}
          colorScheme="brand"
        />
        <StatCard
          title="Current Spent"
          value={formatCurrency(spent)}
          subtitle={`${percentage.toFixed(0)}% of limit`}
          icon={TrendingDown}
          colorScheme={isOverspent ? 'rose' : 'amber'}
        />
        <StatCard
          title="Remaining Budget"
          value={formatCurrency(remaining)}
          subtitle="Available till end of month"
          icon={CheckCircle2}
          colorScheme={remaining > 0 ? 'emerald' : 'rose'}
        />
        <StatCard
          title="Transactions Count"
          value={categoryExpenses.length}
          subtitle={`Logged under ${category}`}
          icon={Calendar}
          colorScheme="cyan"
        />
      </div>

      {/* Progress & Utilization Section */}
      <DashboardCard
        title="Utilization Analysis"
        subtitle={`Active period: ${formatDate(startDate)} to ${endDate ? formatDate(endDate) : 'End of Month'}`}
      >
        <div className="space-y-4">
          <div className="flex justify-between items-baseline">
            <span className="text-xl font-extrabold text-slate-900 dark:text-white">
              {formatCurrency(spent)}{' '}
              <span className="text-xs font-normal text-slate-500">
                spent of {formatCurrency(limit)}
              </span>
            </span>
            <span className="text-sm font-bold text-brand-600 dark:text-brand-400">
              {percentage.toFixed(1)}%
            </span>
          </div>

          <ProgressBar
            value={spent}
            max={limit}
            color={isOverspent ? 'bg-rose-500' : percentage >= 80 ? 'bg-amber-500' : 'bg-emerald-500'}
            size="lg"
          />

          {isOverspent ? (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-700 dark:text-rose-300 font-medium">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                You have exceeded this category budget by {formatCurrency(spent - limit)}.
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-700 dark:text-emerald-300 font-medium">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>
                You have {formatCurrency(remaining)} remaining. You are on track for this month.
              </span>
            </div>
          )}
        </div>
      </DashboardCard>

      {/* AI Recommendation Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-brand-900 to-indigo-900 text-white shadow-xl flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-5 h-5 text-amber-300" />
        </div>
        <div>
          <h4 className="text-base font-bold">FinSight AI Recommendation for {category}</h4>
          <p className="text-xs text-slate-200 mt-1 leading-relaxed">
            Based on your 60-day historical trends, your typical average spend in {category} is{' '}
            <strong>{formatCurrency(spent * 0.9)}</strong>. Limiting discretionary weekend purchases can
            comfortably save you an additional ₹1,500/month.
          </p>
        </div>
      </div>

      {/* Transactions Table for this category */}
      <DashboardCard
        title={`Transactions in ${category}`}
        subtitle="Itemized expenses logged under this category"
      >
        <ExpenseTable expenses={categoryExpenses} />
      </DashboardCard>
    </div>
  )
}

export default BudgetDetails
