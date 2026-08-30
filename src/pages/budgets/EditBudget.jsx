import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Trash2, PieChart } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import ConfirmDialog from '../../components/common/ConfirmDialog'

export const EditBudget = () => {
  const { id } = useParams()
  const { budgets, updateBudget, deleteBudget } = useFinance()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const found = budgets.find((b) => String(b.id) === String(id))
    if (found) {
      setFormData(found)
    }
  }, [id, budgets])

  if (!formData) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-slate-500">Budget not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/budgets')} className="mt-4">
          Back to Budgets
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
      await updateBudget(id, formData)
      navigate('/budgets')
    } catch {
      setError('Failed to update budget.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    await deleteBudget(id)
    navigate('/budgets')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Edit Budget Limit"
        subtitle={`Adjust monthly constraints for ${formData.name}`}
        breadcrumbs={['Budgets', 'Edit']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/budgets')}
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
            label="Budget Name"
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
              options={['Food', 'Travel', 'Shopping', 'Bills', 'Education', 'Healthcare', 'Entertainment', 'Other']}
              required
            />
            <Input
              label="Monthly Limit in INR (₹)"
              type="number"
              value={formData.limit}
              onChange={(e) => handleChange('limit', e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Amount Spent (₹)"
              type="number"
              value={formData.spent}
              onChange={(e) => handleChange('spent', e.target.value)}
              required
            />
            <Input
              label="Start Date"
              type="date"
              value={formData.startDate || ''}
              onChange={(e) => handleChange('startDate', e.target.value)}
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Category Budget"
        message="Are you sure you want to delete this budget?"
      />
    </div>
  )
}

export default EditBudget
