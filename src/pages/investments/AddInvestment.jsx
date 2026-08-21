import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, TrendingUp, ShieldCheck } from 'lucide-react'
import { useFinance } from '../../hooks/useFinance'
import PageHeader from '../../components/common/PageHeader'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'

export const AddInvestment = () => {
  const { addInvestment } = useFinance()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    type: 'Mutual Funds',
    investedAmount: '',
    currentValue: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    quantity: '1',
    riskLevel: 'Moderate',
    notes: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.investedAmount) {
      setError('Please provide investment name and invested amount.')
      return
    }

    setLoading(true)
    try {
      await addInvestment({
        ...formData,
        currentValue: formData.currentValue || formData.investedAmount,
      })
      navigate('/investments')
    } catch {
      setError('Failed to record investment.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <PageHeader
        title="Add Investment Asset"
        subtitle="Log new mutual funds, stocks, bonds or gold into your net worth tracker"
        breadcrumbs={['Investments', 'Add Investment']}
      >
        <Button
          variant="outline"
          size="sm"
          icon={ArrowLeft}
          onClick={() => navigate('/investments')}
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
            label="Instrument / Scheme / Stock Name"
            placeholder="e.g. Parag Parikh Flexi Cap Fund / TCS"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            icon={TrendingUp}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Asset Type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
              options={[
                { value: 'Mutual Funds', label: 'Mutual Funds' },
                { value: 'Stocks', label: 'Direct Equities (Stocks)' },
                { value: 'ETFs', label: 'Exchange Traded Funds (ETFs)' },
                { value: 'Bonds', label: 'Bonds & Fixed Income' },
                { value: 'Other Investments', label: 'SGB / Gold / Real Estate' },
              ]}
              required
            />
            <Select
              label="Risk Assessment"
              value={formData.riskLevel}
              onChange={(e) => handleChange('riskLevel', e.target.value)}
              options={[
                { value: 'Low', label: 'Low Risk (Bonds / SGB / Bluechips)' },
                { value: 'Moderate', label: 'Moderate Risk (Flexi Cap / Index)' },
                { value: 'High', label: 'High Risk (Small Cap / Sectoral)' },
              ]}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Invested Amount in INR (₹)"
              type="number"
              placeholder="e.g. 50000"
              value={formData.investedAmount}
              onChange={(e) => handleChange('investedAmount', e.target.value)}
              required
            />
            <Input
              label="Current Valuation in INR (₹)"
              type="number"
              placeholder="Leave blank if same as invested"
              value={formData.currentValue}
              onChange={(e) => handleChange('currentValue', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Quantity / Units Held"
              type="number"
              step="any"
              placeholder="e.g. 100"
              value={formData.quantity}
              onChange={(e) => handleChange('quantity', e.target.value)}
            />
            <Input
              label="Purchase Date"
              type="date"
              value={formData.purchaseDate}
              onChange={(e) => handleChange('purchaseDate', e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Portfolio Strategy Notes
            </label>
            <textarea
              rows="3"
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              placeholder="e.g. Monthly SIP of ₹5,000 via Zerodha Coin..."
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white px-3.5 py-2.5 text-sm placeholder-slate-400 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              variant="secondary"
              onClick={() => navigate('/investments')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Save}
            >
              Save Investment
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddInvestment
