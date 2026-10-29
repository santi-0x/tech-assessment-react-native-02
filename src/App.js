import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Root } from './navigation/Root'
import { createKeychainStore } from './storage/keychain'
import { createPrefs } from './storage/prefs'

export function App({ account, rows, entries, prompt, native, onBroadcast, onSigned }) {
  const vault = createKeychainStore(native)
  const prefs = createPrefs(AsyncStorage)
  return (
    <Root
      account={account}
      rows={rows}
      entries={entries}
      prompt={prompt}
      vault={vault}
      prefs={prefs}
      onBroadcast={onBroadcast}
      onSigned={onSigned}
    />
  )
}
