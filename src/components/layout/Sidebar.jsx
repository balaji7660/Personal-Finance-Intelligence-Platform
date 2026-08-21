import React, { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
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

export const Sidebar = ({ className = '', onItemClick }) => {
  const location = useLocation()

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
      className={`w-64 flex-shrink-0 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 transition-colors ${className}`}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 font-black text-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              FinSight
            </span>
            <span className="block text-[10px] uppercase font-semibold tracking-wider text-brand-600 dark:text-brand-400 -mt-1">
              Financial Intelligence
            </span>
          </div>
        </div>

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
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-sm shadow-brand-600/30'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isParentActive
                      ? 'bg-brand-50/80 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.title}</span>
                  </div>
                  {isOpen ? (
                    <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                  ) : (
                    <ChevronRight className="w-3.5 h-3.5 opacity-70" />
                  )}
                </button>

                {isOpen && (
                  <div className="pl-9 pr-2 space-y-1 py-1">
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.path}
                        to={sub.path}
                        end={sub.path === item.path}
                        onClick={onItemClick}
                        className={({ isActive }) =>
                          `block px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            isActive
                              ? 'text-brand-600 dark:text-brand-400 bg-brand-50/50 dark:bg-brand-950/20 font-semibold'
                              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/60'
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
          <div className="p-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold tracking-wider opacity-80">
                Health Score
              </span>
              <span className="text-xs font-black">78/100</span>
            </div>
            <p className="text-[11px] opacity-90">Your finances are on track this month.</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
