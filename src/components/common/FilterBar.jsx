import React from 'react'

export const FilterBar = ({
  options = [],
  activeValue,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 ${className}`}>
      {options.map((opt) => {
        const value = typeof opt === 'string' ? opt : opt.value
        const label = typeof opt === 'string' ? opt : opt.label
        const isActive = activeValue === value

        return (
          <button
            key={value}
            onClick={() => onChange(value)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              isActive
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

export default FilterBar
