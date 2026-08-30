import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  PieChart,
  Lightbulb,
  CheckCircle2,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import { analyticsService } from '../../services/analyticsService'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/cards/StatCard'
import DashboardCard from '../../components/cards/DashboardCard'
import ProgressBar from '../../components/common/ProgressBar'
import Button from '../../components/common/Button'

export const BudgetRecommendations = () => {
  const { metrics, budgets, updateBudget, addBudget, showToast } = useFinance()
  const navigate = useNavigate()
  const [budgetData, setBudgetData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState({})

  const handleApply = async (item) => {
    setApplying((prev) => ({ ...prev, [item.category]: true }))
    try {
      const existingBudget = budgets.find(
        (b) => b.category.toLowerCase() === item.category.toLowerCase()
      )
      if (existingBudget) {
        await updateBudget(existingBudget.id, {
          ...existingBudget,
          limit: item.recommendedLimit,
        })
      } else {
        await addBudget({
          name: `${item.category} Budget`,
          category: item.category,
          limit: item.recommendedLimit,
          spent: item.currentSpend,
          startDate: new Date().toISOString().split('T')[0],
        })
      }
    } catch (err) {
      console.error('Failed to apply budget recommendation:', err)
    } finally {
      setApplying((prev) => ({ ...prev, [item.category]: false }))
    }
  }

  useEffect(() => {
    const fetchBudget = async () => {
      setLoading(true)
      const data = await analyticsService.getBudgetAnalytics()
      if (data) {
        setBudgetData(data)
      }
      setLoading(false)
    }
    fetchBudget()
  }, [])

  if (loading || !budgetData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    )
  }

  const savingsRate = metrics.totalIncome > 0 ? (budgetData.suggestedMonthlySavings / metrics.totalIncome) * 100 : 0

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI-Powered Budget Recommendations"
        subtitle="Optimized spending limits calculated from your cash flow and target savings goals"
        breadcrumbs={['Analytics', 'Budget Recommendations']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/analytics')}
        >
          Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/budgets')}
        >
          Manage Active Budgets
        </Button>
      </PageHeader>

      {/* Suggested Targets Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Recommended Monthly Budget"
          value={formatCurrency(budgetData.recommendedMonthlyBudget)}
          subtitle={`Optimal cap for ${formatCurrency(metrics.totalIncome)} income`}
          icon={PieChart}
          colorScheme="brand"
        />
        <StatCard
          title="Suggested Monthly Savings"
          value={formatCurrency(budgetData.suggestedMonthlySavings)}
          subtitle={`${savingsRate.toFixed(1)}% target rate`}
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatCard
          title="Potential Monthly Savings"
          value={formatCurrency(budgetData.potentialMonthlySavings)}
          subtitle="By optimizing category caps"
          icon={TrendingDown}
          colorScheme="cyan"
        />
        <StatCard
          title="Overspending Alert"
          value={budgetData.overspendingCategoriesCount > 0 ? `${budgetData.overspendingCategoriesCount} Categories` : 'Healthy'}
          subtitle={budgetData.overspendingCategoriesCount > 0 ? 'Need limit reduction' : 'All budgets within limit'}
          icon={ShieldAlert}
          colorScheme={budgetData.overspendingCategoriesCount > 0 ? 'rose' : 'emerald'}
        />
      </div>

      {/* Recommended Category Allocations */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Suggested Category Adjustments
        </h2>

        {budgetData.recommendedBudgets && budgetData.recommendedBudgets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {budgetData.recommendedBudgets.map((item, idx) => (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">{item.category}</h3>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                      {item.action}
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs text-slate-500">
                      Current Spend: <strong className={item.currentSpend > item.recommendedLimit ? "text-rose-600 dark:text-rose-400" : "text-slate-600 dark:text-slate-400"}>{formatCurrency(item.currentSpend)}</strong>
                    </span>
                    <span className="text-xs text-slate-500">
                      Recommended Cap: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(item.recommendedLimit)}</strong>
                    </span>
                  </div>

                  <ProgressBar
                    value={item.currentSpend}
                    max={item.recommendedLimit || 1}
                    color={item.currentSpend > item.recommendedLimit ? 'bg-rose-500' : 'bg-emerald-500'}
                    size="md"
                  />

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                    {item.rationale}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleApply(item)}
                    loading={applying[item.category]}
                    className="text-xs"
                  >
                    Apply to Budget
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 text-slate-400 text-sm">
            Create budgets to receive personalized optimization recommendations.
          </div>
        )}
      </div>

      {/* 50-30-20 Rule Analysis */}
      <DashboardCard
        title="50 / 30 / 20 Rule Alignment"
        subtitle="Comparing your current spending allocation against gold-standard personal finance frameworks"
      >
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span>Needs (Essentials: Bills, Rent, Healthcare)</span>
              <span>
                {budgetData.needsPct.toFixed(1)}% (Ideal: 50% max) —{' '}
                <span className={budgetData.needsPct <= 50 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                  {budgetData.needsPct <= 50 ? 'Well Optimized' : 'Needs Optimization'}
                </span>
              </span>
            </div>
            <ProgressBar value={budgetData.needsPct} max={100} color="bg-blue-500" size="md" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span>Wants (Dining, Shopping, Movies)</span>
              <span>
                {budgetData.wantsPct.toFixed(1)}% (Ideal: 30% max) —{' '}
                <span className={budgetData.wantsPct <= 30 ? 'text-emerald-600 font-bold' : 'text-rose-600 font-bold'}>
                  {budgetData.wantsPct <= 30 ? 'On Target' : 'Exceeds Budget'}
                </span>
              </span>
            </div>
            <ProgressBar value={budgetData.wantsPct} max={100} color="bg-amber-500" size="md" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span>Savings & Investments (Wealth Creation)</span>
              <span>
                {budgetData.savingsPct.toFixed(1)}% (Ideal: 20% min) —{' '}
                <span className={budgetData.savingsPct >= 20 ? 'text-emerald-600 font-bold' : 'text-amber-600 font-bold'}>
                  {budgetData.savingsPct >= 20 ? 'Outstanding!' : 'Below Target'}
                </span>
              </span>
            </div>
            <ProgressBar value={budgetData.savingsPct} max={100} color="bg-emerald-500" size="md" />
          </div>
        </div>
      </DashboardCard>
    </div>
  )
}

export default BudgetRecommendations
