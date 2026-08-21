import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, PieChart, Plus, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import PageHeader from '../../components/common/PageHeader'
import DashboardCard from '../../components/cards/DashboardCard'
import AssetAllocationChart from '../../components/charts/AssetAllocationChart'
import ProgressBar from '../../components/common/ProgressBar'
import Button from '../../components/common/Button'

export const AssetAllocation = () => {
  const { investments } = useFinance()
  const navigate = useNavigate()

  const totalValue = investments.reduce((acc, curr) => acc + Number(curr.currentValue || 0), 0)

  // Compute breakdown by type
  const typeBreakdown = {}
  investments.forEach((inv) => {
    const type = inv.type || 'Other'
    typeBreakdown[type] = (typeBreakdown[type] || 0) + Number(inv.currentValue || 0)
  })

  const typeConfig = [
    { type: 'Mutual Funds', ideal: 40, color: '#8b5cf6', barColor: 'bg-violet-500' },
    { type: 'Stocks', ideal: 30, color: '#3b82f6', barColor: 'bg-blue-500' },
    { type: 'ETFs', ideal: 15, color: '#10b981', barColor: 'bg-emerald-500' },
    { type: 'Bonds', ideal: 10, color: '#f59e0b', barColor: 'bg-amber-500' },
    { type: 'Other Investments', ideal: 5, color: '#ec4899', barColor: 'bg-pink-500' },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Asset Allocation & Diversification"
        subtitle="Analyze portfolio diversification across equity, fixed income, and commodities"
        breadcrumbs={['Investments', 'Asset Allocation']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/investments')}
        >
          Back
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/investments/add')}
        >
          Add Asset
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Donut Chart */}
        <div className="lg:col-span-1">
          <DashboardCard
            title="Portfolio Weightage"
            subtitle={`Total valuation: ${formatCurrency(totalValue)}`}
          >
            <AssetAllocationChart investments={investments} height={300} />
          </DashboardCard>
        </div>

        {/* Detailed Breakdown against Target */}
        <div className="lg:col-span-2 space-y-4">
          <DashboardCard
            title="Allocation Targets vs Actuals"
            subtitle="Benchmark target model for moderate risk tolerance"
          >
            <div className="space-y-5">
              {typeConfig.map((item) => {
                const currentVal = typeBreakdown[item.type] || 0
                const actualPct = totalValue > 0 ? (currentVal / totalValue) * 100 : 0
                const diff = actualPct - item.ideal

                return (
                  <div key={item.type} className="space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {item.type}
                        </span>
                        <span className="text-slate-400">({formatCurrency(currentVal)})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {actualPct.toFixed(1)}%
                        </span>
                        <span className="text-slate-400">/ Target: {item.ideal}%</span>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            Math.abs(diff) < 5
                              ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40'
                              : diff > 0
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/40'
                              : 'bg-blue-50 text-blue-600 dark:bg-blue-950/40'
                          }`}
                        >
                          {diff >= 0 ? `+${diff.toFixed(1)}%` : `${diff.toFixed(1)}%`}
                        </span>
                      </div>
                    </div>

                    <ProgressBar
                      value={currentVal}
                      max={totalValue}
                      color={item.barColor}
                      size="sm"
                    />
                  </div>
                )
              })}
            </div>
          </DashboardCard>

          {/* AI Rebalancing Suggestion */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white shadow-xl flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-600/30 text-brand-400 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold">Rebalancing Suggestion</h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Your portfolio currently exhibits a high concentration in Mutual Funds and Equity Stocks (approx. 62%).
                To build defensive buffer against volatility, we suggest allocating your upcoming ₹10,000 monthly
                contribution towards Fixed Income / Bonds or Gold ETFs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AssetAllocation
