import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Trash2, Receipt, Calendar } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import ConfirmDialog from '../../components/common/ConfirmDialog'

export const EditExpense = () => {
  const { id } = useParams()
  const { expenses, updateExpense, deleteExpense } = useFinance()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const found = expenses.find((e) => String(e.id) === String(id))
    if (found) {
      setFormData(found)
    }
  }, [id, expenses])

  if (!formData) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Expense not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/expenses')} className="mt-4">
          Back to Expenses
        </Button>
      </div>
    )
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await updateExpense(id, formData)
      navigate('/expenses')
    } catch (err) {
      setError('Failed to update expense.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    await deleteExpense(id)
    navigate('/expenses')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Edit Expense Record"
        subtitle={`Modifying transaction #${id}`}
        breadcrumbs={['Expenses', 'Edit']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/expenses')}
        >
          Back
        </Button>
        <Button
          variant="danger"
          size="sm"
          icon={Trash2}
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete
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
            label="Description / Merchant"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            icon={Receipt}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Amount in INR (₹)"
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange('amount', e.target.value)}
              required
            />
            <Select
              label="Category"
              value={formData.category}
              onChange={(e) => handleChange('category', e.target.value)}
              options={['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Healthcare', 'Entertainment', 'Other']}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Payment Method"
              value={formData.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
              options={['UPI', 'Credit Card', 'Debit Card', 'Cash', 'Bank Transfer', 'Other']}
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
              Notes
            </label>
            <textarea
              rows="3"
              value={formData.notes || ''}
              onChange={(e) => handleChange('notes', e.target.value)}
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Expense"
        message="Are you sure you want to delete this expense record permanently?"
      />
    </div>
  )
}

export default EditExpense
