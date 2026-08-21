import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { KeyRound, ArrowRight, ArrowLeft } from 'lucide-react'
import { authService } from '../../services/authService'
import Button from '../../components/common/Button'

export const VerifyOTP = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const identifier = location.state?.identifier || 'your account'

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      if (prevInput) prevInput.focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const fullOtp = otp.join('')
    if (fullOtp.length < 6) {
      setError('Please enter the complete 6-digit OTP code.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await authService.verifyOTP(fullOtp)
      navigate('/reset-password', { state: { otp: fullOtp } })
    } catch (err) {
      setError(err.message || 'Invalid OTP code. Try 123456')
    } finally {
      setLoading(false)
    }
  }

  const fillTestOtp = () => {
    setOtp(['1', '2', '3', '4', '5', '6'])
  }

  return (
    <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-2xl">
      <div className="text-center mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 flex items-center justify-center mx-auto mb-3">
          <KeyRound className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Enter Verification Code</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          We sent a 6-digit verification code to <span className="font-semibold text-slate-700 dark:text-slate-300">{identifier}</span>
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-600 font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleVerify} className="space-y-6">
        <div className="flex justify-between gap-2 sm:gap-3">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-11 h-12 sm:w-12 sm:h-14 text-center font-bold text-lg rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full"
          icon={ArrowRight}
          iconPosition="right"
        >
          Verify Code
        </Button>
      </form>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>Didn't receive code?</span>
        <button
          type="button"
          onClick={fillTestOtp}
          className="font-semibold text-brand-600 dark:text-brand-400 hover:underline"
        >
          Auto-fill test code (123456)
        </button>
      </div>

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

export default VerifyOTP
