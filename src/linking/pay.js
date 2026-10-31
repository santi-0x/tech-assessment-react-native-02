import { CHAIN_ID, PAY_HOST, PAY_PROTOCOL } from '../config.js'
import { isAddress } from '../wallet/address.js'
import { assetBySymbol } from '../wallet/assets.js'
import { parseUnits } from '../wallet/amount.js'

export function acceptPayUrl(url) {
  let parsed
  try {
    parsed = new URL(url)
  } catch {
    return false
  }
  if (parsed.protocol !== PAY_PROTOCOL) {
    return false
  }
  if (parsed.hostname !== PAY_HOST) {
    return false
  }
  if (parsed.username || parsed.password) {
    return false
  }
  return true
}

export function payDraft(url) {
  if (!acceptPayUrl(url)) {
    throw new Error('url')
  }
  const parsed = new URL(url)
  const to = parsed.searchParams.get('to')
  const amount = parsed.searchParams.get('amount')
  const assetName = parsed.searchParams.get('asset')
  if (!isAddress(to)) {
    throw new Error('address')
  }
  const asset = assetBySymbol(assetName)
  if (!asset) {
    throw new Error('asset')
  }
  parseUnits(amount, asset.decimals)
  return {
    to,
    amount,
    symbol: asset.symbol,
    decimals: asset.decimals,
    native: asset.native,
    token: asset.token,
  }
}

export function draftForSend(account, params) {
  if (!account || !isAddress(account.address)) {
    throw new Error('account')
  }
  const base = payDraft(payUrl(params))
  return {
    from: account.address,
    chainId: CHAIN_ID,
    to: base.to,
    amount: base.amount,
    symbol: base.symbol,
    decimals: base.decimals,
    native: base.native,
    token: base.token,
  }
}

function payUrl(params) {
  if (!params) {
    throw new Error('url')
  }
  const query = new URLSearchParams()
  query.set('to', params.to || '')
  query.set('amount', params.amount || '')
  query.set('asset', params.asset || '')
  return 'harbor://pay?' + query.toString()
}
