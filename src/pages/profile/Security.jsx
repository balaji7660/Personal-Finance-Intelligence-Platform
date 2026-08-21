import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Shield,
  KeyRound,
  Smartphone,
  LogOut,
  CheckCircle2,
  Lock,
  Laptop,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import PageHeader from '../../components/common/PageHeader'
import DashboardCard from '../../components/cards/DashboardCard'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export const Security = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const handlePasswordChange = (e) => {
    e.preventDefault()
    setErrorMsg('')
    if (!passwords.currentPassword || !passwords.newPassword) {
      setErrorMsg('Please provide current and new password.')
      return
    }
    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMsg('New passwords do not match.')
      return
    }
    setSuccessMsg('Password changed successfully!')
    setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const handleLogoutAll = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="max-w-3xl space-y-6">
      <PageHeader
        title="Security & Authentication"
        subtitle="Manage credentials, two-factor authentication, and active authorized sessions"
        breadcrumbs={['Profile', 'Security']}
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

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs font-semibold text-rose-800 dark:text-rose-200">
          {errorMsg}
        </div>
      )}

      {/* Two Factor Authentication */}
      <DashboardCard title="Two-Factor Authentication (2FA)">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center flex-shrink-0">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                SMS / Authenticator App OTP
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Require a 6-digit verification code for all new device logins
              </p>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={() => setTwoFactorEnabled(!twoFactorEnabled)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-600"></div>
          </label>
        </div>
      </DashboardCard>

      {/* Change Password */}
      <DashboardCard title="Update Master Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            placeholder="••••••••"
            value={passwords.currentPassword}
            onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
            icon={Lock}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              placeholder="••••••••"
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              icon={KeyRound}
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              placeholder="••••••••"
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              icon={KeyRound}
              required
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button type="submit" variant="primary">
              Change Password
            </Button>
          </div>
        </form>
      </DashboardCard>

      {/* Active Sessions */}
      <DashboardCard title="Active Logged-in Devices">
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 dark:text-white">
                  Chrome on Windows 11 (Current Session)
                </p>
                <p className="text-[11px] text-slate-400">Bangalore, India • Active now</p>
              </div>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
              Current
            </span>
          </div>

          <div className="pt-2 flex justify-end">
            <Button
              variant="danger"
              size="sm"
              icon={LogOut}
              onClick={handleLogoutAll}
            >
              Sign Out All Devices
            </Button>
          </div>
        </div>
      </DashboardCard>
    </div>
  )
}

export default Security
