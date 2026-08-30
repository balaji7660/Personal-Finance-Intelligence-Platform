import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Trash2, Target } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import ConfirmDialog from '../../components/common/ConfirmDialog'

export const EditGoal = () => {
  const { id } = useParams()
  const { goals, updateGoal, deleteGoal } = useFinance()
  const navigate = useNavigate()

  const [formData, setFormData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const found = goals.find((g) => String(g.id) === String(id))
    if (found) {
      setFormData(found)
    }
  }, [id, goals])

  if (!formData) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Goal not found.</p>
        <Button variant="outline" size="sm" onClick={() => navigate('/goals')} className="mt-4">
          Back to Goals
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
      await updateGoal(id, formData)
      navigate('/goals')
    } catch {
      setError('Failed to update goal.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    await deleteGoal(id)
    navigate('/goals')
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Edit Financial Goal"
        subtitle={`Update progress towards "${formData.name}"`}
        breadcrumbs={['Goals', 'Edit']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/goals')}
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
            label="Goal Name"
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
              options={['Emergency Fund', 'Education', 'Travel', 'Car', 'House', 'Retirement', 'Other']}
              required
            />
            <Select
              label="Priority Weight"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value)}
              options={['High', 'Medium', 'Low']}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Target Amount in INR (₹)"
              type="number"
              value={formData.targetAmount}
              onChange={(e) => handleChange('targetAmount', e.target.value)}
              required
            />
            <Input
              label="Saved So Far (₹)"
              type="number"
              value={formData.savedAmount}
              onChange={(e) => handleChange('savedAmount', e.target.value)}
              required
            />
          </div>

          <Input
            label="Target Date"
            type="date"
            value={formData.targetDate}
            onChange={(e) => handleChange('targetDate', e.target.value)}
            required
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Goal Notes
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Financial Goal"
        message="Are you sure you want to delete this goal?"
      />
    </div>
  )
}

export default EditGoal
