import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Target } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'

export const CreateGoal = () => {
  const { addGoal } = useFinance()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    type: 'Emergency Fund',
    targetAmount: '',
    savedAmount: '',
    targetDate: '',
    priority: 'High',
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.targetAmount || !formData.targetDate) {
      setError('Please provide goal name, target amount, and target completion date.')
      return
    }

    setLoading(true)
    try {
      await addGoal({
        ...formData,
        savedAmount: formData.savedAmount || '0',
      })
      navigate('/goals')
    } catch {
      setError('Failed to create goal.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Create New Financial Goal"
        subtitle="Establish target milestones with planned timelines and priority weights"
        breadcrumbs={['Goals', 'Create Goal']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/goals')}
        >
          Back
        </Button>
      </PageHeader>

      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 p-6 sm:p-8 shadow-card">
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-xs text-rose-600 font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Goal Title"
            placeholder="e.g. 6 Months Emergency Buffer Fund"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            icon={Target}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Goal Type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              options={[
                { value: 'Emergency Fund', label: 'Emergency Fund' },
                { value: 'Education', label: 'Education & Upskilling' },
                { value: 'Travel', label: 'Vacation & Travel' },
                { value: 'Car', label: 'Vehicle Purchase' },
                { value: 'House', label: 'Real Estate / Home' },
                { value: 'Retirement', label: 'Retirement Corpus' },
                { value: 'Other', label: 'Other Milestone' },
              ]}
              required
            />
            <Select
              label="Priority Weight"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              options={[
                { value: 'High', label: 'High Priority (Essential)' },
                { value: 'Medium', label: 'Medium Priority' },
                { value: 'Low', label: 'Low Priority (Aspirational)' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Amount in INR (₹)"
              type="number"
              placeholder="e.g. 300000"
              value={formData.targetAmount}
              onChange={(e) => handleChange('targetAmount', e.target.value)}
              required
            />
            <Input
              label="Already Saved (₹)"
              type="number"
              placeholder="e.g. 50000 (optional)"
              value={formData.savedAmount}
              onChange={(e) => handleChange('savedAmount', e.target.value)}
            />
          </div>

          <Input
            label="Target Completion Date"
            type="date"
            value={formData.targetDate}
            onChange={(e) => handleChange('targetDate', e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Goal Notes & Plan
            </label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="e.g. Parked in arbitrage funds and high interest savings account..."
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="secondary"
              onClick={() => navigate('/goals')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Save}
            >
              Create Goal
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateGoal
