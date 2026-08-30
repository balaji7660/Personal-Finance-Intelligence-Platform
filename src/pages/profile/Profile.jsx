import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User,
  Mail,
  Phone,
  Wallet,
  Shield,
  MapPin,
  Briefcase,
  Calendar,
  Save,
  CheckCircle2,
  Camera,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { formatCurrency } from '../../utils/currencyFormatter'
import { formatDate } from '../../utils/dateUtils'
import PageHeader from '../../components/common/PageHeader'
import DashboardCard from '../../components/cards/DashboardCard'
import StatCard from '../../components/cards/StatCard'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'

export const Profile = () => {
  const { user, updateProfile } = useAuth()
  const navigate = useNavigate()

  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    fullName: user?.fullName || user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    monthlyIncome: user?.monthlyIncome || '',
    currency: user?.currency || 'INR (₹)',
    riskPreference: user?.riskPreference || 'Moderate',
    occupation: user?.occupation || '',
    location: user?.location || '',
  })

  const [savedSuccess, setSavedSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (field, val) => {
    setFormData((prev) => ({ ...prev, [field]: val }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await updateProfile(formData)
      setIsEditing(false)
      setSavedSuccess(true)
      setTimeout(() => setSavedSuccess(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Profile & Account"
        subtitle="Manage your personal identity, risk profile, and financial preferences"
        breadcrumbs={['Dashboard', 'Profile']}
      >
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/profile/preferences')}
          >
            Preferences
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/profile/security')}
          >
            Security & 2FA
          </Button>
          {!isEditing ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Edit Profile
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
          )}
        </div>
      </PageHeader>

      {savedSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-xs font-semibold text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          <span>Profile updated successfully!</span>
        </div>
      )}

      {/* User Header Profile Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="relative group">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt="User avatar"
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-4 border-slate-100 dark:border-slate-800 shadow-md"
          />
          <button
            type="button"
            className="absolute bottom-1 right-1 p-2 rounded-xl bg-brand-600 text-white shadow-md hover:bg-brand-700 transition-colors"
            title="Change Avatar"
          >
            <Camera className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {user?.fullName || user?.name || 'Your Name'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {formData.occupation
                  ? `${formData.occupation}${formData.location ? ` • ${formData.location}` : ''}`
                  : formData.location || 'Update your profile to add details'}
              </p>
            </div>
            <span className="inline-flex items-center self-center sm:self-start px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 dark:bg-brand-950/60 dark:text-brand-300 border border-brand-200 dark:border-brand-800">
              Verified Member
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400">Monthly Income</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                {formatCurrency(formData.monthlyIncome)}
              </p>
            </div>
            <div>
              <span className="text-slate-400">Currency</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{formData.currency}</p>
            </div>
            <div>
              <span className="text-slate-400">Risk Preference</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">{formData.riskPreference}</p>
            </div>
            <div>
              <span className="text-slate-400">Joined</span>
              <p className="font-bold text-slate-900 dark:text-white mt-0.5">
                {user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
                  : '—'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Form or Information Card */}
      <DashboardCard title={isEditing ? 'Edit Profile Information' : 'Personal Details & Settings'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              disabled={!isEditing}
              icon={User}
              required
            />
            <Input
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              disabled={!isEditing}
              icon={Mail}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Mobile Number"
              value={formData.mobile}
              onChange={(e) => handleChange('mobile', e.target.value)}
              disabled={!isEditing}
              icon={Phone}
            />
            <Input
              label="Monthly Income in INR (₹)"
              type="number"
              value={formData.monthlyIncome}
              onChange={(e) => handleChange('monthlyIncome', e.target.value)}
              disabled={!isEditing}
              icon={Wallet}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Default Currency"
              value={formData.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
              disabled={!isEditing}
              options={[
                { value: 'INR (₹)', label: 'Indian Rupee (₹)' },
                { value: 'USD ($)', label: 'US Dollar ($)' },
                { value: 'EUR (€)', label: 'Euro (€)' },
                { value: 'GBP (£)', label: 'British Pound (£)' },
              ]}
            />
            <Select
              label="Investment Risk Profile"
              value={formData.riskPreference}
              onChange={(e) => handleChange('riskPreference', e.target.value)}
              disabled={!isEditing}
              options={[
                { value: 'Conservative', label: 'Conservative (Capital Preservation)' },
                { value: 'Moderate', label: 'Moderate (Balanced Growth)' },
                { value: 'Aggressive', label: 'Aggressive (High Equity / Maximum Growth)' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Occupation / Role"
              value={formData.occupation}
              onChange={(e) => handleChange('occupation', e.target.value)}
              disabled={!isEditing}
              icon={Briefcase}
            />
            <Input
              label="City & Country"
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              disabled={!isEditing}
              icon={MapPin}
            />
          </div>

          {isEditing && (
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={loading} icon={Save}>
                Save Profile Changes
              </Button>
            </div>
          )}
        </form>
      </DashboardCard>
    </div>
  )
}

export default Profile
