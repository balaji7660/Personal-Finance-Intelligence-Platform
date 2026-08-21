import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Download,
  Printer,
  Receipt,
  Tag,
  Calendar,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import { exportToCSV, printReport } from '../../utils/exportUtils'
import PageHeader from '../../components/common/PageHeader'
import DashboardCard from '../../components/cards/DashboardCard'
import StatCard from '../../components/cards/StatCard'
import CategoryPieChart from '../../components/charts/CategoryPieChart'
import ExpenseTable from '../../components/tables/ExpenseTable'
import { analyticsData } from '../../data/mockData'
import Button from '../../components/common/Button'

export const ExpenseReport = () => {
  const { expenses } = useFinance()
  const navigate = useNavigate()

  const total = expenses.reduce((acc, curr) => acc + Number(curr.amount || 0), 0)

  const handleExport = () => {
    exportToCSV(expenses, 'FinSight_Expense_Audit_Report.csv')
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Expense & Spending Audit Report"
        subtitle="Itemized audit statement of all category expenditures and payment gateways"
        breadcrumbs={['Reports', 'Expense Report']}
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Expenses"
          value={formatCurrency(total)}
          subtitle="August 2026"
          colorScheme="rose"
        />
        <StatCard
          title="Total Transactions"
          value={expenses.length}
          subtitle="Processed entries"
          colorScheme="brand"
        />
        <StatCard
          title="Top Category"
          value="Food & Dining"
          subtitle="₹9,850 spent"
          colorScheme="amber"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <DashboardCard title="Category Distribution">
            <CategoryPieChart data={analyticsData.categorySpending} height={280} />
          </DashboardCard>
        </div>

        <div className="lg:col-span-2">
          <DashboardCard title="Detailed Expense Line Items">
            <ExpenseTable expenses={expenses} />
          </DashboardCard>
        </div>
      </div>
    </div>
  )
}

export default ExpenseReport
