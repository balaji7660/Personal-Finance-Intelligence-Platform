import React from 'react'
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

const mockPerformance = [
  { month: 'Jan', portfolio: 210000, nifty: 200000 },
  { month: 'Feb', portfolio: 215000, nifty: 204000 },
  { month: 'Mar', portfolio: 228000, nifty: 212000 },
  { month: 'Apr', portfolio: 224000, nifty: 210000 },
  { month: 'May', portfolio: 236000, nifty: 219000 },
  { month: 'Jun', portfolio: 248000, nifty: 225000 },
  { month: 'Jul', portfolio: 260000, nifty: 234000 },
  { month: 'Aug', portfolio: 275800, nifty: 242000 },
]

export const InvestmentPerformanceChart = ({ data = mockPerformance, height = 280 }) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
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
