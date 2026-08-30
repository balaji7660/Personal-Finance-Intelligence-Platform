import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { User, Mail, Phone, Lock, ArrowRight, Shield } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'

export const Register = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    currency: 'INR (₹)',
    monthlyIncome: '',
    riskPreference: 'Moderate',
    agreeTerms: false,
  })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.fullName || !formData.email || !formData.password) {
      setError('Please provide all mandatory fields.')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address (e.g. user@example.com).')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service & Privacy Policy.')
      return
    }

    setLoading(true)
    try {
      await register(formData)
      navigate('/login', {
        state: {
          successMessage: 'Account created successfully! Please sign in with your credentials.',
          registeredEmail: formData.email,
        },
      })
    } catch (err) {
      setError(err.message || 'Registration failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="glass-card p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-glass-lg relative overflow-hidden animate-fade-in">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
      <div className="text-center mb-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Create Your <span className="gradient-text">FinSight</span> Account
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
          Start tracking, budgeting and growing your wealth intelligently
        </p>
      </div>

      {error && (
        <div className="mb-5 p-3.5 rounded-xl bg-rose-50/80 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 font-medium shadow-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        <Input
          label="Full Name"
          placeholder="e.g. Priya Patel"
          value={formData.fullName}
          onChange={(e) => handleChange('fullName', e.target.value)}
          icon={User}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Email Address"
            type="email"
            placeholder="priya@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            icon={Mail}
            required
          />
          <Input
            label="Mobile Number"
            type="tel"
            placeholder="+91 98765 00000"
            value={formData.mobile}
            onChange={(e) => handleChange('mobile', e.target.value)}
            icon={Phone}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => handleChange('password', e.target.value)}
            icon={Lock}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => handleChange('confirmPassword', e.target.value)}
            icon={Lock}
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Monthly Income (₹)"
            type="number"
            placeholder="e.g. 75000"
            value={formData.monthlyIncome}
            onChange={(e) => handleChange('monthlyIncome', e.target.value)}
          />
          <Select
            label="Risk Preference"
            value={formData.riskPreference}
            onChange={(e) => handleChange('riskPreference', e.target.value)}
            options={[
              { value: 'Conservative', label: 'Conservative (Low Risk)' },
              { value: 'Moderate', label: 'Moderate (Balanced)' },
              { value: 'Aggressive', label: 'Aggressive (High Growth)' },
            ]}
          />
        </div>

        <div className="pt-2">
          <label className="flex items-start gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={formData.agreeTerms}
              onChange={(e) => handleChange('agreeTerms', e.target.checked)}
              className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-800"
            />
            <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              I agree to the{' '}
              <a href="#terms" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={loading}
          className="w-full mt-3 btn-gradient"
          icon={ArrowRight}
          iconPosition="right"
        >
          Create Free Account
        </Button>
      </form>

      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400 font-medium">
        Already have an account?{' '}
        <Link to="/login" className="font-bold text-brand-600 dark:text-brand-400 hover:underline">
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default Register
