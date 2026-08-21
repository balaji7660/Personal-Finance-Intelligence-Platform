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

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { name, value, payload: itemPayload } = payload[0]
    return (
      <div className="bg-white dark:bg-slate-800 p-2.5 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 text-xs">
        <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-slate-200">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: itemPayload.color }} />
          <span>{name}</span>
        </div>
        <p className="text-slate-600 dark:text-slate-400 mt-1 font-bold">
          {formatCurrency(value)}
        </p>
      </div>
    )
  }
  return null
}

export const CategoryPieChart = ({ data = [], height = 280, showLegend = true }) => {
  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || '#2b8aff'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default CategoryPieChart
