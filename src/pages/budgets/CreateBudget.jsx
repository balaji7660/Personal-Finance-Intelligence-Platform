import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, PieChart } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'

export const CreateBudget = () => {
  const { addBudget } = useFinance()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    category: 'Food',
    limit: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-08-31',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.limit) {
      setError('Please provide budget name and limit amount.')
      return
    }

    setLoading(true)
    try {
      await addBudget(formData)
      navigate('/budgets')
    } catch {
      setError('Failed to create budget.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Create New Budget"
        subtitle="Establish monthly expenditure boundaries by category"
        breadcrumbs={['Budgets', 'Create Budget']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/budgets')}
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
            label="Budget Name"
            placeholder="e.g. Monthly Grocery & Dining Budget"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            icon={PieChart}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              options={[
                { value: 'Food', label: 'Food & Dining' },
                { value: 'Travel', label: 'Travel & Commute' },
                { value: 'Shopping', label: 'Shopping & Retail' },
                { value: 'Bills', label: 'Utility Bills' },
                { value: 'Education', label: 'Education & Courses' },
                { value: 'Healthcare', label: 'Healthcare & Fitness' },
                { value: 'Entertainment', label: 'Entertainment' },
                { value: 'Other', label: 'Other' },
              ]}
              required
            />
            <Input
              label="Monthly Limit in INR (₹)"
              type="number"
              placeholder="e.g. 15000"
              value={formData.limit}
              onChange={(e) => handleChange('limit', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(e) => handleChange('startDate', e.target.value)}
              required
            />
            <Input
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(e) => handleChange('endDate', e.target.value)}
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="secondary"
              onClick={() => navigate('/budgets')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Save}
            >
              Create Budget
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreateBudget
