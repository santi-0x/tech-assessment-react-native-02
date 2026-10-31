import { RECEIPT_HOST } from '../config.js'

export function allowReceipt(url) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return false
  }
  if (parsed.protocol !== 'https:') {
    return false
  }
  if (parsed.host !== RECEIPT_HOST) {
    return false
  }
  if (parsed.username || parsed.password) {
    return false
  }
  return true
}

export function receiptSource(url) {
  if (!allowReceipt(url)) {
    throw new Error('receipt')
  }
  return { uri: url }
}
