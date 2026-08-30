import React from 'react'
import { Outlet, Link } from 'react-router-dom'
import { Sparkles, ShieldCheck, TrendingUp, PieChart } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { Sun, Moon } from 'lucide-react'

export const AuthLayout = () => {
  const { theme, toggleTheme, isDark } = useTheme()

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-between">
      {/* Top Header */}
      <div className="flex items-center justify-between p-6 max-w-7xl w-full mx-auto">
        <Link to="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity" title="Go to Landing Page">
          <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-md shadow-brand-500/20 font-black text-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-slate-900 dark:text-white tracking-tight">
            FinSight
          </span>
        </Link>

        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-600" />}
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <footer className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/60">
        <p>© {new Date().getFullYear()} FinSight Financial Technologies. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default AuthLayout
