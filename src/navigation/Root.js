import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { linking } from './linking'
import { ROUTES } from './routes'
import { ActivityScreen } from '../screens/ActivityScreen'
import { BackupScreen } from '../screens/BackupScreen'
import { BrowserScreen } from '../screens/BrowserScreen'
import { HomeScreen } from '../screens/HomeScreen'
import { ReceiveScreen } from '../screens/ReceiveScreen'
import { SendScreen } from '../screens/SendScreen'
import { SettingsScreen } from '../screens/SettingsScreen'

const Stack = createNativeStackNavigator()

export function Root({ account, rows, entries, prompt, vault, prefs, onBroadcast, onSigned }) {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator>
        <Stack.Screen name={ROUTES.Home}>
          {({ navigation }) => (
            <HomeScreen navigation={navigation} account={account} rows={rows} />
          )}
        </Stack.Screen>
        <Stack.Screen name={ROUTES.Send}>
          {({ navigation, route }) => (
            <SendScreen
              navigation={navigation}
              route={route}
              account={account}
              prompt={prompt}
              onBroadcast={onBroadcast}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name={ROUTES.Receive}>
          {() => <ReceiveScreen account={account} />}
        </Stack.Screen>
        <Stack.Screen name={ROUTES.Activity}>
          {() => <ActivityScreen entries={entries} />}
        </Stack.Screen>
        <Stack.Screen name={ROUTES.Browser}>
          {() => (
            <BrowserScreen account={account} prompt={prompt} onSigned={onSigned} />
          )}
        </Stack.Screen>
        <Stack.Screen name={ROUTES.Settings}>
          {({ navigation }) => <SettingsScreen navigation={navigation} prefs={prefs} />}
        </Stack.Screen>
        <Stack.Screen name={ROUTES.Backup}>
          {() => <BackupScreen prompt={prompt} vault={vault} account={account} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}
