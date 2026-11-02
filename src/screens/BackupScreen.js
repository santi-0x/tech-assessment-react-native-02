import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { approve } from '../auth/gate'

export function BackupScreen({ prompt, vault, account }) {
  const [phrase, setPhrase] = useState('')

  async function onReveal() {
    const decision = await approve(prompt, 'Reveal seed')
    if (!decision.ok) {
      return
    }
    const secret = await vault.getSeed(account.id)
    setPhrase(secret)
  }

  return (
    <View>
      <Text>Backup</Text>
      <Pressable onPress={onReveal}>
        <Text>Reveal</Text>
      </Pressable>
      <Text>{phrase}</Text>
    </View>
  )
}
