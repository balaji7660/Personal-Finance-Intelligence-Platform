import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Edit2,
  Trash2,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  Calendar,
  Layers,
  Sparkles,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency, formatPercentage } from '../../utils/currencyFormatter'
import { formatDate } from '../../utils/dateUtils'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/cards/StatCard'
import DashboardCard from '../../components/cards/DashboardCard'
import InvestmentPerformanceChart from '../../components/charts/InvestmentPerformanceChart'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'

export const InvestmentDetails = () => {
  const { id } = useParams()
  const { investments, deleteInvestment } = useFinance()
  const navigate = useNavigate()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const investment = investments.find((i) => String(i.id) === String(id))

  if (!investment) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Investment asset not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/investments')} className="mt-4">
          Back to Investments
        </Button>
      </div>
    )
  }

  const { name, type, investedAmount, currentValue, purchaseDate, quantity, riskLevel, notes } =
    investment
  const returns = currentValue - investedAmount
  const returnPercentage = investedAmount > 0 ? (returns / investedAmount) * 100 : 0
  const isPositive = returns >= 0

  const handleDelete = async () => {
    await deleteInvestment(id)
    navigate('/investments')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={name}
        subtitle={`${type} • Logged on ${formatDate(purchaseDate)}`}
        breadcrumbs={['Investments', 'Details']}
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
          variant="danger"
          size="sm"
          icon={Trash2}
          onClick={() => setShowDeleteConfirm(true)}
        >
          Remove
        </Button>
      </PageHeader>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Capital Invested"
          value={formatCurrency(investedAmount)}
          subtitle="Net cost basis"
          colorScheme="brand"
        />
        <StatCard
          title="Current Valuation"
          value={formatCurrency(currentValue)}
          subtitle="Real-time value"
          colorScheme="violet"
        />
        <StatCard
          title="Total Gain / Loss"
          value={`${isPositive ? '+' : ''}${formatCurrency(returns)}`}
          change={formatPercentage(returnPercentage)}
          isPositive={isPositive}
          subtitle="Unrealized returns"
          colorScheme={isPositive ? 'emerald' : 'rose'}
        />
        <StatCard
          title="Units / Risk"
          value={`${quantity || 1} units`}
          subtitle={`${riskLevel} Risk Profile`}
          colorScheme="cyan"
        />
      </div>

      {/* Asset Performance Chart */}
      <DashboardCard
        title="Asset Trajectory & Benchmark"
        subtitle="Tracking simulated growth trajectory against benchmark indices"
      >
        <InvestmentPerformanceChart height={280} />
      </DashboardCard>

      {/* Notes & Insight */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard title="Investment Details & Thesis">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Asset Category</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{type}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Purchase Date</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{formatDate(purchaseDate)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-800">
              <span className="text-slate-500">Holding Strategy</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">Long-term Compounder</span>
            </div>
            <div className="pt-2">
              <span className="text-slate-500 font-medium block mb-1">Notes:</span>
              <p className="text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                {notes || 'No custom strategy notes provided for this position.'}
              </p>
            </div>
          </div>
        </DashboardCard>

        <div className="p-6 rounded-3xl bg-gradient-to-r from-violet-900 to-indigo-950 text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-violet-300 text-xs font-semibold mb-3">
              <Sparkles className="w-4 h-4 text-amber-300" /> FinSight Intelligence
            </div>
            <h4 className="text-lg font-bold">Performance Summary</h4>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              This asset represents a <strong>{riskLevel.toLowerCase()}</strong> risk profile in your overall
              net worth portfolio. It is delivering an annualized gain of{' '}
              <strong>{formatPercentage(returnPercentage)}</strong>. Continuing systematic monthly contributions
              will help meet your long-term goals comfortably.
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-slate-300">
            <span>Portfolio Weight: ~{(investedAmount > 0 ? 22.4 : 0)}%</span>
            <span className="font-semibold text-emerald-400">Outperforming</span>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Remove Investment Asset"
        message="Are you sure you want to remove this position from your portfolio?"
      />
    </div>
  )
}

export default InvestmentDetails
