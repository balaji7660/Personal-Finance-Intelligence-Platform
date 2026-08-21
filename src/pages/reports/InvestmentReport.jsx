import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Printer,
  TrendingUp,
  Wallet,
  ShieldCheck,
  Percent,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency, formatPercentage } from '../../utils/currencyFormatter'
import { exportToCSV, printReport } from '../../utils/exportUtils'
import PageHeader from '../../components/common/PageHeader'
import DashboardCard from '../../components/cards/DashboardCard'
import StatCard from '../../components/cards/StatCard'
import PortfolioTable from '../../components/tables/PortfolioTable'
import AssetAllocationChart from '../../components/charts/AssetAllocationChart'
import InvestmentPerformanceChart from '../../components/charts/InvestmentPerformanceChart'
import Button from '../../components/common/Button'

export const InvestmentReport = () => {
  const { investments } = useFinance()
  const navigate = useNavigate()

  const totalInvested = investments.reduce((acc, curr) => acc + Number(curr.investedAmount || 0), 0)
  const currentValue = investments.reduce((acc, curr) => acc + Number(curr.currentValue || 0), 0)
  const totalReturns = currentValue - totalInvested
  const returnPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0

  const handleExport = () => {
    exportToCSV(investments, 'FinSight_Investment_Report.csv')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Investment Performance & Asset Audit"
        subtitle="Detailed capital allocation statement and asset appreciation metrics"
        breadcrumbs={['Reports', 'Investment Report']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/reports')}
        >
          Back
        </Button>
        <Button variant="outline" size="sm" icon={Printer} onClick={printReport}>
          Print
        </Button>
        <Button variant="primary" size="sm" icon={Download} onClick={handleExport}>
          Export CSV
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Capital Invested"
          value={formatCurrency(totalInvested)}
          subtitle="Net cost"
          colorScheme="brand"
        />
        <StatCard
          title="Current Valuation"
          value={formatCurrency(currentValue)}
          subtitle="Portfolio NAV"
          colorScheme="violet"
        />
        <StatCard
          title="Net Unrealized Gain"
          value={`+${formatCurrency(totalReturns)}`}
          change={formatPercentage(returnPercentage)}
          isPositive={true}
          subtitle="Total profit"
          colorScheme="emerald"
        />
        <StatCard
          title="Total Positions"
          value={investments.length}
          subtitle="Across 5 asset classes"
          colorScheme="cyan"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard title="Performance vs Benchmark">
            <InvestmentPerformanceChart height={280} />
          </DashboardCard>
        </div>

        <div>
          <DashboardCard title="Asset Allocation Breakdown">
            <AssetAllocationChart investments={investments} height={280} />
          </DashboardCard>
        </div>
      </div>

      <DashboardCard title="Investment Asset Statement">
        <PortfolioTable investments={investments} />
      </DashboardCard>
    </div>
  )
}

export default InvestmentReport
