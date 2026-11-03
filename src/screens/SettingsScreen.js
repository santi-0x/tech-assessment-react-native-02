import React, { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { ROUTES } from '../navigation/routes'

export function SettingsScreen({ navigation, prefs }) {
  const [currency, setCurrency] = useState('USD')
  const [theme, setTheme] = useState('system')

  useEffect(() => {
    let live = true
    prefs.getCurrency().then((value) => {
      if (live) {
        setCurrency(value)
      }
    })
    prefs.getTheme().then((value) => {
      if (live) {
        setTheme(value)
      }
    })
    return () => {
      live = false
    }
  }, [prefs])

  async function onCurrency(code) {
    await prefs.setCurrency(code)
    setCurrency(code)
  }

  async function onTheme(next) {
    await prefs.setTheme(next)
    setTheme(next)
  }

  return (
    <View>
      <Text>{currency}</Text>
      <Text>{theme}</Text>
      <Pressable onPress={() => onCurrency('USD')}>
        <Text>USD</Text>
      </Pressable>
      <Pressable onPress={() => onCurrency('EUR')}>
        <Text>EUR</Text>
      </Pressable>
      <Pressable onPress={() => onTheme('light')}>
        <Text>Light</Text>
      </Pressable>
      <Pressable onPress={() => onTheme('dark')}>
        <Text>Dark</Text>
      </Pressable>
      <Pressable onPress={() => navigation.navigate(ROUTES.Backup)}>
        <Text>Backup</Text>
      </Pressable>
    </View>
  )
}
