import React, { forwardRef } from 'react'

export const Select = forwardRef(({
  label,
  error,
  helperText,
  options = [],
  className = '',
  id,
  required = false,
  placeholder = 'Select an option',
  children,
  ...props
}, ref) => {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        <select
          ref={ref}
          id={selectId}
          required={required}
          className={`block w-full rounded-lg border text-sm transition-colors duration-200 px-3.5 py-2.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white
            ${error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500'
              : 'border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:ring-brand-500'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((opt) => (
            <option key={opt.value || opt} value={opt.value || opt}>
              {opt.label || opt}
            </option>
          ))}
          {children}
        </select>
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  )
})

Select.displayName = 'Select'
export default Select
