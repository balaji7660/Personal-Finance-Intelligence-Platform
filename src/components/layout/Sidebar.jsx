import React, { useState } from 'react'
import { NavLink, Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Receipt,
  PieChart,
  TrendingUp,
  Target,
  BarChart3,
  FileText,
  Bell,
  User,
  ChevronDown,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
} from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'

export const Sidebar = ({ className = '', onItemClick }) => {
  const location = useLocation()
  const { expenses, budgets, metrics } = useFinance()

  // Compute a simple live health score from real data
  const totalIncome = metrics?.totalIncome || 75000
  const totalExpenses = expenses.reduce((s, e) => s + Number(e.amount || 0), 0)
  const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0
  const budgetsWithinLimit = budgets.filter(b => Number(b.spent || 0) <= Number(b.limit || 0)).length
  const budgetScore = budgets.length > 0 ? Math.round((budgetsWithinLimit / budgets.length) * 100) : 70
  const savingsScore = expenses.length > 0 ? Math.min(100, Math.round((savingsRate / 20) * 80)) : 70
  const liveScore = expenses.length > 0
    ? Math.round((savingsScore + budgetScore + 70) / 3)
    : 0
  const scoreLabel = liveScore === 0
    ? 'Add data to see your score'
    : liveScore >= 80
    ? 'Excellent financial health!'
    : liveScore >= 65
    ? 'Your finances are on track.'
    : 'Review your spending habits.'

  // Track expanded submenus
  const [openSubmenus, setOpenSubmenus] = useState({
    expenses: location.pathname.startsWith('/expenses'),
    budgets: location.pathname.startsWith('/budgets'),
    investments: location.pathname.startsWith('/investments'),
    goals: location.pathname.startsWith('/goals'),
    analytics: location.pathname.startsWith('/analytics'),
    reports: location.pathname.startsWith('/reports'),
    profile: location.pathname.startsWith('/profile'),
  })

  const toggleSubmenu = (key) => {
    setOpenSubmenus((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const navItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
    },
    {
      title: 'Expenses',
      key: 'expenses',
      icon: Receipt,
      path: '/expenses',
      subItems: [
        { title: 'Overview', path: '/expenses' },
        { title: 'Add Expense', path: '/expenses/add' },
        { title: 'History', path: '/expenses/history' },
      ],
    },
    {
      title: 'Budgets',
      key: 'budgets',
      icon: PieChart,
      path: '/budgets',
      subItems: [
        { title: 'Overview', path: '/budgets' },
        { title: 'Create Budget', path: '/budgets/create' },
      ],
    },
    {
      title: 'Investments',
      key: 'investments',
      icon: TrendingUp,
      path: '/investments',
      subItems: [
        { title: 'Portfolio', path: '/investments/portfolio' },
        { title: 'Add Investment', path: '/investments/add' },
        { title: 'Asset Allocation', path: '/investments/allocation' },
      ],
    },
    {
      title: 'Financial Goals',
      key: 'goals',
      icon: Target,
      path: '/goals',
      subItems: [
        { title: 'Goals Overview', path: '/goals' },
        { title: 'Create Goal', path: '/goals/create' },
      ],
    },
    {
      title: 'Analytics',
      key: 'analytics',
      icon: BarChart3,
      path: '/analytics',
      subItems: [
        { title: 'Overview', path: '/analytics' },
        { title: 'Spending Analysis', path: '/analytics/spending' },
        { title: 'Budget Recommendations', path: '/analytics/budget' },
        { title: 'Investment Insights', path: '/analytics/investments' },
        { title: 'Financial Health', path: '/analytics/financial-health' },
      ],
    },
    {
      title: 'Reports',
      key: 'reports',
      icon: FileText,
      path: '/reports',
      subItems: [
        { title: 'Overview', path: '/reports' },
        { title: 'Financial Report', path: '/reports/financial' },
        { title: 'Expense Report', path: '/reports/expenses' },
        { title: 'Investment Report', path: '/reports/investments' },
        { title: 'Goal Report', path: '/reports/goals' },
      ],
    },
    {
      title: 'Notifications',
      path: '/notifications',
      icon: Bell,
    },
    {
      title: 'Profile',
      key: 'profile',
      icon: User,
      path: '/profile',
      subItems: [
        { title: 'My Profile', path: '/profile' },
        { title: 'Preferences', path: '/profile/preferences' },
        { title: 'Security', path: '/profile/security' },
      ],
    },
  ]

  return (
    <aside
      className={`w-64 flex-shrink-0 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl transition-colors ${className}`}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Brand Header */}
        <Link
          to="/"
          onClick={onItemClick}
          className="flex items-center gap-3 px-6 h-16 border-b border-slate-100 dark:border-slate-800 flex-shrink-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-all group cursor-pointer"
          title="Go to Landing Page"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-brand-500 to-indigo-500 flex items-center justify-center text-white shadow-glow-primary font-black text-lg group-hover:scale-105 transition-transform duration-300">
            <Sparkles className="w-5 h-5 animate-pulse-glow" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
              FinSight
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-brand-600 dark:text-brand-400 -mt-1">
              Financial Intelligence
            </span>
          </div>
        </Link>

        {/* Navigation list */}
        <nav className="p-4 space-y-1.5 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const hasSub = item.subItems && item.subItems.length > 0
            const isOpen = openSubmenus[item.key]
            const isParentActive =
              hasSub && (location.pathname === item.path || location.pathname.startsWith(item.path + '/'))

            if (!hasSub) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onItemClick}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white shadow-glow-primary font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 flex-shrink-0" />
                  <span>{item.title}</span>
                </NavLink>
              )
            }

            return (
              <div key={item.title} className="space-y-1">
                <button
                  type="button"
                  onClick={() => toggleSubmenu(item.key)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isParentActive
                      ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-700 dark:text-brand-300 font-bold border border-brand-200/50 dark:border-brand-800/40'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform duration-200" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-70 transition-transform duration-200" />
                  )}
                </button>

                {isOpen && (
                  <div className="pl-9 pr-2 space-y-1 py-1 border-l-2 border-slate-100 dark:border-slate-800 ml-5">
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        end={sub.path === item.path}
                        onClick={onItemClick}
                        className={({ isActive }) =>
                          `block px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                            isActive
                              ? 'text-brand-600 dark:text-brand-400 bg-brand-50/70 dark:bg-brand-950/40 font-bold shadow-sm'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/60 dark:hover:bg-slate-800/50'
                          }`
                        }
                      >
                        {sub.title}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Bottom Card / Badge */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-brand-600 via-indigo-600 to-purple-600 text-white shadow-glow-primary border border-white/10 relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
            <div className="flex items-center justify-between mb-1.5 relative z-10">
              <span className="text-[10px] uppercase font-extrabold tracking-wider opacity-90">
                Health Score
              </span>
              <span className="text-xs font-black bg-white/20 px-2 py-0.5 rounded-full border border-white/20">{liveScore > 0 ? `${liveScore}/100` : '—'}</span>
            </div>
            <p className="text-[11px] opacity-90 relative z-10 font-medium">{scoreLabel}</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
