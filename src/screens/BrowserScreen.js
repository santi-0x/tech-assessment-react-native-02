import React, { useState } from 'react'
import { Pressable, Text, TextInput, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { approve } from '../auth/gate'
import { messageFrom } from '../bridge/message'
import { sheetFor } from '../bridge/sheet'
import { openableUrl } from '../browser/location'

export function BrowserScreen({ account, prompt, onSigned }) {
  const [input, setInput] = useState('')
  const [uri, setUri] = useState('')
  const [origin, setOrigin] = useState('')
  const [request, setRequest] = useState(null)
  const [status, setStatus] = useState('')

  function onOpen() {
    const next = openableUrl(input)
    if (!next) {
      setStatus('')
      return
    }
    setOrigin(next)
    setUri(input)
    setRequest(null)
  }

  function onMessage(event) {
    let body
    try {
      body = messageFrom(event, origin)
    } catch {
      return
    }
    setRequest(body)
  }

  let sheet = null
  if (request) {
    try {
      sheet = sheetFor(request, account)
    } catch {
      sheet = null
    }
  }

  async function onSign() {
    if (!sheet) {
      return
    }
    const decision = await approve(prompt, 'Sign transaction')
    if (!decision.ok) {
      return
    }
    setStatus(sheet.value)
    onSigned(sheet.sign)
  }

  if (!uri) {
    return (
      <View>
        <TextInput value={input} onChangeText={setInput} autoCapitalize="none" />
        <Pressable onPress={onOpen}>
          <Text>Open</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <View>
      <WebView source={{ uri }} onMessage={onMessage} />
      {sheet ? (
        <View>
          <Text>{sheet.to}</Text>
          <Text>{sheet.value}</Text>
          <Text>{sheet.data}</Text>
          <Pressable onPress={onSign}>
            <Text>Sign</Text>
          </Pressable>
          <Text>{status}</Text>
        </View>
      ) : null}
    </View>
  )
}
