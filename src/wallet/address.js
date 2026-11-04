export function isAddress(value) {
  return typeof value === 'string' && /^0x[0-9a-fA-F]{40}$/.test(value)
}
