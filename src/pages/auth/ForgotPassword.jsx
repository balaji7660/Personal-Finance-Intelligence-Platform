import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react'
import { authService } from '../../services/authService'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'

export const ForgotPassword = () => {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    if (!identifier) {
      setError('Please enter your email address or mobile number.')
      return
    }

    setLoading(true)
    try {
      await authService.forgotPassword(identifier)
      setMessage('Password reset OTP has been sent! Redirecting to verification...')
      setTimeout(() => {
        navigate('/verify-otp', { state: { identifier } })
      }, 1500)
    } catch (err) {
      setError(err.message || 'Failed to send reset code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Forgot Password?</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Enter your registered email or mobile to receive a 6-digit OTP
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-600 font-medium">
          {error}
        </div>
      )}

      {message && (
        <div className="mb-5 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs text-emerald-600 font-medium">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email or Mobile"
          placeholder="name@example.com or 9876543210"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          icon={Mail}
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
          Send Verification OTP
        </Button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-brand-600 dark:hover:text-brand-400"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
        </Link>
      </div>
    </div>
  )
}

export default ForgotPassword
