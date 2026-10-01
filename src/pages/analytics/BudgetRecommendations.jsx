import React from 'react'
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
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/cards/StatCard'
import DashboardCard from '../../components/cards/DashboardCard'
import ProgressBar from '../../components/common/ProgressBar'
import Button from '../../components/common/Button'

export const BudgetRecommendations = () => {
  const { budgets, metrics } = useFinance()
  const navigate = useNavigate()

  const recommendedBudgets = [
    {
      category: 'Food & Dining',
      currentSpend: 9850,
      recommendedLimit: 7500,
      rationale: 'Over 18% jump in restaurant ordering. Cap at ₹7,500 for optimal cash flow.',
      action: 'Reduce by ₹2,350',
    },
    {
      category: 'Shopping & Retail',
      currentSpend: 7200,
      recommendedLimit: 6000,
      rationale: 'Discretionary retail spend was higher this month due to festival sales.',
      action: 'Cap at ₹6,000',
    },
    {
      category: 'Utility Bills',
      currentSpend: 7700,
      recommendedLimit: 8500,
      rationale: 'Electricity & broadband usage is steady. Set buffer limit at ₹8,500.',
      action: 'Maintain buffer',
    },
    {
      category: 'Healthcare & Fitness',
      currentSpend: 8250,
      recommendedLimit: 4000,
      rationale: 'Cult.fit quarterly fee is amortized. Recurring normal spend should be ₹4,000.',
      action: 'Normalized to ₹4,000',
    },
  ]

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
          value={formatCurrency(40000)}
          subtitle="Optimal cap for ₹75k income"
          icon={PieChart}
          colorScheme="brand"
        />
        <StatCard
          title="Suggested Monthly Savings"
          value={formatCurrency(35000)}
          subtitle="46.6% target rate"
          icon={CheckCircle2}
          colorScheme="emerald"
        />
        <StatCard
          title="Potential Monthly Savings"
          value={formatCurrency(4850)}
          subtitle="By optimizing food & retail"
          icon={TrendingDown}
          colorScheme="cyan"
        />
        <StatCard
          title="Overspending Alert"
          value="2 Categories"
          subtitle="Need immediate limit reduction"
          icon={ShieldAlert}
          colorScheme="rose"
        />
      </div>

      {/* Recommended Category Allocations */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Suggested Category Adjustments
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {recommendedBudgets.map((item, idx) => (
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
                    Current Spend: <strong className="text-rose-600 dark:text-rose-400">{formatCurrency(item.currentSpend)}</strong>
                  </span>
                  <span className="text-xs text-slate-500">
                    Recommended Cap: <strong className="text-emerald-600 dark:text-emerald-400">{formatCurrency(item.recommendedLimit)}</strong>
                  </span>
                </div>

                <ProgressBar
                  value={item.currentSpend}
                  max={item.recommendedLimit}
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
                  onClick={() => navigate('/budgets')}
                  className="text-xs"
                >
                  Apply to Budget
                </Button>
              </div>
            </div>
          ))}
        </div>
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
              <span>32% (Ideal: 50% max) — <span className="text-emerald-600">Well Optimized</span></span>
            </div>
            <ProgressBar value={32} max={100} color="bg-blue-500" size="md" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span>Wants (Dining, Shopping, Movies)</span>
              <span>24.7% (Ideal: 30% max) — <span className="text-emerald-600">On Target</span></span>
            </div>
            <ProgressBar value={24.7} max={100} color="bg-amber-500" size="md" />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span>Savings & Investments (Wealth Creation)</span>
              <span>43.3% (Ideal: 20% min) — <span className="text-emerald-600 font-bold">Outstanding!</span></span>
            </div>
            <ProgressBar value={43.3} max={100} color="bg-emerald-500" size="md" />
          </div>
        </div>
      </DashboardCard>
    </div>
  )
}

export default BudgetRecommendations
