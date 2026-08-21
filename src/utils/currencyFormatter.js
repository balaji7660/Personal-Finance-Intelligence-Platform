/**
 * Format numbers into Indian Rupee (₹) format with standard comma separation
 * Example: 150000 -> ₹1,50,000
 */
export const formatCurrency = (amount, options = {}) => {
  const {
    showSymbol = true,
    decimals = 0,
    compact = false
  } = options

  if (amount === undefined || amount === null || isNaN(amount)) {
    return showSymbol ? '₹0' : '0'
  }

  const num = Number(amount)

  if (compact) {
    if (Math.abs(num) >= 10000000) {
      return `${showSymbol ? '₹' : ''}${(num / 10000000).toFixed(2)} Cr`
    }
    if (Math.abs(num) >= 100000) {
      return `${showSymbol ? '₹' : ''}${(num / 100000).toFixed(2)} L`
    }
    if (Math.abs(num) >= 1000) {
      return `${showSymbol ? '₹' : ''}${(num / 1000).toFixed(1)} k`
    }
  }

  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals
  }).format(num)

  return showSymbol ? `₹${formatted}` : formatted
}

export const formatPercentage = (val, decimals = 1) => {
  if (val === undefined || val === null || isNaN(val)) return '0%'
  const num = Number(val)
  return `${num >= 0 ? '+' : ''}${num.toFixed(decimals)}%`
}
