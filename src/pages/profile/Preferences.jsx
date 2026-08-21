import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Settings,
  Bell,
  Sun,
  Moon,
  Globe,
  Save,
  CheckCircle2,
  DollarSign,
} from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import PageHeader from '../../components/common/PageHeader'
import DashboardCard from '../../components/cards/DashboardCard'
import Button from '../../components/common/Button'
import Select from '../../components/common/Select'

export const Preferences = () => {
  const { theme, toggleTheme, isDark } = useTheme()
  const navigate = useNavigate()

  const [preferences, setPreferences] = useState({
    currency: 'INR (₹)',
    language: 'English (India)',
    emailNotifications: true,
    budgetAlerts: true,
    weeklyReport: true,
    investmentReminders: true,
  })

  const [saved, setSaved] = useState(false)

  const handleToggle = (key) => {
    setPreferences((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Application Preferences"
        subtitle="Customize display themes, alerts, currencies, and notifications"
        breadcrumbs={['Profile', 'Preferences']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/profile')}
        >
          Back
        </Button>
      </PageHeader>

      {saved && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Preferences updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Appearance & Theme */}
        <DashboardCard title="Display & Theme Settings">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">Dark Mode Theme</p>
              <p className="text-xs text-slate-500">Switch between clean light and sleek dark mode</p>
            </div>
            <button
              type="button"
              onClick={toggleTheme}
              className={`p-2.5 rounded-2xl border transition-all flex items-center gap-2 text-xs font-semibold ${
                isDark
                  ? 'bg-slate-800 border-slate-700 text-amber-400'
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        </DashboardCard>

        {/* Currency & Localization */}
        <DashboardCard title="Currency & Regional Localization">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Default Display Currency"
              value={preferences.currency}
              onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
              options={[
                { value: 'INR (₹)', label: 'Indian Rupee (₹)' },
                { value: 'USD ($)', label: 'US Dollar ($)' },
                { value: 'EUR (€)', label: 'Euro (€)' },
                { value: 'GBP (£)', label: 'British Pound (£)' },
              ]}
            />
            <Select
              label="Language"
              value={preferences.language}
              onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
              options={[
                { value: 'English (India)', label: 'English (India)' },
                { value: 'Hindi (हिन्दी)', label: 'Hindi (हिन्दी)' },
              ]}
            />
          </div>
        </DashboardCard>

        {/* Notification Preferences */}
        <DashboardCard title="Financial Reminders & Alerts">
          <div className="space-y-4">
            <label className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Budget Overspending Alerts (&gt;80%)
                </p>
                <p className="text-[11px] text-slate-500">
                  Notify when a category spend approaches its monthly ceiling
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.budgetAlerts}
                onChange={() => handleToggle('budgetAlerts')}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Weekly Savings & Digest Summary
                </p>
                <p className="text-[11px] text-slate-500">
                  Receive curated weekly financial digests and goal progress reports
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.weeklyReport}
                onChange={() => handleToggle('weeklyReport')}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
            </label>

            <label className="flex items-center justify-between py-2 cursor-pointer">
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  SIP & Bill Due Date Reminders
                </p>
                <p className="text-[11px] text-slate-500">
                  Automated reminders 3 days prior to recurring utility and mutual fund SIP dates
                </p>
              </div>
              <input
                type="checkbox"
                checked={preferences.investmentReminders}
                onChange={() => handleToggle('investmentReminders')}
                className="rounded border-slate-300 text-brand-600 focus:ring-brand-500 w-4 h-4"
              />
            </label>
          </div>
        </DashboardCard>

        <div className="flex justify-end gap-3 pt-2">
          <Button
            variant="primary"
            type="submit"
            icon={Save}
          >
            Save Preferences
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Preferences
