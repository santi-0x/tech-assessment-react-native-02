export function parseUnits(value, decimals) {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 36) {
    throw new Error('decimals')
  }
  const text = String(value).trim()
  if (!/^\d+(\.\d+)?$/.test(text)) {
    throw new Error('amount')
  }
  const [whole, frac = ''] = text.split('.')
  if (frac.length > decimals) {
    throw new Error('amount')
  }
  const base = whole + frac + '0'.repeat(decimals - frac.length)
  return BigInt(base)
}

export function formatUnits(raw, decimals) {
  if (!Number.isInteger(decimals) || decimals < 0 || decimals > 36) {
    throw new Error('decimals')
  }
  if (typeof raw !== 'bigint') {
    throw new Error('amount')
  }
  const negative = raw < 0n
  const value = negative ? -raw : raw
  const digits = value.toString().padStart(decimals + 1, '0')
  const whole = digits.slice(0, digits.length - decimals)
  const frac = digits.slice(digits.length - decimals).replace(/0+$/, '')
  const body = frac.length === 0 ? whole : whole + '.' + frac
  return negative ? '-' + body : body
}

export function hexQuantity(raw) {
  if (typeof raw !== 'bigint' || raw < 0n) {
    throw new Error('amount')
  }
  if (raw === 0n) {
    return '0x0'
  }
  return '0x' + raw.toString(16)
}
