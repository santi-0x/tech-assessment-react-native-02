import React, { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { approve } from '../auth/gate'
import { payDraft, draftForSend } from '../linking/pay'
import { sendCall, sendView } from '../wallet/send'

function seedFrom(params) {
  if (params && params.url) {
    try {
      const draft = payDraft(params.url)
      return { to: draft.to, amount: draft.amount, asset: draft.symbol }
    } catch {
      return { to: '', amount: '', asset: 'ETH' }
    }
  }
  return {
    to: (params && params.to) || '',
    amount: (params && params.amount) || '',
    asset: (params && params.asset) || 'ETH',
  }
}

export function SendScreen({ route, account, prompt, onBroadcast }) {
  const seeded = seedFrom(route.params)
  const [to, setTo] = useState(seeded.to)
  const [amount, setAmount] = useState(seeded.amount)
  const [asset, setAsset] = useState(seeded.asset)
  const [status, setStatus] = useState('')

  async function onSend() {
    const draft = draftForSend(account, { to, amount, asset })
    const view = sendView(draft)
    const decision = await approve(prompt, 'Send ' + view.amount)
    if (!decision.ok) {
      setStatus('')
      return
    }
    setStatus(view.amount)
    onBroadcast(sendCall(draft))
  }

  return (
    <View>
      <TextInput value={to} onChangeText={setTo} autoCapitalize="none" />
      <TextInput value={amount} onChangeText={setAmount} />
      <Pressable onPress={() => setAsset('ETH')}>
        <Text>ETH</Text>
      </Pressable>
      <Pressable onPress={() => setAsset('USDC')}>
        <Text>USDC</Text>
      </Pressable>
      <Text>{asset}</Text>
      <Text>{status}</Text>
      <Pressable onPress={onSend}>
        <Text>Send</Text>
      </Pressable>
    </View>
  )
}
