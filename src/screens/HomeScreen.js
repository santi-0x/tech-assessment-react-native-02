import React from 'react'
import { Pressable, Text, View } from 'react-native'
import { ROUTES } from '../navigation/routes'
import { balanceView } from '../wallet/balance'

export function HomeScreen({ navigation, account, rows }) {
  const lines = balanceView(rows)
  return (
    <View>
      <Text>{account.label}</Text>
      <Text>{account.address}</Text>
      {lines.map((line) => (
        <Text key={line.symbol}>{line.amount}</Text>
      ))}
      <Pressable onPress={() => navigation.navigate(ROUTES.Send)}>
        <Text>Send</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate(ROUTES.Receive)}>
        <Text>Receive</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate(ROUTES.Activity)}>
        <Text>Activity</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate(ROUTES.Browser)}>
        <Text>Browser</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate(ROUTES.Settings)}>
        <Text>Settings</Text>
      </Pressable>
    </View>
  )
}
