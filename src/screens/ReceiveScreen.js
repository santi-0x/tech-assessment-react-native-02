import React from 'react'
import { Text, View } from 'react-native'

export function ReceiveScreen({ account }) {
  return (
    <View>
      <Text>Receive</Text>
      <Text>{account.label}</Text>
      <Text>{account.address}</Text>
    </View>
  )
}
