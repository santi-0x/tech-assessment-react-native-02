export function group(value) {
  const text = String(value)
  const negative = text.startsWith('-')
  const digits = negative ? text.slice(1) : text
  if (!/^\d+$/.test(digits)) {
    throw new Error('amount')
  }
  const parts = []
  for (let i = digits.length; i > 0; i -= 3) {
    parts.unshift(digits.slice(Math.max(0, i - 3), i))
  }
  return (negative ? '-' : '') + parts.join(',')
}
