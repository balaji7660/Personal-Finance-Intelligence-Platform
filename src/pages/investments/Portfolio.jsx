import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Download, TrendingUp, Shield, BarChart3 } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { exportToCSV } from '../../utils/exportUtils'
import { formatCurrency, formatPercentage } from '../../utils/currencyFormatter'
import PageHeader from '../../components/common/PageHeader'
import PortfolioTable from '../../components/tables/PortfolioTable'
import StatCard from '../../components/cards/StatCard'
import DashboardCard from '../../components/cards/DashboardCard'
import SearchBar from '../../components/common/SearchBar'
import FilterBar from '../../components/common/FilterBar'
import Button from '../../components/common/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'

export const Portfolio = () => {
  const { investments, deleteInvestment } = useFinance()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [deleteTargetId, setDeleteTargetId] = useState(null)

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
    return investments.filter((i) => {
      const matchSearch = i.name.toLowerCase().includes(search.toLowerCase())
      const matchType = typeFilter === 'All' || i.type === typeFilter
      return matchSearch && matchType
    })
  }, [investments, search, typeFilter])

  const handleExportCSV = () => {
    exportToCSV(filteredInvestments, 'FinSight_Portfolio_Holdings.csv')
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
        title="Portfolio Holdings & Statement"
        subtitle="Itemized breakdown of all active equity, debt, and gold positions"
        breadcrumbs={['Investments', 'Portfolio']}
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
          Add Position
        </Button>
      </PageHeader>

      {/* 3 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Portfolio Invested"
          value={formatCurrency(totalInvested)}
          subtitle="Net capital deployed"
          colorScheme="brand"
        />
        <StatCard
          title="Total Portfolio Valuation"
          value={formatCurrency(currentTotalValue)}
          subtitle="Current market value"
          colorScheme="violet"
        />
        <StatCard
          title="Unrealized P&L"
          value={`${totalReturns >= 0 ? '+' : ''}${formatCurrency(totalReturns)}`}
          change={formatPercentage(returnPercentage)}
          isPositive={totalReturns >= 0}
          subtitle="Aggregate returns"
          colorScheme={totalReturns >= 0 ? 'emerald' : 'rose'}
        />
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search holding name..."
            className="w-full sm:w-72"
          />
          <FilterBar
            options={['All', 'Mutual Funds', 'Stocks', 'ETFs', 'Bonds', 'Other Investments']}
            activeValue={typeFilter}
            onChange={setTypeFilter}
          />
        </div>

        <div className="pt-2">
          <PortfolioTable
            investments={filteredInvestments}
            onEdit={(inv) => navigate(`/investments/${inv.id}`)}
            onDelete={(id) => setDeleteTargetId(id)}
          />
        </div>
      </div>

      <ConfirmDialog
        isOpen={!!deleteTargetId}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Remove Investment"
        message="Are you sure you want to remove this position?"
      />
    </div>
  )
}

export default Portfolio
