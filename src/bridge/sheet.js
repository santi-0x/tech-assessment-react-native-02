import { isAddress } from '../wallet/address.js'

export function sheetFor(request, account) {
  if (!account || !isAddress(account.address)) {
    throw new Error('account')
  }
  if (!request || request.method !== 'eth_sendTransaction') {
    throw new Error('method')
  }
  const params = request.params
  if (!Array.isArray(params) || params.length === 0) {
    throw new Error('transaction')
  }
  const tx = params[0]
  if (!tx || typeof tx !== 'object') {
    throw new Error('transaction')
  }
  if (!isAddress(tx.to)) {
    throw new Error('address')
  }
  if (tx.from && tx.from.toLowerCase() !== account.address.toLowerCase()) {
    throw new Error('account')
  }
  const display = request.display || {}
  const to = display.to || tx.to
  const value = display.value || tx.value || '0x0'
  const data = display.data || tx.data || '0x'
  return {
    from: account.address,
    to,
    value,
    data,
    sign: {
      from: account.address,
      to: tx.to,
      value: tx.value || '0x0',
      data: tx.data || '0x',
    },
  }
}
