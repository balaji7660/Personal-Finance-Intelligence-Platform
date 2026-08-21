import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FileText,
  Receipt,
  TrendingUp,
  Target,
  Download,
  Printer,
  Calendar,
  ArrowRight,
} from 'lucide-react'
import PageHeader from '../../components/common/PageHeader'
import DashboardCard from '../../components/cards/DashboardCard'
import Button from '../../components/common/Button'
import { printReport } from '../../utils/exportUtils'

export const Reports = () => {
  const navigate = useNavigate()

  const reportCards = [
    {
      title: 'Comprehensive Financial Report',
      description: 'Master balance sheet covering Income, Net Outlays, Total Savings, Net Worth & Portfolio Valuation.',
      path: '/reports/financial',
      icon: FileText,
      color: 'text-brand-600 bg-brand-50 dark:bg-brand-950/40',
    },
    {
      title: 'Expense & Category Audit Report',
      description: 'Itemized breakdown of all expenditures, category concentrations, and payment channel distributions.',
      path: '/reports/expenses',
      icon: Receipt,
      color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/40',
    },
    {
      title: 'Investment Portfolio & Returns Report',
      description: 'Detailed statement of equity holdings, mutual fund SIP returns, asset allocation weights and alpha.',
      path: '/reports/investments',
      icon: TrendingUp,
      color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/40',
    },
    {
      title: 'Financial Goals & Milestones Report',
      description: 'Progress audits for Emergency Fund, Vacation, Vehicle downpayment and retirement corpuses.',
      path: '/reports/goals',
      icon: Target,
      color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/40',
    },
  ]

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reports & Financial Statements"
        subtitle="Generate printable statements and downloadable audit reports for tax planning and personal records"
        breadcrumbs={['Dashboard', 'Reports']}
      >
        <Button variant="outline" size="sm" icon={Printer} onClick={printReport}>
          Print Statement
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportCards.map((card, idx) => {
          const Icon = card.icon
          return (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-card hover:shadow-card-hover hover:border-brand-500 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3.5 mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${card.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 dark:text-white">
                      {card.title}
                    </h3>
                    <span className="text-xs text-slate-400">Monthly / Quarterly / Annual</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-400">Instant PDF & CSV</span>
                <Button
                  variant="primary"
                  size="sm"
                  icon={ArrowRight}
                  iconPosition="right"
                  onClick={() => navigate(card.path)}
                >
                  Generate Report
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Reports
