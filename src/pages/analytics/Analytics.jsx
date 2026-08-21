import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Lightbulb,
  Zap,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import { analyticsData } from '../../data/mockData'

import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/cards/StatCard'
import DashboardCard from '../../components/cards/DashboardCard'
import IncomeExpenseChart from '../../components/charts/IncomeExpenseChart'
import ExpenseTrendChart from '../../components/charts/ExpenseTrendChart'
import CategoryPieChart from '../../components/charts/CategoryPieChart'
import HealthScoreGauge from '../../components/charts/HealthScoreGauge'
import Button from '../../components/common/Button'

export const Analytics = () => {
  const { metrics } = useFinance()
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Analytics & Intelligence"
        subtitle="Holistic insights, spending trends, AI-driven budget recommendations, and portfolio diagnostics"
        breadcrumbs={['Dashboard', 'Analytics']}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/analytics/spending')}
          >
            Spending
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/analytics/budget')}
          >
            Budgeting
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/analytics/investments')}
          >
            Investments
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/analytics/financial-health')}
          >
            Health Score
          </Button>
        </div>
      </PageHeader>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Financial Health"
          value="78 / 100"
          subtitle="Top tier stability"
          icon={Activity}
          colorScheme="brand"
          onClick={() => navigate('/analytics/financial-health')}
        />
        <StatCard
          title="Monthly Savings Rate"
          value="43.3%"
          subtitle="₹32,500 retained"
          icon={TrendingUp}
          colorScheme="emerald"
          onClick={() => navigate('/analytics/budget')}
        />
        <StatCard
          title="Budget Adherence"
          value="72% Utilized"
          subtitle="Within recommended limit"
          icon={PieChart}
          colorScheme="cyan"
          onClick={() => navigate('/analytics/budget')}
        />
        <StatCard
          title="Portfolio Alpha"
          value="+4.8%"
          subtitle="Beating benchmark"
          icon={Zap}
          colorScheme="violet"
          onClick={() => navigate('/analytics/investments')}
        />
      </div>

      {/* AI Intelligence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {analyticsData.aiRecommendations.map((rec, index) => (
          <div
            key={index}
            className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 shadow-card flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 text-xs font-bold uppercase tracking-wider mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>{rec.title}</span>
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mb-1.5">
                {rec.insight}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                {rec.recommendation}
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
              <span className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 inline-flex items-center gap-1 cursor-pointer hover:underline">
                Explore recommendation <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard
            title="6-Month Income vs Expenditure Trend"
            subtitle="Comparing monthly income inflows against total outlays"
          >
            <IncomeExpenseChart data={analyticsData.monthlyComparison} height={300} />
          </DashboardCard>
        </div>

        <div>
          <DashboardCard
            title="Health Score Breakdown"
            subtitle="Weighted performance analysis"
          >
            <HealthScoreGauge score={78} />
          </DashboardCard>
        </div>
      </div>

      {/* Navigation Quick Jump Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => navigate('/analytics/spending')}
          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card hover:shadow-card-hover hover:border-brand-500 transition-all cursor-pointer group"
        >
          <BarChart3 className="w-6 h-6 text-brand-600 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Spending Analysis</h4>
          <p className="text-xs text-slate-500 mt-1">
            Detect anomalies, recurring outlays, and category drift.
          </p>
        </div>

        <div
          onClick={() => navigate('/analytics/budget')}
          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card hover:shadow-card-hover hover:border-brand-500 transition-all cursor-pointer group"
        >
          <PieChart className="w-6 h-6 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Budget Recommendations</h4>
          <p className="text-xs text-slate-500 mt-1">
            Dynamic monthly budget ceilings generated from spending habits.
          </p>
        </div>

        <div
          onClick={() => navigate('/analytics/investments')}
          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card hover:shadow-card-hover hover:border-brand-500 transition-all cursor-pointer group"
        >
          <TrendingUp className="w-6 h-6 text-violet-600 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Investment Insights</h4>
          <p className="text-xs text-slate-500 mt-1">
            Diversification benchmarks, alpha metrics, and rebalancing alerts.
          </p>
        </div>

        <div
          onClick={() => navigate('/analytics/financial-health')}
          className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-card hover:shadow-card-hover hover:border-brand-500 transition-all cursor-pointer group"
        >
          <Activity className="w-6 h-6 text-rose-600 mb-2 group-hover:scale-110 transition-transform" />
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">Financial Health Score</h4>
          <p className="text-xs text-slate-500 mt-1">
            Comprehensive 100-point diagnostic of your balance sheet.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Analytics
