import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  TrendingUp,
  PieChart,
  ShieldCheck,
  Percent,
  Wallet,
  ArrowRight,
  Download,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency, formatPercentage } from '../../utils/currencyFormatter'
import { exportToCSV } from '../../utils/exportUtils'

import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/cards/StatCard'
import DashboardCard from '../../components/cards/DashboardCard'
import InvestmentCard from '../../components/cards/InvestmentCard'
import PortfolioTable from '../../components/tables/PortfolioTable'
import AssetAllocationChart from '../../components/charts/AssetAllocationChart'
import InvestmentPerformanceChart from '../../components/charts/InvestmentPerformanceChart'
import FilterBar from '../../components/common/FilterBar'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'

export const Investments = () => {
  const { investments, deleteInvestment, updateInvestment, addInvestment } = useFinance()
  const navigate = useNavigate()

  const [selectedType, setSelectedType] = useState('All')
  const [deleteTargetId, setDeleteTargetId] = useState(null)
  const [editingInvestment, setEditingInvestment] = useState(null)

  // Calculations
  const totalInvested = useMemo(
    () => investments.reduce((acc, curr) => acc + Number(curr.investedAmount || 0), 0),
    [investments]
  )
  const currentTotalValue = useMemo(
    () => investments.reduce((acc, curr) => acc + Number(curr.currentValue || 0), 0),
    [investments]
  )
  const totalReturns = currentTotalValue - totalInvested
  const returnPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0

  const filteredInvestments = useMemo(() => {
    if (selectedType === 'All') return investments
    return investments.filter((i) => i.type === selectedType)
  }, [investments, selectedType])

  const handleExportCSV = () => {
    exportToCSV(investments, 'FinSight_Investments.csv')
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    if (!editingInvestment) return
    await updateInvestment(editingInvestment.id, editingInvestment)
    setEditingInvestment(null)
  }

  const handleDeleteConfirm = async () => {
    if (deleteTargetId) {
      await deleteInvestment(deleteTargetId)
      setDeleteTargetId(null)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Investment Portfolio"
        subtitle="Track capital allocation, mutual fund SIPs, stocks, and returns"
        breadcrumbs={['Dashboard', 'Investments']}
      >
        <Button variant="outline" size="sm" icon={Download} onClick={handleExportCSV}>
          Export CSV
        </Button>
        <Button
          variant="primary"
          size="sm"
          icon={Plus}
          onClick={() => navigate('/investments/add')}
        >
          Add Investment
        </Button>
      </PageHeader>

      {/* 5 Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Invested"
          value={formatCurrency(totalInvested)}
          subtitle="Capital invested"
          icon={Wallet}
          colorScheme="brand"
        />
        <StatCard
          title="Current Value"
          value={formatCurrency(currentTotalValue)}
          subtitle="Real-time market value"
          icon={TrendingUp}
          colorScheme="violet"
        />
        <StatCard
          title="Total Returns"
          value={`${totalReturns >= 0 ? '+' : ''}${formatCurrency(totalReturns)}`}
          isPositive={totalReturns >= 0}
          change={formatPercentage(returnPercentage)}
          subtitle="Unrealized gain"
          icon={TrendingUp}
          colorScheme={totalReturns >= 0 ? 'emerald' : 'rose'}
        />
        <StatCard
          title="Return Rate"
          value={formatPercentage(returnPercentage)}
          subtitle="CAGR / Absolute"
          icon={Percent}
          colorScheme="emerald"
        />
        <StatCard
          title="Risk Level"
          value="Moderate"
          subtitle="Balanced asset mix"
          icon={ShieldCheck}
          colorScheme="cyan"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard
            title="Portfolio Growth vs Nifty 50 Index"
            subtitle="Trailing return benchmark comparison"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/investments/portfolio')}
                className="text-xs font-semibold text-brand-600"
              >
                Detailed Portfolio View
              </Button>
            }
          >
            <InvestmentPerformanceChart height={280} />
          </DashboardCard>
        </div>

        <div>
          <DashboardCard
            title="Asset Allocation"
            subtitle="Distribution by instrument type"
            action={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/investments/allocation')}
                className="text-xs font-semibold text-brand-600"
              >
                Allocation Page
              </Button>
            }
          >
            <AssetAllocationChart investments={investments} height={280} />
          </DashboardCard>
        </div>
      </div>

      {/* Investment Assets Grid & Filter */}
      <div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            Holdings & Instruments ({filteredInvestments.length})
          </h2>
          <FilterBar
            options={['All', 'Mutual Funds', 'Stocks', 'ETFs', 'Bonds', 'Other Investments']}
            activeValue={selectedType}
            onChange={setSelectedType}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInvestments.map((inv) => (
            <InvestmentCard
              key={inv.id}
              investment={inv}
              onEdit={(i) => setEditingInvestment(i)}
              onDelete={(id) => setDeleteTargetId(id)}
              onViewDetails={(i) => navigate(`/investments/${i.id}`)}
            />
          ))}
        </div>
      </div>

      {/* Edit Investment Modal */}
      <Modal
        isOpen={!!editingInvestment}
        onClose={() => setEditingInvestment(null)}
        title="Edit Investment Holding"
      >
        {editingInvestment && (
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <Input
              label="Asset Name"
              value={editingInvestment.name}
              onChange={(e) =>
                setEditingInvestment({ ...editingInvestment, name: e.target.value })
              }
              required
            />
            <div className="grid grid-cols-2 gap-3">
              <Select
                label="Asset Type"
                value={editingInvestment.type}
                onChange={(e) =>
                  setEditingInvestment({ ...editingInvestment, type: e.target.value })
                }
                options={['Mutual Funds', 'Stocks', 'ETFs', 'Bonds', 'Other Investments']}
              />
              <Select
                label="Risk Level"
                value={editingInvestment.riskLevel}
                onChange={(e) =>
                  setEditingInvestment({ ...editingInvestment, riskLevel: e.target.value })
                }
                options={['Low', 'Moderate', 'High']}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Invested Amount (₹)"
                type="number"
                value={editingInvestment.investedAmount}
                onChange={(e) =>
                  setEditingInvestment({ ...editingInvestment, investedAmount: e.target.value })
                }
                required
              />
              <Input
                label="Current Value (₹)"
                type="number"
                value={editingInvestment.currentValue}
                onChange={(e) =>
                  setEditingInvestment({ ...editingInvestment, currentValue: e.target.value })
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Quantity / Units"
                type="number"
                step="any"
                value={editingInvestment.quantity || ''}
                onChange={(e) =>
                  setEditingInvestment({ ...editingInvestment, quantity: e.target.value })
                }
              />
              <Input
                label="Purchase Date"
                type="date"
                value={editingInvestment.purchaseDate || ''}
                onChange={(e) =>
                  setEditingInvestment({ ...editingInvestment, purchaseDate: e.target.value })
                }
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="secondary" onClick={() => setEditingInvestment(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary">
                Save Changes
              </Button>
            </div>
          </form>
        )}
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Investment Asset"
        message="Are you sure you want to remove this asset from your portfolio tracking?"
      />
    </div>
  )
}

export default Investments
