const TRANSFER_SELECTOR = 'a9059cbb'

export function padHex(hex, bytes) {
  const body = String(hex).toLowerCase().replace(/^0x/, '')
  if (!/^[0-9a-f]+$/.test(body) || body.length > bytes * 2) {
    throw new Error('hex')
  }
  return body.padStart(bytes * 2, '0')
}

export function encodeTransfer(recipient, raw) {
  if (typeof raw !== 'bigint' || raw < 0n) {
    throw new Error('amount')
  }
  return '0x' + TRANSFER_SELECTOR + padHex(recipient, 32) + padHex(raw.toString(16), 32)
}
