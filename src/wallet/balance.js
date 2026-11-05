import { assetBySymbol } from './assets.js'
import { formatUnits } from './amount.js'

export function balanceView(rows) {
  if (!Array.isArray(rows)) {
    throw new Error('balance')
  }
  return rows.map((row) => {
    const asset = assetBySymbol(row.symbol)
    if (!asset) {
      throw new Error('asset')
    }
    if (typeof row.raw !== 'bigint' || row.raw < 0n) {
      throw new Error('amount')
    }
    return {
      symbol: asset.symbol,
      amount: formatUnits(row.raw, asset.decimals) + ' ' + asset.symbol,
    }
  })
}
