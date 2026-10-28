import assert from 'node:assert/strict'
import { test } from 'node:test'
import { messageFrom } from '../src/bridge/message.js'
import { openableUrl } from '../src/browser/location.js'
import { allowReceipt, receiptSource } from '../src/browser/receipt.js'
import { CHAIN_ID } from '../src/config.js'
import { draftForSend, payDraft, acceptPayUrl } from '../src/linking/pay.js'
import { linking } from '../src/navigation/linking.js'
import { createMemoryStore } from '../src/storage/memory.js'
import { createPrefs } from '../src/storage/prefs.js'
import { encodeTransfer } from '../src/wallet/abi.js'
import { formatUnits, parseUnits } from '../src/wallet/amount.js'
import { balanceView } from '../src/wallet/balance.js'
import { sendCall, sendView } from '../src/wallet/send.js'

const ALICE = '0x' + '11'.repeat(20)
const BOB = '0x' + '22'.repeat(20)
const USDC = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'

function memoryStorage() {
  const map = new Map()
  return {
    async getItem(key) {
      return map.has(key) ? map.get(key) : null
    },
    async setItem(key, value) {
      map.set(key, String(value))
    },
  }
}

function word(data, index) {
  const body = data.slice(2)
  const start = 8 + index * 64
  return BigInt('0x' + body.slice(start, start + 64))
}

function addressWord(data, index) {
  const body = data.slice(2)
  const start = 8 + index * 64
  return '0x' + body.slice(start, start + 64).slice(24)
}

test('parseUnits honors the decimals it is given', () => {
  assert.equal(parseUnits('1', 6), 1_000_000n)
  assert.equal(parseUnits('1', 18), 10n ** 18n)
  assert.equal(parseUnits('1.5', 6), 1_500_000n)
  assert.equal(formatUnits(1_500_000n, 6), '1.5')
  assert.equal(formatUnits(parseUnits('250', 6), 6), '250')
  assert.throws(() => parseUnits('1.5', 0), /amount/)
  assert.throws(() => parseUnits('-1', 6), /amount/)
})

test('a usdc send uses that token decimals and the typed recipient', () => {
  const draft = {
    from: ALICE,
    to: BOB,
    amount: '250',
    symbol: 'USDC',
    decimals: 6,
    native: false,
    token: USDC,
    chainId: CHAIN_ID,
  }
  const view = sendView(draft)
  assert.equal(view.amount, '250 USDC')
  assert.equal(view.from, ALICE)
  assert.equal(view.to, BOB)
  const call = sendCall(draft)
  assert.equal(call.from, ALICE)
  assert.equal(call.to, USDC)
  assert.equal(call.value, '0x0')
  assert.equal(call.chainId, 1)
  assert.equal(call.data, encodeTransfer(BOB, 250_000_000n))
  assert.equal(addressWord(call.data, 0), BOB)
  assert.equal(word(call.data, 1), 250_000_000n)
})

test('a native send puts the value on the transaction', () => {
  const draft = {
    from: ALICE,
    to: BOB,
    amount: '1.5',
    symbol: 'ETH',
    decimals: 18,
    native: true,
    token: null,
    chainId: CHAIN_ID,
  }
  const view = sendView(draft)
  assert.equal(view.amount, '1.5 ETH')
  const call = sendCall(draft)
  assert.equal(call.to, BOB)
  assert.equal(call.value, '0x' + parseUnits('1.5', 18).toString(16))
  assert.equal(call.data, '0x')
  assert.equal(call.from, ALICE)
})

test('the sender is the account on the draft', () => {
  const first = draftForSend({ address: ALICE }, { to: BOB, amount: '1', asset: 'ETH' })
  const second = draftForSend({ address: BOB }, { to: ALICE, amount: '1', asset: 'ETH' })
  assert.equal(sendCall(first).from, ALICE)
  assert.equal(sendCall(second).from, BOB)
  assert.equal(sendCall(first).to, BOB)
  assert.equal(sendCall(second).to, ALICE)
})

test('a payment link is harbor pay and does not carry calldata', () => {
  const url =
    'harbor://pay?to=' + BOB + '&amount=250&asset=USDC&data=0xa9059cbb'
  assert.equal(acceptPayUrl(url), true)
  assert.equal(acceptPayUrl('https://pay/?to=' + BOB), false)
  assert.equal(acceptPayUrl('harbor://notpay?to=' + BOB), false)
  assert.equal(acceptPayUrl('harbor://pay.evil.example?to=' + BOB), false)
  assert.equal(acceptPayUrl('harbor://evilpay?to=' + BOB), false)
  assert.equal(acceptPayUrl('http://pay/?to=' + BOB), false)
  const draft = payDraft(url)
  assert.equal(draft.to, BOB)
  assert.equal(draft.amount, '250')
  assert.equal(draft.symbol, 'USDC')
  assert.equal(draft.decimals, 6)
  assert.equal(draft.native, false)
  assert.equal(draft.token, USDC)
  assert.equal(Object.hasOwn(draft, 'data'), false)
  const built = draftForSend(
    { address: ALICE },
    { to: BOB, amount: '250', asset: 'USDC', data: '0xdead' }
  )
  assert.equal(built.from, ALICE)
  assert.equal(Object.hasOwn(built, 'data'), false)
  assert.equal(sendCall(built).data, encodeTransfer(BOB, 250_000_000n))
})

test('a receipt url is https on the receipt host', () => {
  const url = 'https://receipts.harbor.app/r/9'
  assert.equal(allowReceipt(url), true)
  assert.deepEqual(receiptSource(url), { uri: url })
  assert.equal(allowReceipt('http://receipts.harbor.app/r/9'), false)
  assert.equal(allowReceipt('https://notreceipts.harbor.app/r/9'), false)
  assert.equal(allowReceipt('https://evil.receipts.harbor.app/r/9'), false)
  assert.equal(allowReceipt('https://receipts.harbor.app.evil.com/r/9'), false)
  assert.equal(allowReceipt('https://user:pass@receipts.harbor.app/r/9'), false)
  assert.throws(() => receiptSource('https://evil.example/r/9'), /receipt/)
})

test('the browser opens https and accepts that origin only', () => {
  assert.equal(openableUrl('https://app.example/trade'), 'https://app.example')
  assert.equal(openableUrl('http://app.example/trade'), null)
  assert.equal(openableUrl('javascript:alert(1)'), null)
  assert.equal(openableUrl('https://user:pass@app.example/'), null)
  const opened = 'https://app.example'
  const event = {
    nativeEvent: {
      url: 'https://app.example/trade',
      data: JSON.stringify({ method: 'eth_sendTransaction', id: 1 }),
    },
  }
  assert.equal(messageFrom(event, opened).method, 'eth_sendTransaction')
  assert.throws(
    () =>
      messageFrom(
        {
          nativeEvent: {
            url: 'https://app.example.evil.com/trade',
            data: event.nativeEvent.data,
          },
        },
        opened
      ),
    /origin/
  )
  assert.throws(
    () =>
      messageFrom(
        {
          nativeEvent: {
            url: 'https://evil.com/trade',
            data: event.nativeEvent.data,
          },
        },
        opened
      ),
    /origin/
  )
  assert.throws(
    () =>
      messageFrom(
        {
          nativeEvent: {
            url: 'http://app.example/trade',
            data: event.nativeEvent.data,
          },
        },
        opened
      ),
    /origin/
  )
})

test('linking maps the pay host onto send', () => {
  assert.deepEqual(linking.prefixes, ['harbor://'])
  assert.equal(linking.config.screens.Send.path, 'pay')
})

test('balances format with the asset decimals', () => {
  const lines = balanceView([
    { symbol: 'ETH', raw: parseUnits('1.5', 18) },
    { symbol: 'USDC', raw: parseUnits('250', 6) },
  ])
  assert.deepEqual(lines, [
    { symbol: 'ETH', amount: '1.5 ETH' },
    { symbol: 'USDC', amount: '250 USDC' },
  ])
})

test('preferences and the memory store round-trip', async () => {
  const prefs = createPrefs(memoryStorage())
  assert.equal(await prefs.getCurrency(), 'USD')
  await prefs.setCurrency('EUR')
  await prefs.setTheme('dark')
  assert.equal(await prefs.getCurrency(), 'EUR')
  assert.equal(await prefs.getTheme(), 'dark')
  await assert.rejects(prefs.setCurrency('GBP'), /currency/)
  const store = createMemoryStore()
  await store.set('app.harbor.seed', 'alice', 'ocean topic verb')
  assert.equal(await store.get('app.harbor.seed', 'alice'), 'ocean topic verb')
  await assert.rejects(store.get('app.harbor.seed', 'bob'), /seed/)
})

test('a send rejects a bad amount, a self transfer, and the wrong chain', () => {
  const draft = {
    from: ALICE,
    to: BOB,
    amount: '1',
    symbol: 'ETH',
    decimals: 18,
    native: true,
    token: null,
    chainId: CHAIN_ID,
  }
  assert.throws(() => sendCall({ ...draft, amount: '0' }), /amount/)
  assert.throws(() => sendCall({ ...draft, to: ALICE }), /address/)
  assert.throws(() => sendCall({ ...draft, chainId: 10 }), /chain/)
})
