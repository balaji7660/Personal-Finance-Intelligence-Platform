import React, { forwardRef } from 'react'

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  type = 'text',
  className = '',
  id,
  required = false,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative rounded-lg shadow-sm">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          type={type}
          id={inputId}
          required={required}
          className={`block w-full rounded-lg border text-sm transition-colors duration-200
            ${Icon ? 'pl-9' : 'pl-3.5'} pr-3.5 py-2.5
            ${error
              ? 'border-rose-500 text-rose-900 placeholder-rose-400 focus:border-rose-500 focus:ring-rose-500'
              : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 focus:border-brand-500 focus:ring-brand-500'
            }
            focus:outline-none focus:ring-2 focus:ring-opacity-20
            disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:cursor-not-allowed
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{helperText}</p>}
    </div>
  )
})

Input.displayName = 'Input'
export default Input
