import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Printer,
  FileText,
  DollarSign,
  TrendingUp,
  Wallet,
  Calendar,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { useAuth } from '../../hooks/useAuth'
import { formatCurrency } from '../../utils/currencyFormatter'
import { formatDate } from '../../utils/dateUtils'
import { exportToCSV, printReport } from '../../utils/exportUtils'
import PageHeader from '../../components/common/PageHeader'
import DashboardCard from '../../components/cards/DashboardCard'
import StatCard from '../../components/cards/StatCard'
import IncomeExpenseChart from '../../components/charts/IncomeExpenseChart'
import { analyticsData } from '../../data/mockData'
import Button from '../../components/common/Button'

export const FinancialReport = () => {
  const { metrics, expenses, investments, goals } = useFinance()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [period, setPeriod] = useState('Aug 2026')

  const totalBankBalance = 150000
  const netWorth = metrics.currentInvestmentValue + metrics.totalSavings + totalBankBalance

  const handleExport = () => {
    const reportData = [
      { Metric: 'Monthly Income', Value: metrics.totalIncome },
      { Metric: 'Total Outlays / Expenses', Value: metrics.totalExpenses },
      { Metric: 'Monthly Savings', Value: metrics.totalSavings },
      { Metric: 'Current Investment Portfolio', Value: metrics.currentInvestmentValue },
      { Metric: 'Estimated Net Worth', Value: netWorth },
    ]
    exportToCSV(reportData, `FinSight_Financial_Report_${period.replace(/\s+/g, '_')}.csv`)
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Comprehensive Financial Report"
        subtitle={`Official monthly balance sheet statement for ${period}`}
        breadcrumbs={['Reports', 'Financial Report']}
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

      {/* Printable Statement Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-card space-y-6">
        {/* Header Statement Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">FinSight Statement of Accounts</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Account Holder: <strong>{user?.fullName || user?.name || 'User'}</strong> • {user?.email}
            </p>
            <p className="text-xs text-slate-400">Statement Date: {formatDate(new Date().toISOString())}</p>
          </div>
          <div className="text-right sm:text-right">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Net Worth</span>
            <p className="text-2xl font-black text-brand-600 dark:text-brand-400">{formatCurrency(netWorth)}</p>
          </div>
        </div>

        {/* 4 Summary Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Inflow (Income)"
            value={formatCurrency(metrics.totalIncome)}
            subtitle="Verified monthly salary"
            colorScheme="emerald"
          />
          <StatCard
            title="Total Outflow (Expenses)"
            value={formatCurrency(metrics.totalExpenses)}
            subtitle="Debits across all categories"
            colorScheme="rose"
          />
          <StatCard
            title="Net Cash Retained"
            value={formatCurrency(metrics.totalSavings)}
            subtitle="43.3% savings rate"
            colorScheme="cyan"
          />
          <StatCard
            title="Invested Valuation"
            value={formatCurrency(metrics.currentInvestmentValue)}
            subtitle="Mutual Funds, Stocks, SGB"
            colorScheme="violet"
          />
        </div>

        {/* Chart */}
        <DashboardCard title="Income vs Outflows Trend">
          <IncomeExpenseChart data={analyticsData.monthlyComparison} height={260} />
        </DashboardCard>

        {/* Statement Line Items Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 uppercase font-semibold border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="px-4 py-3">Account / Head</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Primary Monthly Salary</td>
                <td className="px-4 py-3 text-emerald-600 font-medium">Credit / Inflow</td>
                <td className="px-4 py-3">Salary & Earnings</td>
                <td className="px-4 py-3 text-right font-bold text-emerald-600">+{formatCurrency(metrics.totalIncome)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Aggregate Expenses Logged</td>
                <td className="px-4 py-3 text-rose-600 font-medium">Debit / Outflow</td>
                <td className="px-4 py-3">Monthly Outlays</td>
                <td className="px-4 py-3 text-right font-bold text-rose-600">-{formatCurrency(metrics.totalExpenses)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Mutual Funds & Equity Holdings</td>
                <td className="px-4 py-3 text-violet-600 font-medium">Asset / Investment</td>
                <td className="px-4 py-3">Capital Markets</td>
                <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(metrics.currentInvestmentValue)}</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">Liquid Bank Balances & FDs</td>
                <td className="px-4 py-3 text-brand-600 font-medium">Asset / Cash</td>
                <td className="px-4 py-3">Liquid Reserve</td>
                <td className="px-4 py-3 text-right font-bold text-slate-900 dark:text-white">{formatCurrency(totalBankBalance)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default FinancialReport
