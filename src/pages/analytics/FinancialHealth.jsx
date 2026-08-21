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
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { analyticsData } from '../../data/mockData'
import PageHeader from '../../components/common/PageHeader'
import DashboardCard from '../../components/cards/DashboardCard'
import StatCard from '../../components/cards/StatCard'
import HealthScoreGauge from '../../components/charts/HealthScoreGauge'
import ProgressBar from '../../components/common/ProgressBar'
import Button from '../../components/common/Button'

export const FinancialHealth = () => {
  const { metrics } = useFinance()
  const navigate = useNavigate()

  const pillars = [
    {
      name: 'Savings & Liquidity Ratio',
      score: 80,
      benchmark: 70,
      description: 'Your 43.3% savings rate exceeds the 20% national benchmark comfortably.',
      icon: TrendingUp,
      status: 'Excellent',
    },
    {
      name: 'Budget & Outlay Discipline',
      score: 75,
      benchmark: 70,
      description: 'Monthly expenses remain within 72% of total allocated budget.',
      icon: PieChart,
      status: 'Good',
    },
    {
      name: 'Investments & Diversification',
      score: 82,
      benchmark: 75,
      description: 'Multi-asset allocation across Mutual Funds, Equities, Gold & Sovereign Bonds.',
      icon: Award,
      status: 'Excellent',
    },
    {
      name: 'Debt & Liability Management',
      score: 70,
      benchmark: 65,
      description: 'Zero high-interest consumer debt or revolving credit card balances.',
      icon: ShieldCheck,
      status: 'Healthy',
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Health Score & Diagnostics"
        subtitle="Holistic 100-point composite assessment measuring balance sheet strength and longevity"
        breadcrumbs={['Analytics', 'Financial Health']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/analytics')}
        >
          Back
        </Button>
      </PageHeader>

      {/* Main Score Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xl text-center">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">
            Composite FinSight Score
          </h2>
          <HealthScoreGauge score={78} max={100} />
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
            Top 15% percentile among salaried professionals in India
          </p>
        </div>

        <div className="lg:col-span-2 p-8 rounded-3xl bg-gradient-to-r from-brand-900 via-slate-900 to-indigo-950 text-white shadow-xl flex flex-col justify-between h-full">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-semibold mb-3">
              <Sparkles className="w-4 h-4 text-amber-300" /> Executive Financial Diagnostic
            </div>
            <h3 className="text-2xl font-extrabold tracking-tight">
              Grade A: Financially Resilient & Growth-Oriented
            </h3>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              Your overall financial foundation is sound. You have high liquid buffers, low fixed liabilities,
              and consistent investment SIP allocations. To reach an elite score of <strong>90+</strong>, focus on
              completing your 6-Month Emergency Buffer Fund and reallocating 10% towards defensive debt instruments.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 mt-6 border-t border-white/10 text-center">
            <div>
              <span className="text-xs text-slate-400">Emergency Fund</span>
              <p className="text-base font-bold text-white mt-0.5">4.4 Months</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Savings Rate</span>
              <p className="text-base font-bold text-emerald-400 mt-0.5">43.3%</p>
            </div>
            <div>
              <span className="text-xs text-slate-400">Debt-to-Income</span>
              <p className="text-base font-bold text-white mt-0.5">0.0%</p>
            </div>
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
            return (
              <div
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                          {pillar.name}
                        </h4>
                        <span className="text-[11px] text-slate-400">Benchmark: {pillar.benchmark}%</span>
                      </div>
                    </div>
                    <span className="text-sm font-extrabold text-brand-600 dark:text-brand-400">
                      {pillar.score}%
                    </span>
                  </div>

                  <ProgressBar
                    value={pillar.score}
                    max={100}
                    color={pillar.score >= 80 ? 'bg-emerald-500' : 'bg-brand-600'}
                    size="md"
                  />

                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Status</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {pillar.status}
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
