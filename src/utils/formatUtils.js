export function formatCurrency(amount, currency = 'TWD', locale = 'zh-TW') {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount)
}

export function truncate(str, maxLength = 50) {
  if (str.length <= maxLength) return str
  return str.slice(0, maxLength) + '...'
}
