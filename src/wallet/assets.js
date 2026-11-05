export const ASSETS = [
  {
    symbol: 'ETH',
    decimals: 18,
    native: true,
    token: null,
  },
  {
    symbol: 'USDC',
    decimals: 6,
    native: false,
    token: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  },
]

export function assetBySymbol(symbol) {
  return ASSETS.find((asset) => asset.symbol === symbol) || null
}
