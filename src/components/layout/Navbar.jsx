import React, { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Menu,
  Bell,
  Sun,
  Moon,
  User,
  LogOut,
  Settings,
  Shield,
  Search,
  Check,
  ChevronDown
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'
import { useFinance } from '../../hooks/useFinance'
import NotificationPanel from './NotificationPanel'

export const Navbar = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAuth()
  const { theme, toggleTheme, isDark } = useTheme()
  const { notifications } = useFinance()
  const navigate = useNavigate()

  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserDropdown, setShowUserDropdown] = useState(false)

  const unreadCount = notifications.filter((n) => !n.read).length
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowUserDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl px-4 sm:px-6 shadow-glass-sm transition-all duration-300">
      {/* Left items: Mobile toggle & Search placeholder */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/60 border border-slate-200/50 dark:border-slate-700/50 text-slate-400 text-xs w-64 focus-within:ring-2 focus-within:ring-brand-500/20 transition-all">
          <Search className="w-4 h-4 text-slate-400" />
          <span>Quick search (Press ⌘K or /)</span>
        </div>
      </div>

      {/* Right items: Theme toggle, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200 hover:scale-105 active:scale-95"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-400 animate-pulse-glow" /> : <Moon className="w-5 h-5 text-indigo-500" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200 relative hover:scale-105 active:scale-95"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-glow-rose animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <NotificationPanel onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* User Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setShowUserDropdown(!showUserDropdown)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100/80 dark:hover:bg-slate-800/80 transition-all duration-200 group"
          >
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                alt={user?.fullName || user?.name || 'User Avatar'}
                className="w-8 h-8 rounded-full object-cover border-2 border-brand-500/40 dark:border-brand-400/40 group-hover:border-brand-500 shadow-sm transition-all"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-900 rounded-full"></span>
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                {user?.fullName || user?.name || 'User'}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">{user?.occupation || 'Free Plan'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block group-hover:translate-y-0.5 transition-transform" />
          </button>

          {showUserDropdown && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-1.5 z-50 animate-fade-in ring-1 ring-black/5">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{user?.fullName || user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>

              <div className="py-1">
                <Link
                  to="/profile"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  My Profile
                </Link>
                <Link
                  to="/profile/preferences"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  Preferences
                </Link>
                <Link
                  to="/profile/security"
                  onClick={() => setShowUserDropdown(false)}
                  className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  Security & 2FA
                </Link>
              </div>

              <div className="border-t border-slate-100 dark:border-slate-800 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Navbar
