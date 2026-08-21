import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Lock, ArrowRight, CheckCircle2 } from 'lucide-react'
import { authService } from '../../services/authService'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export const ResetPassword = () => {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const otp = location.state?.otp || '123456'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError('Please provide new password.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await authService.resetPassword({ otp, password })
      setIsSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 2000)
    } catch (err) {
      setError(err.message || 'Failed to reset password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Create New Password</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Your new password must be different from previous passwords
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-600 font-medium">
          {error}
        </div>
      )}

      {isSuccess && (
        <div className="mb-5 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-center">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            Password reset successful!
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
            Redirecting to login in a moment...
          </p>
        </div>
      )}

      {!isSuccess && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="New Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={Lock}
            required
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full mt-2"
            icon={ArrowRight}
            iconPosition="right"
          >
            Update Password
          </Button>
        </form>
      )}

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          Return to Login
        </Link>
      </div>
    </div>
  )
}

export default ResetPassword
