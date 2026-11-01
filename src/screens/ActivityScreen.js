import React, { useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { receiptSource } from '../browser/receipt'

export function ActivityScreen({ entries }) {
  const [page, setPage] = useState(null)
  const [error, setError] = useState('')

  function onOpen(entry) {
    try {
      setPage(receiptSource(entry.url))
      setError('')
    } catch {
      setError(entry.label)
    }
  }

  if (page) {
    return <WebView source={page} />
  }

  return (
    <View>
      {entries.map((entry) => (
        <Pressable key={entry.id} onPress={() => onOpen(entry)}>
          <Text>{entry.label}</Text>
        </Pressable>
      ))}
      <Text>{error}</Text>
    </View>
  )
}
