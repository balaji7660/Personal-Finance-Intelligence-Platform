import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Zap,
  Sparkles,
  PieChart,
  Layers,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency, formatPercentage } from '../../utils/currencyFormatter'
import { analyticsService } from '../../services/analyticsService'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/cards/StatCard'
import DashboardCard from '../../components/cards/DashboardCard'
import InvestmentPerformanceChart from '../../components/charts/InvestmentPerformanceChart'
import AssetAllocationChart from '../../components/charts/AssetAllocationChart'
import Button from '../../components/common/Button'

export const InvestmentInsights = () => {
  const { investments } = useFinance()
  const navigate = useNavigate()
  const [investmentData, setInvestmentData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchInvestments = async () => {
      setLoading(true)
      const data = await analyticsService.getInvestmentAnalytics()
      if (data) {
        setInvestmentData(data)
      }
      setLoading(false)
    }
    fetchInvestments()
  }, [])

  if (loading || !investmentData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Investment Insights & Market Diagnostics"
        subtitle="Portfolio health metrics, best & worst performing instruments, and risk concentration analysis"
        breadcrumbs={['Analytics', 'Investment Insights']}
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
          onClick={() => navigate('/investments/portfolio')}
        >
          View Holdings
        </Button>
      </PageHeader>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Best Performer"
          value={investmentData.bestPerformerName}
          subtitle={`${investmentData.bestPerformerReturnPct} (${investmentData.bestPerformerGain})`}
          icon={TrendingUp}
          colorScheme="emerald"
        />
        <StatCard
          title="Worst Performer"
          value={investmentData.worstPerformerName}
          subtitle={`${investmentData.worstPerformerReturnPct} (${investmentData.worstPerformerGain})`}
          icon={TrendingDown}
          colorScheme="amber"
        />
        <StatCard
          title="Diversification Index"
          value={`${(investmentData.diversificationScore || 0).toFixed(1)} / 10`}
          subtitle={investmentData.diversificationSubtitle}
          icon={ShieldCheck}
          colorScheme="brand"
        />
        <StatCard
          title="Portfolio Volatility (Beta)"
          value={(investmentData.portfolioBeta || 0).toFixed(2)}
          subtitle={investmentData.portfolioBetaSubtitle}
          icon={Zap}
          colorScheme="violet"
        />
      </div>

      {/* Intelligence Commentary Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-950 via-slate-900 to-brand-950 text-white shadow-xl flex items-start gap-4">
        <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 flex items-center justify-center flex-shrink-0">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <span className="text-xs uppercase font-bold text-violet-400 tracking-wider">
            Diagnostic Alert
          </span>
          <h3 className="text-lg font-bold mt-0.5">
            "{investmentData.diagnosticAlert?.title}"
          </h3>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
            {investmentData.diagnosticAlert?.message}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard
            title="Portfolio Alpha Trajectory"
            subtitle="Comparing returns against passive index benchmark"
          >
            <InvestmentPerformanceChart height={300} />
          </DashboardCard>
        </div>

        <div>
          <DashboardCard
            title="Asset Distribution"
            subtitle="Instrument mix breakdown"
          >
            <AssetAllocationChart investments={investments} height={300} />
          </DashboardCard>
        </div>
      </div>

      {/* Itemized Asset Insights Table */}
      <DashboardCard
        title="Asset Health & Alpha Matrix"
        subtitle="Individual instrument diagnostics"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Asset</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3 text-right">Invested</th>
                <th className="px-4 py-3 text-right">Current</th>
                <th className="px-4 py-3 text-right">Return %</th>
                <th className="px-4 py-3 text-center">Health Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {investments.length > 0 ? (
                investments.map((inv) => {
                  const ret = inv.currentValue - inv.investedAmount
                  const pct = inv.investedAmount > 0 ? (ret / inv.investedAmount) * 100 : 0
                  return (
                    <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">
                        {inv.name}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{inv.type}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(inv.investedAmount)}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">
                        {formatCurrency(inv.currentValue)}
                      </td>
                      <td className={`px-4 py-3 text-right font-bold ${ret >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400"}`}>
                        {ret >= 0 ? "+" : ""}{formatPercentage(pct)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-semibold ${pct >= 15 ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300" : (pct >= 0 ? "bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300" : "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300")}`}>
                          {pct >= 15 ? "High Yield" : (pct >= 0 ? "Stable Holding" : "Underperforming")}
                        </span>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    No holdings in portfolio. Add investments to begin tracking performance.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  )
}

export default InvestmentInsights
