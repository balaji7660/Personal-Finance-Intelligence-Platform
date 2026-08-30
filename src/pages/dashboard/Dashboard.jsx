import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Wallet,
  ArrowDownRight,
  PiggyBank,
  TrendingUp,
  PieChart,
  Activity,
  Plus,
  ArrowRight,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useFinance } from '../../hooks/useFinance'
import { formatCurrency } from '../../utils/currencyFormatter'
import { getGreeting } from '../../utils/dateUtils'

import StatCard from '../../components/cards/StatCard'
import DashboardCard from '../../components/cards/DashboardCard'
import IncomeExpenseChart from '../../components/charts/IncomeExpenseChart'
import ExpenseTrendChart from '../../components/charts/ExpenseTrendChart'
import CategoryPieChart from '../../components/charts/CategoryPieChart'
import InvestmentPerformanceChart from '../../components/charts/InvestmentPerformanceChart'
import HealthScoreGauge from '../../components/charts/HealthScoreGauge'
import RecentTransactionsTable from '../../components/tables/RecentTransactionsTable'
import ProgressBar from '../../components/common/ProgressBar'
import Button from '../../components/common/Button'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'

export const Dashboard = () => {
  const { user } = useAuth()
  const {
    expenses,
    budgets,
    investments,
    goals,
    metrics,
    addExpense,
    addBudget,
    addInvestment,
    addGoal,
  } = useFinance()
  const navigate = useNavigate()

  // Compute Income vs Expenses chart data from real expenses (last 6 months)
  const monthlyComparison = React.useMemo(() => {
    const now = new Date()
    const months = []
    const userIncome = user?.monthlyIncome ? Number(user.monthlyIncome) : 75000
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        month: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        monthNum: d.getMonth(),
        income: userIncome,
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
  }, [expenses, user?.monthlyIncome])

  // Compute category breakdown from real expenses
  const CATEGORY_COLORS = {
    Food: '#f97316', Travel: '#06b6d4', Shopping: '#ec4899',
    Bills: '#eab308', Education: '#8b5cf6', Healthcare: '#10b981',
    Entertainment: '#6366f1', Other: '#64748b',
  }
  const categorySpending = React.useMemo(() => {
    const map = {}
    expenses.forEach((e) => {
      const cat = e.category || 'Other'
      map[cat] = (map[cat] || 0) + Number(e.amount || 0)
    })
    return Object.entries(map).map(([name, value]) => ({
      name, value, color: CATEGORY_COLORS[name] || '#64748b',
    }))
  }, [expenses])

  // Live savings rate
  const savingsRate = metrics.totalIncome > 0
    ? ((metrics.totalSavings / metrics.totalIncome) * 100).toFixed(1)
    : '0.0'

  // Quick Action Modal states
  const [activeModal, setActiveModal] = useState(null)
  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: 'Food',
    paymentMethod: 'UPI',
    date: new Date().toISOString().split('T')[0],
  })

  const [budgetForm, setBudgetForm] = useState({
    name: '',
    category: 'Food',
    limit: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  })

  const [investmentForm, setInvestmentForm] = useState({
    name: '',
    type: 'Mutual Funds',
    investedAmount: '',
    currentValue: '',
    riskLevel: 'Moderate',
    purchaseDate: new Date().toISOString().split('T')[0],
  })

  const [goalForm, setGoalForm] = useState({
    name: '',
    type: 'Emergency Fund',
    targetAmount: '',
    savedAmount: '',
    targetDate: '',
    priority: 'High',
  })

  const handleCreateExpense = async (e) => {
    e.preventDefault()
    if (!expenseForm.description || !expenseForm.amount) return
    await addExpense(expenseForm)
    setExpenseForm({
      description: '',
      amount: '',
      category: 'Food',
      paymentMethod: 'UPI',
      date: new Date().toISOString().split('T')[0],
    })
    setActiveModal(null)
  }

  const handleCreateBudget = async (e) => {
    e.preventDefault()
    if (!budgetForm.name || !budgetForm.limit) return
    await addBudget(budgetForm)
    setBudgetForm({
      name: '',
      category: 'Food',
      limit: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    })
    setActiveModal(null)
  }

  const handleCreateInvestment = async (e) => {
    e.preventDefault()
    if (!investmentForm.name || !investmentForm.investedAmount) return
    await addInvestment(investmentForm)
    setInvestmentForm({
      name: '',
      type: 'Mutual Funds',
      investedAmount: '',
      currentValue: '',
      riskLevel: 'Moderate',
      purchaseDate: new Date().toISOString().split('T')[0],
    })
    setActiveModal(null)
  }

  const handleCreateGoal = async (e) => {
    e.preventDefault()
    if (!goalForm.name || !goalForm.targetAmount) return
    await addGoal(goalForm)
    setGoalForm({
      name: '',
      type: 'Emergency Fund',
      targetAmount: '',
      savedAmount: '',
      targetDate: '',
      priority: 'High',
    })
    setActiveModal(null)
  }

  const greeting = getGreeting()
  const nameToSplit = user?.fullName || user?.name
  const userName = nameToSplit ? nameToSplit.split(' ')[0] : 'User'

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-gradient-to-r from-brand-900 via-slate-900 to-indigo-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-300 text-xs font-semibold backdrop-blur-md mb-2">
            <Zap className="w-3.5 h-3.5 text-amber-400" /> Smart Portfolio Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {greeting}, {userName} 👋
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-xl">
            Here's your comprehensive financial overview for this month. You're saving {savingsRate}% of your income.
          </p>
        </div>

        {/* Quick Actions Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            onClick={() => setActiveModal('expense')}
            className="bg-brand-500 hover:bg-brand-600 shadow-md"
          >
            Add Expense
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveModal('budget')}
            className="bg-white/15 hover:bg-white/25 text-white border-transparent"
          >
            Create Budget
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveModal('investment')}
            className="bg-white/15 hover:bg-white/25 text-white border-transparent"
          >
            Add Investment
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setActiveModal('goal')}
            className="bg-white/15 hover:bg-white/25 text-white border-transparent"
          >
            Create Goal
          </Button>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          title="Total Income"
          value={formatCurrency(metrics.totalIncome)}
          change="+4.2%"
          isPositive={true}
          subtitle="vs last month"
          icon={Wallet}
          colorScheme="emerald"
        />
        <StatCard
          title="Total Expenses"
          value={formatCurrency(metrics.totalExpenses)}
          change="-2.5%"
          isPositive={true}
          subtitle="within budget"
          icon={ArrowDownRight}
          colorScheme="rose"
          onClick={() => navigate('/expenses')}
        />
        <StatCard
          title="Total Savings"
          value={formatCurrency(metrics.totalSavings)}
          change="+12.0%"
          isPositive={true}
          subtitle="43.3% savings rate"
          icon={PiggyBank}
          colorScheme="cyan"
        />
        <StatCard
          title="Investments"
          value={formatCurrency(metrics.currentInvestmentValue)}
          change="+14.8%"
          isPositive={true}
          subtitle="Unrealized profit"
          icon={TrendingUp}
          colorScheme="violet"
          onClick={() => navigate('/investments')}
        />
        <StatCard
          title="Budget Used"
          value={`${metrics.budgetUtilization}%`}
          change={`${metrics.budgetUtilization > 80 ? 'High' : 'Normal'}`}
          isPositive={metrics.budgetUtilization <= 80}
          subtitle={`${formatCurrency(metrics.totalBudgetSpent)} spent`}
          icon={PieChart}
          colorScheme="amber"
          onClick={() => navigate('/budgets')}
        />
        <StatCard
          title="Health Score"
          value={`${metrics.healthScore}/100`}
          change="Top 15%"
          isPositive={true}
          subtitle="Financially resilient"
          icon={Activity}
          colorScheme="brand"
          onClick={() => navigate('/analytics/financial-health')}
        />
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="lg:col-span-2">
          <DashboardCard
            title="Income vs Expenses & Savings"
            subtitle="Monthly cash flow performance for the last 6 months"
            action={
              <button
                onClick={() => navigate('/analytics')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                Full Analytics <ArrowRight className="w-3 h-3" />
              </button>
            }
          >
            <IncomeExpenseChart data={monthlyComparison} height={300} />
          </DashboardCard>
        </div>

        {/* Expense Category Donut Chart */}
        <div>
          <DashboardCard
            title="Expense Breakdown"
            subtitle="Distribution by spending category"
            action={
              <button
                onClick={() => navigate('/expenses')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            }
          >
            <CategoryPieChart data={categorySpending} height={300} />
          </DashboardCard>
        </div>
      </div>

      {/* Secondary Charts & Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Investment Performance Line Chart */}
        <div className="lg:col-span-2">
          <DashboardCard
            title="Portfolio Performance vs Nifty 50"
            subtitle="Track your alpha and capital growth trajectory"
            action={
              <button
                onClick={() => navigate('/investments/portfolio')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                Portfolio <ArrowRight className="w-3 h-3" />
              </button>
            }
          >
            <InvestmentPerformanceChart height={260} />
          </DashboardCard>
        </div>

        {/* Savings & Health Overview */}
        <div className="space-y-6">
          <DashboardCard
            title="Financial Health Score"
            subtitle="Composite score across 4 pillars"
            action={
              <button
                onClick={() => navigate('/analytics/financial-health')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
              >
                Breakdown
              </button>
            }
          >
            <HealthScoreGauge score={metrics.healthScore ?? 0} />
          </DashboardCard>
        </div>
      </div>

      {/* Bottom Section: Recent Transactions & Active Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-2">
          <DashboardCard
            title="Recent Transactions"
            subtitle="Latest debits and verified account expenses"
            action={
              <button
                onClick={() => navigate('/expenses/history')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                View History <ArrowRight className="w-3 h-3" />
              </button>
            }
          >
            <RecentTransactionsTable transactions={expenses} limit={5} />
          </DashboardCard>
        </div>

        {/* Savings Progress & Top Goals */}
        <div>
          <DashboardCard
            title="Priority Goals"
            subtitle="Progress toward life milestones"
            action={
              <button
                onClick={() => navigate('/goals')}
                className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
              >
                All Goals <ArrowRight className="w-3 h-3" />
              </button>
            }
          >
            <div className="space-y-4">
              {goals.slice(0, 3).map((goal) => {
                const pct = goal.targetAmount > 0 ? (goal.savedAmount / goal.targetAmount) * 100 : 0
                return (
                  <div key={goal.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white line-clamp-1">{goal.name}</span>
                      <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{pct.toFixed(0)}%</span>
                    </div>
                    <ProgressBar value={goal.savedAmount} max={goal.targetAmount} size="sm" />
                    <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                      <span>{formatCurrency(goal.savedAmount)}</span>
                      <span>Target: {formatCurrency(goal.targetAmount)}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </DashboardCard>
        </div>
      </div>

      {/* QUICK ACTION MODALS */}
      {/* 1. Add Expense Modal */}
      <Modal
        isOpen={activeModal === 'expense'}
        onClose={() => setActiveModal(null)}
        title="Quick Add Expense"
        subtitle="Log a new transaction to your expense history"
      >
        <form onSubmit={handleCreateExpense} className="space-y-4">
          <Input
            label="Description / Merchant"
            placeholder="e.g. Swiggy food delivery, Fuel..."
            value={expenseForm.description}
            onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Amount (₹)"
              type="number"
              placeholder="e.g. 850"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
              required
            />
            <Select
              label="Category"
              value={expenseForm.category}
              onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value })}
              options={['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Healthcare', 'Entertainment', 'Other']}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Payment Method"
              value={expenseForm.paymentMethod}
              onChange={(e) => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
              options={['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Other']}
            />
            <Input
              label="Date"
              type="date"
              value={expenseForm.date}
              onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Expense
            </Button>
          </div>
        </form>
      </Modal>

      {/* 2. Create Budget Modal */}
      <Modal
        isOpen={activeModal === 'budget'}
        onClose={() => setActiveModal(null)}
        title="Create New Category Budget"
        subtitle="Set a monthly limit to prevent overspending"
      >
        <form onSubmit={handleCreateBudget} className="space-y-4">
          <Input
            label="Budget Name"
            placeholder="e.g. Monthly Food & Dining"
            value={budgetForm.name}
            onChange={(e) => setBudgetForm({ ...budgetForm, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={budgetForm.category}
              onChange={(e) => setBudgetForm({ ...budgetForm, category: e.target.value })}
              options={['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Healthcare', 'Entertainment', 'Other']}
            />
            <Input
              label="Monthly Limit (₹)"
              type="number"
              placeholder="e.g. 10000"
              value={budgetForm.limit}
              onChange={(e) => setBudgetForm({ ...budgetForm, limit: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Create Budget
            </Button>
          </div>
        </form>
      </Modal>

      {/* 3. Add Investment Modal */}
      <Modal
        isOpen={activeModal === 'investment'}
        onClose={() => setActiveModal(null)}
        title="Add Investment Asset"
        subtitle="Track your mutual funds, stocks, bonds or gold"
      >
        <form onSubmit={handleCreateInvestment} className="space-y-4">
          <Input
            label="Asset / Instrument Name"
            placeholder="e.g. HDFC Nifty 50 Index Fund"
            value={investmentForm.name}
            onChange={(e) => setInvestmentForm({ ...investmentForm, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Asset Type"
              value={investmentForm.type}
              onChange={(e) => setInvestmentForm({ ...investmentForm, type: e.target.value })}
              options={['Mutual Funds', 'Stocks', 'ETFs', 'Bonds', 'Other Investments']}
            />
            <Select
              label="Risk Level"
              value={investmentForm.riskLevel}
              onChange={(e) => setInvestmentForm({ ...investmentForm, riskLevel: e.target.value })}
              options={['Low', 'Moderate', 'High']}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Invested Amount (₹)"
              type="number"
              placeholder="e.g. 50000"
              value={investmentForm.investedAmount}
              onChange={(e) => setInvestmentForm({ ...investmentForm, investedAmount: e.target.value })}
              required
            />
            <Input
              label="Current Value (₹)"
              type="number"
              placeholder="e.g. 58000"
              value={investmentForm.currentValue}
              onChange={(e) => setInvestmentForm({ ...investmentForm, currentValue: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Add Asset
            </Button>
          </div>
        </form>
      </Modal>

      {/* 4. Create Goal Modal */}
      <Modal
        isOpen={activeModal === 'goal'}
        onClose={() => setActiveModal(null)}
        title="Create Financial Goal"
        subtitle="Set a clear target and track savings milestones"
      >
        <form onSubmit={handleCreateGoal} className="space-y-4">
          <Input
            label="Goal Name"
            placeholder="e.g. Emergency Fund (6 Months)"
            value={goalForm.name}
            onChange={(e) => setGoalForm({ ...goalForm, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Goal Type"
              value={goalForm.type}
              onChange={(e) => setGoalForm({ ...goalForm, type: e.target.value })}
              options={['Emergency Fund', 'Education', 'Travel', 'Car', 'House', 'Retirement', 'Other']}
            />
            <Select
              label="Priority"
              value={goalForm.priority}
              onChange={(e) => setGoalForm({ ...goalForm, priority: e.target.value })}
              options={['High', 'Medium', 'Low']}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Target Amount (₹)"
              type="number"
              placeholder="e.g. 200000"
              value={goalForm.targetAmount}
              onChange={(e) => setGoalForm({ ...goalForm, targetAmount: e.target.value })}
              required
            />
            <Input
              label="Saved So Far (₹)"
              type="number"
              placeholder="e.g. 50000"
              value={goalForm.savedAmount}
              onChange={(e) => setGoalForm({ ...goalForm, savedAmount: e.target.value })}
            />
          </div>
          <Input
            label="Target Date"
            type="date"
            value={goalForm.targetDate}
            onChange={(e) => setGoalForm({ ...goalForm, targetDate: e.target.value })}
            required
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setActiveModal(null)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Goal
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Dashboard
