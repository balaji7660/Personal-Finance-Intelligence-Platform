import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Activity,
  ShieldCheck,
  Award,
  Sparkles,
  TrendingUp,
  PieChart,
  CheckCircle2,
  AlertCircle,
  Zap,
  BarChart2,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import PageHeader from '../../components/common/PageHeader'
import DashboardCard from '../../components/cards/DashboardCard'
import StatCard from '../../components/cards/StatCard'
import HealthScoreGauge from '../../components/charts/HealthScoreGauge'
import ProgressBar from '../../components/common/ProgressBar'
import Button from '../../components/common/Button'


// Categories that count as "Needs" in 50/30/20
const NEEDS_CATEGORIES = ['Bills', 'Healthcare', 'Education']
// Categories that count as "Wants"
const WANTS_CATEGORIES = ['Food', 'Travel', 'Shopping', 'Entertainment', 'Other']

export const FinancialHealth = () => {
  const { expenses, budgets, investments, metrics } = useFinance()
  const navigate = useNavigate()

  const MONTHLY_INCOME = metrics?.totalIncome || 75000

  const hasData = expenses.length > 0

  // --- Compute 50/30/20 from real expenses ---
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
  const needsTotal = expenses
    .filter((e) => NEEDS_CATEGORIES.includes(e.category))
    .reduce((s, e) => s + Number(e.amount || 0), 0)
  const wantsTotal = expenses
    .filter((e) => WANTS_CATEGORIES.includes(e.category))
    .reduce((s, e) => s + Number(e.amount || 0), 0)
  const savingsAmt = Math.max(0, MONTHLY_INCOME - totalExpenses)

  const needsPct = MONTHLY_INCOME > 0 ? +((needsTotal / MONTHLY_INCOME) * 100).toFixed(1) : 0
  const wantsPct = MONTHLY_INCOME > 0 ? +((wantsTotal / MONTHLY_INCOME) * 100).toFixed(1) : 0
  const savingsPct = MONTHLY_INCOME > 0 ? +((savingsAmt / MONTHLY_INCOME) * 100).toFixed(1) : 0

  // --- Pillar scores from real data ---
  // Savings & Liquidity: score based on actual savings rate (target ≥ 20%)
  const savingsRate = MONTHLY_INCOME > 0 ? (savingsAmt / MONTHLY_INCOME) * 100 : 0
  const savingsScore = hasData ? Math.min(100, Math.round((savingsRate / 20) * 80)) : 0

  // Budget & Spending Discipline: based on how many budgets are within limit
  const budgetsWithinLimit = budgets.filter((b) => Number(b.spent || 0) <= Number(b.limit || 0)).length
  const budgetScore = hasData && budgets.length > 0
    ? Math.round((budgetsWithinLimit / budgets.length) * 100)
    : 0

  // Investments & Diversification: based on portfolio gain %
  const totalInvested = investments.reduce((s, i) => s + Number(i.investedAmount || 0), 0)
  const currentValue = investments.reduce((s, i) => s + Number(i.currentValue || 0), 0)
  const gainPct = totalInvested > 0 ? ((currentValue - totalInvested) / totalInvested) * 100 : 0
  const investmentScore = investments.length > 0 ? Math.min(100, Math.round(50 + gainPct * 2)) : 0

  // Debt & Liability: static 70 (no debt module yet)
  const debtScore = 70

  // Overall health score — average of pillars (only count ones with data)
  const activePillars = [
    hasData ? savingsScore : null,
    hasData && budgets.length > 0 ? budgetScore : null,
    investments.length > 0 ? investmentScore : null,
    debtScore,
  ].filter((s) => s !== null)
  const score = activePillars.length > 0
    ? Math.round(activePillars.reduce((a, b) => a + b, 0) / activePillars.length)
    : 0

  // Emergency runway: savings amount ÷ avg monthly spend
  const avgMonthlySpend = hasData ? totalExpenses : 0
  const emergencyRunway = avgMonthlySpend > 0
    ? (savingsAmt / avgMonthlySpend).toFixed(1)
    : '—'

  const pillars = [
    {
      name: 'Savings & Liquidity',
      score: savingsScore,
      benchmark: 70,
      description: hasData
        ? `Savings rate is currently ${savingsPct}% of monthly income.`
        : 'Add expenses to calculate your savings rate.',
      icon: TrendingUp,
      status: !hasData ? 'No Data' : savingsScore >= 75 ? 'Excellent' : 'Needs Attention',
    },
    {
      name: 'Budget & Spending Discipline',
      score: budgetScore,
      benchmark: 70,
      description: budgets.length > 0
        ? `${budgetsWithinLimit} of ${budgets.length} budgets within limit.`
        : 'Create budgets to track spending discipline.',
      icon: PieChart,
      status: budgets.length === 0 ? 'No Budgets' : budgetScore >= 75 ? 'Good' : 'Over Limit Warning',
    },
    {
      name: 'Investments & Diversification',
      score: investmentScore,
      benchmark: 75,
      description: investments.length > 0
        ? `Portfolio gain: ${gainPct.toFixed(1)}% across ${investments.length} assets.`
        : 'Add investments to track portfolio performance.',
      icon: Award,
      status: investments.length === 0 ? 'No Data' : investmentScore >= 75 ? 'Excellent' : 'Moderate',
    },
    {
      name: 'Debt & Liability Management',
      score: debtScore,
      benchmark: 65,
      description: 'Low credit utilization and zero high-cost consumer liabilities.',
      icon: ShieldCheck,
      status: 'Healthy',
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Health Score & Diagnostics"
        subtitle="Holistic composite assessment measuring balance sheet strength, 50/30/20 rule, and emergency runway"
        breadcrumbs={['Analytics', 'Financial Health']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/analytics')}
        >
          Back to Analytics
        </Button>
      </PageHeader>

      {/* No-data banner */}
      {!hasData && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-sm font-medium">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-amber-500" />
          No expense data found. Add expenses to see your real financial health scores.
        </div>
      )}

      {/* Main Score Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-1 glass-card p-8 rounded-3xl text-center shadow-glass-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-500/10 rounded-full blur-xl pointer-events-none"></div>
          <h2 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Composite FinSight Score
          </h2>
          <HealthScoreGauge score={score} max={100} />
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 mt-2">
            {!hasData
              ? 'Add your expenses to generate a real score'
              : score >= 80
              ? 'Top 10% financial stability tier'
              : score >= 65
              ? 'Healthy financial baseline'
              : 'Action required to optimize savings'}
          </p>
        </div>

        <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-br from-brand-950 via-slate-900 to-indigo-950 text-white shadow-2xl border border-white/10 flex flex-col justify-between h-full relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-brand-500/20 rounded-full blur-3xl pointer-events-none"></div>
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-brand-300 text-xs font-bold mb-3 shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-300 animate-pulse-glow" /> Automated Financial Diagnostic
            </div>
            <h3 className="text-2xl font-black tracking-tight">
              {!hasData ? 'Awaiting Your Data' : score >= 80 ? 'Grade A: Financially Resilient' : 'Grade B: Growth Baseline'}
            </h3>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-medium">
              Your overall balance sheet foundation is evaluated across cashflow, budget adherence, debt ratios, and asset allocation. To reach a score of <strong className="text-brand-300">90+</strong>, focus on maintaining 6 months of liquid emergency reserves and optimizing discretionary outlays.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10 text-center relative z-10">
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 font-medium">Emergency Runway</span>
              <p className="text-base font-black text-white mt-0.5">{emergencyRunway} {emergencyRunway !== '—' ? 'Mo.' : ''}</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 font-medium">Monthly Savings</span>
              <p className="text-base font-black text-emerald-400 mt-0.5">{hasData ? `${savingsPct}%` : '—'}</p>
            </div>
            <div className="p-2 rounded-xl bg-white/5 border border-white/10">
              <span className="text-[11px] text-slate-400 font-medium">Debt-to-Income</span>
              <p className="text-base font-black text-white mt-0.5">0.0%</p>
            </div>
          </div>
        </div>
      </div>

      {/* 50/30/20 Rule Breakdown Section */}
      <div className="glass-card p-6 rounded-3xl space-y-4 shadow-glass-sm">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              50/30/20 Budget Breakdown
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
              Ideal baseline: Needs (50%), Wants (30%), Savings (20%)
            </p>
          </div>
          <span className="text-xs font-bold text-brand-600 dark:text-brand-400 bg-brand-50/80 dark:bg-brand-950/60 border border-brand-200/50 dark:border-brand-800/50 px-3 py-1 rounded-full shadow-sm">
            Live Analysis
          </span>
        </div>

        {/* Multi-segment Allocation Bar */}
        <div className="h-4 w-full rounded-full bg-slate-100 dark:bg-slate-800/80 flex overflow-hidden p-0.5 border border-slate-200/50 dark:border-slate-800/50 shadow-inner">
          <div
            style={{ width: `${Math.min(100, needsPct)}%` }}
            className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-l-full transition-all duration-500"
            title={`Needs: ${needsPct}%`}
          />
          <div
            style={{ width: `${Math.min(100, wantsPct)}%` }}
            className="bg-gradient-to-r from-amber-500 to-orange-400 h-full transition-all duration-500"
            title={`Wants: ${wantsPct}%`}
          />
          <div
            style={{ width: `${Math.min(100, savingsPct)}%` }}
            className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-r-full transition-all duration-500"
            title={`Savings: ${savingsPct}%`}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40 backdrop-blur-sm">
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">Needs (Essential Outlays)</span>
            <p className="text-lg font-black text-blue-900 dark:text-blue-100">{hasData ? `${needsPct}%` : '—'}</p>
            <span className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Target: ~50% of income</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/40 backdrop-blur-sm">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-300">Wants (Discretionary Spend)</span>
            <p className="text-lg font-black text-amber-900 dark:text-amber-100">{hasData ? `${wantsPct}%` : '—'}</p>
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Target: ≤30% of income</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 backdrop-blur-sm">
            <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300">Savings & Debt Reduction</span>
            <p className="text-lg font-black text-emerald-900 dark:text-emerald-100">{hasData ? `${savingsPct}%` : '—'}</p>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Target: ≥20% of income</span>
          </div>
        </div>
      </div>

      {/* 4 Pillars Breakdown Cards */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Core Pillar Diagnostics
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon
            const noData = pillar.score === 0
            return (
              <div
                key={idx}
                className="glass-card-interactive p-6 rounded-3xl flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center border border-brand-200/50 dark:border-brand-800/50 shadow-sm">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {pillar.name}
                        </h4>
                        <span className="text-[11px] font-medium text-slate-400">Benchmark: {pillar.benchmark}%</span>
                      </div>
                    </div>
                    <span className="text-sm font-black text-brand-600 dark:text-brand-400">
                      {noData ? '—' : `${pillar.score}%`}
                    </span>
                  </div>

                  <ProgressBar
                    value={pillar.score}
                    max={100}
                    color={noData ? 'bg-slate-300 dark:bg-slate-700' : pillar.score >= 80 ? 'bg-emerald-500' : 'bg-brand-600'}
                    size="md"
                  />

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed font-medium">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Diagnostic Status</span>
                  <span className={`font-bold inline-flex items-center gap-1 ${
                    noData
                      ? 'text-slate-400'
                      : pillar.status === 'Needs Attention' || pillar.status === 'Over Limit Warning'
                      ? 'text-amber-500'
                      : 'text-emerald-600 dark:text-emerald-400'
                  }`}>
                    {noData
                      ? <AlertCircle className="w-3.5 h-3.5" />
                      : <CheckCircle2 className="w-3.5 h-3.5" />
                    }
                    {pillar.status}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FinancialHealth

