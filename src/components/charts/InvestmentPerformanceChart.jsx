import React, { useMemo } from 'react'
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts'
import { formatCurrency } from '../../utils/currencyFormatter'
import { useFinance } from '../../hooks/useFinance'

export const InvestmentPerformanceChart = ({ height = 280 }) => {
  const { investments } = useFinance()

  // Build monthly portfolio data from real investments (last 8 months)
  const chartData = useMemo(() => {
    const now = new Date()
    const months = []
    for (let i = 7; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      months.push({
        month: d.toLocaleString('default', { month: 'short' }),
        year: d.getFullYear(),
        monthNum: d.getMonth(),
        portfolio: 0,
        nifty: 0,
      })
    }

    // For each investment, add its investedAmount to all months on/after its purchase date,
    // and its currentValue to the latest month only (linear interpolation for prior months)
    investments.forEach((inv) => {
      const purchased = new Date(inv.purchaseDate || now)
      const invested = Number(inv.investedAmount || 0)
      const current = Number(inv.currentValue || invested)
      const gain = current - invested

      months.forEach((m, idx) => {
        const mDate = new Date(m.year, m.monthNum, 1)
        if (mDate >= new Date(purchased.getFullYear(), purchased.getMonth(), 1)) {
          // Linearly interpolate growth across remaining months after purchase
          const totalMonths = months.length - 1
          const monthsSincePurchase = idx
          const fraction = totalMonths > 0 ? monthsSincePurchase / totalMonths : 1
          m.portfolio += invested + gain * fraction
        }
      })
    })

    // Nifty 50 benchmark: assume 12% annual return from same base
    const basePortfolio = months[0]?.portfolio || 0
    months.forEach((m, idx) => {
      const monthlyRate = Math.pow(1.12, 1 / 12) - 1
      m.nifty = basePortfolio * Math.pow(1 + monthlyRate, idx)
      m.portfolio = Math.round(m.portfolio)
      m.nifty = Math.round(m.nifty)
    })

    return months
  }, [investments])

  const hasData = investments.length > 0 && chartData.some(d => d.portfolio > 0)

  if (!hasData) {
    return (
      <div
        className="w-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 text-sm font-medium gap-2"
        style={{ height }}
      >
        <svg className="w-10 h-10 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
        <p>Add investments to see portfolio performance</p>
      </div>
    )
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#64748b', fontSize: 12 }}
            tickFormatter={(val) => formatCurrency(val, { compact: true })}
          />
          <Tooltip
            formatter={(value) => [formatCurrency(value), '']}
            contentStyle={{
              backgroundColor: '#1e293b',
              borderRadius: '8px',
              border: 'none',
              color: '#fff',
              fontSize: '12px',
            }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Line
            type="monotone"
            dataKey="portfolio"
            name="Your Portfolio"
            stroke="#8b5cf6"
            strokeWidth={3}
            dot={{ r: 4, fill: '#8b5cf6' }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="nifty"
            name="Nifty 50 Benchmark"
            stroke="#94a3b8"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default InvestmentPerformanceChart
