import React from 'react'
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from 'recharts'
import { formatCurrency } from '../../utils/currencyFormatter'

export const AssetAllocationChart = ({ investments = [], height = 300 }) => {
  // Aggregate by investment type
  const typeMap = {}
  investments.forEach((inv) => {
    const type = inv.type || 'Other'
    typeMap[type] = (typeMap[type] || 0) + Number(inv.currentValue || inv.investedAmount || 0)
  })

  const typeColors = {
    Stocks: '#3b82f6',
    'Mutual Funds': '#8b5cf6',
    ETFs: '#10b981',
    Bonds: '#f59e0b',
    'Other Investments': '#ec4899',
  }

  const data = Object.keys(typeMap).map((type) => ({
    name: type,
    value: typeMap[type],
    color: typeColors[type] || '#64748b',
  }))

  const total = data.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) => [
              `${formatCurrency(value)} (${total > 0 ? ((value / total) * 100).toFixed(1) : 0}%)`,
              'Allocation',
            ]}
          />
          <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default AssetAllocationChart
