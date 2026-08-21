import React from 'react'

export const HealthScoreGauge = ({ score = 78, max = 100 }) => {
  const percentage = Math.min(100, Math.max(0, (score / max) * 100))
  const circumference = 2 * Math.PI * 40
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  let statusText = 'Good'
  let colorHex = '#10b981' // emerald

  if (score >= 80) {
    statusText = 'Excellent'
    colorHex = '#10b981'
  } else if (score >= 65) {
    statusText = 'Good'
    colorHex = '#2b8aff'
  } else if (score >= 50) {
    statusText = 'Fair'
    colorHex = '#f59e0b'
  } else {
    statusText = 'Needs Attention'
    colorHex = '#f43f5e'
  }

  return (
    <div className="flex flex-col items-center justify-center relative py-2">
      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="10"
            className="text-slate-100 dark:text-slate-800"
            fill="transparent"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke={colorHex}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
            {score}
          </span>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            out of {max}
          </span>
        </div>
      </div>

      <div className="mt-3 text-center">
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
          style={{ backgroundColor: `${colorHex}1a`, color: colorHex }}
        >
          {statusText} Financial Health
        </span>
      </div>
    </div>
  )
}

export default HealthScoreGauge
