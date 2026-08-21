import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Receipt, CreditCard, Calendar, Tag, FileText } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'

export const AddExpense = () => {
  const { addExpense } = useFinance()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: 'Food',
    paymentMethod: 'UPI',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.description || !formData.amount) {
      setError('Please provide expense description and amount.')
      return
    }

    setLoading(true)
    try {
      await addExpense(formData)
      navigate('/expenses')
    } catch (err) {
      setError('Failed to record expense.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Add New Expense"
        subtitle="Record an outlay to keep your monthly cash flow updated"
        breadcrumbs={['Expenses', 'Add Expense']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/expenses')}
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
            label="Expense Description / Merchant"
            placeholder="e.g. Swiggy gourmet delivery, Airtel broadband bill"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            icon={Receipt}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Amount in INR (₹)"
              type="number"
              placeholder="e.g. 1500"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              required
            />
            <Select
              label="Spending Category"
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
                { value: 'Other', label: 'Other Expenses' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Payment Method"
              value={formData.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              options={[
                { value: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)' },
                { value: 'Credit Card', label: 'Credit Card' },
                { value: 'Debit Card', label: 'Debit Card' },
                { value: 'Cash', label: 'Cash' },
                { value: 'Bank Transfer', label: 'Net Banking / NEFT' },
                { value: 'Other', label: 'Other' },
              ]}
              required
            />
            <Input
              label="Transaction Date"
              type="date"
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              icon={Calendar}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Additional Notes (Optional)
            </label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="Add receipt notes, tax deduction 80C notes, or project context..."
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="secondary"
              onClick={() => navigate('/expenses')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Save}
            >
              Save Expense
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddExpense
