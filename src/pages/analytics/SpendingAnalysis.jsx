import React, { useState, useEffect } from 'react'
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
import { analyticsService } from '../../services/analyticsService'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/cards/StatCard'
import DashboardCard from '../../components/cards/DashboardCard'
import ExpenseTrendChart from '../../components/charts/ExpenseTrendChart'
import CategoryPieChart from '../../components/charts/CategoryPieChart'
import Button from '../../components/common/Button'

export const SpendingAnalysis = () => {
  const navigate = useNavigate()
  const [spendingData, setSpendingData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSpending = async () => {
      setLoading(true)
      const data = await analyticsService.getSpendingAnalytics()
      if (data) {
        setSpendingData(data)
      }
      setLoading(false)
    }
    fetchSpending()
  }, [])

  if (loading || !spendingData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    )
  }

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
            "Your highest spending category is {spendingData.highestCategoryName}."
          </h3>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
            You spent {formatCurrency(spendingData.highestCategoryAmount)} ({spendingData.highestCategoryPercentage?.toFixed(1)}% of total spend) on {spendingData.highestCategoryName}.
            Your Month-on-Month spending trend is {spendingData.trendValue} compared to the previous cycle ({spendingData.trendSubtitle}).
          </p>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Highest Category"
          value={spendingData.highestCategoryName}
          subtitle={`${formatCurrency(spendingData.highestCategoryAmount)} (${(spendingData.highestCategoryPercentage || 0).toFixed(1)}% of spend)`}
          icon={ShoppingBag}
          colorScheme="amber"
        />
        <StatCard
          title="Monthly Average"
          value={formatCurrency(spendingData.monthlyAverage)}
          subtitle="Past 6-month average"
          icon={Calendar}
          colorScheme="brand"
        />
        <StatCard
          title="Discretionary vs Fixed"
          value={spendingData.ratioString}
          subtitle="Wants vs Needs ratio"
          icon={Receipt}
          colorScheme="cyan"
        />
        <StatCard
          title="Month-on-Month Trend"
          value={spendingData.trendValue}
          isPositive={spendingData.trendIsPositive}
          subtitle={spendingData.trendSubtitle}
          icon={TrendingUp}
          colorScheme={spendingData.trendIsPositive ? 'emerald' : 'rose'}
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardCard
          title="Category Distribution Analysis"
          subtitle="Where your capital flows across lifestyle and essentials"
        >
          <CategoryPieChart data={spendingData.categorySpending} height={300} />
        </DashboardCard>

        <DashboardCard
          title="6-Month Spending Velocity"
          subtitle="Monitoring expense trajectory against income growth"
        >
          <ExpenseTrendChart
            data={spendingData.monthlyComparison}
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
          {spendingData.outliers && spendingData.outliers.length > 0 ? (
            spendingData.outliers.map((o) => (
              <div key={o.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-rose-100 dark:bg-rose-900/40 text-rose-600 flex items-center justify-center font-bold text-xs">
                    !
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-slate-900 dark:text-white">
                      {o.description} ({formatCurrency(o.amount)})
                    </p>
                    <p className="text-[11px] text-slate-400">
                      Logged on {new Date(o.date).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})} • {o.notes}
                    </p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                  {o.tag}
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-slate-400 text-xs">
              No unusual outlay anomalies detected for this month.
            </div>
          )}
        </div>
      </DashboardCard>
    </div>
  )
}

export default SpendingAnalysis
