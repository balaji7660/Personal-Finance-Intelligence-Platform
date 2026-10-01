import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  TrendingUp,
  AlertTriangle,
  Receipt,
  Calendar,
  Sparkles,
  ShoppingBag,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import { analyticsData } from '../../data/mockData'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/cards/StatCard'
import DashboardCard from '../../components/cards/DashboardCard'
import ExpenseTrendChart from '../../components/charts/ExpenseTrendChart'
import CategoryPieChart from '../../components/charts/CategoryPieChart'
import Button from '../../components/common/Button'

export const SpendingAnalysis = () => {
  const { expenses } = useFinance()
  const navigate = useNavigate()

  const totalSpent = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)

  return (
    <div className="space-y-6">
      <PageHeader
        title="Spending Intelligence & Behavior"
        subtitle="Deep dive into recurring patterns, highest spending categories, and unusual transactions"
        breadcrumbs={['Analytics', 'Spending Analysis']}
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

      {/* Insight Highlight Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-orange-950 via-slate-900 to-indigo-950 text-white shadow-xl flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold text-orange-400 tracking-wider">
            Behavioral Insight
          </span>
          <h3 className="text-lg font-bold mt-0.5">
            "Your food and dining expenses increased by 18% compared with last month."
          </h3>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
            Frequent weekend food deliveries and high-ticket restaurant orders on Fridays contributed to 42%
            of this variance. Planning home meals for two extra weekdays would reduce this outflow by ₹2,800.
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Highest Category"
          value="Food & Dining"
          subtitle="₹9,850 (23.2% of spend)"
          icon={ShoppingBag}
          colorScheme="amber"
        />
        <StatCard
          title="Monthly Average"
          value={formatCurrency(41800)}
          subtitle="Past 6-month average"
          icon={Calendar}
          colorScheme="brand"
        />
        <StatCard
          title="Discretionary vs Fixed"
          value="38% / 62%"
          subtitle="Healthy ratio"
          icon={Receipt}
          colorScheme="cyan"
        />
        <StatCard
          title="Month-on-Month Trend"
          value="+4.9%"
          isPositive={false}
          subtitle="vs ₹40,500 in July"
          icon={TrendingUp}
          colorScheme="rose"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Category Distribution Analysis"
          subtitle="Where your capital flows across lifestyle and essentials"
        >
          <CategoryPieChart data={analyticsData.categorySpending} height={300} />
        </DashboardCard>

        <DashboardCard
          title="6-Month Spending Velocity"
          subtitle="Monitoring expense trajectory against income growth"
        >
          <ExpenseTrendChart
            data={[
              { month: 'Mar', expenses: 39000 },
              { month: 'Apr', expenses: 44000 },
              { month: 'May', expenses: 41000 },
              { month: 'Jun', expenses: 46000 },
              { month: 'Jul', expenses: 40500 },
              { month: 'Aug', expenses: totalSpent },
            ]}
            height={300}
          />
        </DashboardCard>
      </div>

      {/* Unusual Outlays & Anomalies List */}
      <DashboardCard
        title="Detected Outlier Transactions"
        subtitle="Expenses that significantly deviated from your rolling 30-day median"
      >
        <div className="space-y-3">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center font-bold text-xs">
                !
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Cult.fit Quarterly Gym Membership (₹6,500)
                </p>
                <p className="text-[11px] text-slate-400">
                  Logged on Aug 5 • 3.2x higher than typical weekly healthcare expenditure
                </p>
              </div>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              One-off Annual
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-600 flex items-center justify-center font-bold text-xs">
                !
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Amazon Festival Sale Purchase (₹4,850)
                </p>
                <p className="text-[11px] text-slate-400">
                  Logged on Aug 18 • Non-recurring shopping outlay
                </p>
              </div>
            </div>
            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
              Discretionary
            </span>
          </div>
        </div>
      </DashboardCard>
    </div>
  )
}

export default SpendingAnalysis
