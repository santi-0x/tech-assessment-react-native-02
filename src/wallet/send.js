import { CHAIN_ID } from '../config.js'
import { encodeTransfer } from './abi.js'
import { isAddress } from './address.js'
import { hexQuantity, parseUnits, formatUnits } from './amount.js'

export function sendView(draft) {
  const raw = parseUnits(draft.amount, draft.decimals)
  return {
    from: draft.from,
    to: draft.to,
    asset: draft.symbol,
    amount: formatUnits(raw, draft.decimals) + ' ' + draft.symbol,
    chainId: draft.chainId,
  }
}

export function sendCall(draft) {
  if (!isAddress(draft.from) || !isAddress(draft.to)) {
    throw new Error('address')
  }
  if (draft.from.toLowerCase() === draft.to.toLowerCase()) {
    throw new Error('address')
  }
  if (draft.chainId !== CHAIN_ID) {
    throw new Error('chain')
  }
  const raw = parseUnits(draft.amount, draft.decimals)
  if (raw <= 0n) {
    throw new Error('amount')
  }
  if (draft.native) {
    return {
      from: draft.from,
      to: draft.to,
      value: hexQuantity(raw),
      data: '0x',
      chainId: draft.chainId,
    }
  }
  if (!isAddress(draft.token)) {
    throw new Error('address')
  }
  return {
    from: draft.from,
    to: draft.token,
    value: '0x0',
    data: encodeTransfer(draft.to, raw),
    chainId: draft.chainId,
  }
}
