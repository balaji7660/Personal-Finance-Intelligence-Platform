import React, { useState, useEffect, useMemo } from 'react'
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
  Filter,
  AlertTriangle,
  Info,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import { analyticsService } from '../../services/analyticsService'
import { analyticsData } from '../../data/mockData'

import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/cards/StatCard'
import DashboardCard from '../../components/cards/DashboardCard'
import IncomeExpenseChart from '../../components/charts/IncomeExpenseChart'
import HealthScoreGauge from '../../components/charts/HealthScoreGauge'
import Button from '../../components/common/Button'

export const Analytics = () => {
  const { expenses, budgets, investments, metrics, loading: financeLoading } = useFinance()
  const navigate = useNavigate()

  const [healthData, setHealthData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      const data = await analyticsService.getFinancialHealth()
      if (data) {
        setHealthData(data)
      }
      setLoading(false)
    }
    fetchAnalytics()
  }, [])

  const recommendations = healthData?.recommendations || analyticsData.aiRecommendations

  const filteredRecommendations = recommendations.filter((rec) => {
    if (activeFilter === 'all') return true
    if (activeFilter === 'high') return rec.impact === 'high'
    return rec.category === activeFilter
  })

  // Compute metrics fallback from Finance Context
  const totalExp = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
  const totalInc = metrics?.totalIncome || 75000
  const savingsRate = totalInc > 0 ? (((totalInc - totalExp) / totalInc) * 100).toFixed(1) : '0.0'
  const totalBudLimit = budgets.reduce((sum, b) => sum + Number(b.monthlyLimit || b.limit || 0), 0)
  const totalBudSpent = budgets.reduce((sum, b) => sum + Number(b.spent || 0), 0)
  const budAdherence = totalBudLimit > 0 ? Math.round((totalBudSpent / totalBudLimit) * 100) : 0

  // Compute 6-month Income vs Expenses from real expenses
  const monthlyComparison = React.useMemo(() => {
    const now = new Date()
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        month: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        monthNum: d.getMonth(),
        income: totalInc,
        expenses: 0,
        savings: 0,
      })
    }
    expenses.forEach((e) => {
      const d = new Date(e.date)
      const entry = months.find(
        (m) => m.monthNum === d.getMonth() && m.year === d.getFullYear()
      )
      if (entry) entry.expenses += Number(e.amount || 0)
    })
    months.forEach((m) => { m.savings = Math.max(0, m.income - m.expenses) })
    return months
  }, [expenses, totalInc])

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Analytics & AI Intelligence"
        subtitle="Holistic financial diagnostics, 50/30/20 budget analysis, emergency runway, and risk-adjusted advice"
        breadcrumbs={['Dashboard', 'Analytics']}
      >
        <div className="flex flex-wrap items-center gap-2">
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
          title="Financial Health Score"
          value={healthData ? `${healthData.score} / 100` : '78 / 100'}
          subtitle="Multi-factor diagnostic"
          icon={Activity}
          colorScheme="brand"
          onClick={() => navigate('/analytics/financial-health')}
        />
        <StatCard
          title="Monthly Savings Rate"
          value={`${savingsRate}%`}
          subtitle={formatCurrency(Math.max(0, totalInc - totalExp))}
          icon={TrendingUp}
          colorScheme="emerald"
          onClick={() => navigate('/analytics/budget')}
        />
        <StatCard
          title="Budget Adherence"
          value={`${budAdherence}% Utilized`}
          subtitle={budAdherence > 80 ? 'High budget utilization' : 'Within target baseline'}
          icon={PieChart}
          colorScheme="cyan"
          onClick={() => navigate('/analytics/budget')}
        />
        <StatCard
          title="Emergency Runway"
          value={healthData?.emergencyRunwayMonths ? `${healthData.emergencyRunwayMonths} Mo.` : '4.5 Mo.'}
          subtitle="Liquid expense coverage"
          icon={Zap}
          colorScheme="violet"
          onClick={() => navigate('/analytics/financial-health')}
        />
      </div>

      {/* AI Recommendation Engine Header & Filters */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-900 via-brand-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Sparkles className="w-48 h-48 text-brand-400" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-widest mb-1">
                <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                <span>FinSight AI Recommendation Engine</span>
              </div>
              <h3 className="text-xl font-bold text-white">Smart Financial Recommendations</h3>
              <p className="text-xs text-slate-300 mt-1">
                Real-time rule-based financial advice generated from your cashflow, budgets, investments, and risk profile.
              </p>
            </div>

            {/* Category Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-800/80 p-1.5 rounded-2xl border border-slate-700/60 backdrop-blur-md">
              {[
                { id: 'all', label: 'All Advice' },
                { id: 'high', label: 'High Priority' },
                { id: 'spending', label: 'Spending' },
                { id: 'budget', label: 'Budget' },
                { id: 'investment', label: 'Investments' },
                { id: 'emergency', label: 'Emergency' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
                    activeFilter === tab.id
                      ? 'bg-brand-500 text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* AI Intelligence Cards Grid */}
          {filteredRecommendations.length === 0 ? (
            <div className="text-center py-8 bg-slate-800/40 rounded-2xl border border-slate-700/40">
              <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-medium text-slate-300">No recommendations match the selected filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {filteredRecommendations.map((rec, index) => {
                const isHigh = rec.impact === 'high'
                return (
                  <div
                    key={rec.id || index}
                    className={`p-5 rounded-2xl transition-all duration-300 flex flex-col justify-between backdrop-blur-md ${
                      isHigh
                        ? 'bg-rose-950/40 border border-rose-500/40 hover:border-rose-400/80 shadow-lg'
                        : 'bg-slate-800/60 border border-slate-700/80 hover:border-brand-500/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-brand-300 uppercase tracking-wider">
                          <Lightbulb className={`w-4 h-4 ${isHigh ? 'text-rose-400' : 'text-amber-400'}`} />
                          <span className="truncate">{rec.title}</span>
                        </div>
                        {isHigh && (
                          <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" /> High Priority
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-100 mb-1.5 leading-snug">
                        {rec.insight}
                      </p>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {rec.recommendation}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-700/60 flex justify-end">
                      <button
                        onClick={() => navigate(rec.actionUrl || '/analytics/financial-health')}
                        className="text-[11px] font-semibold text-brand-400 hover:text-brand-300 inline-flex items-center gap-1 transition-colors"
                      >
                        Action Details <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard
            title="6-Month Income vs Expenditure Trend"
            subtitle="Comparing monthly income inflows against total outlays"
          >
            <IncomeExpenseChart data={monthlyComparison} height={300} />
          </DashboardCard>
        </div>

        <div>
          <DashboardCard
            title="Financial Health Score Gauge"
            subtitle="Weighted balance sheet assessment"
          >
            <HealthScoreGauge score={healthData?.score || 78} />
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
