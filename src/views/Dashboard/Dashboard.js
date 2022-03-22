import React from 'react'
import {StyleSheet} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'

import Dashboard from './DashboardScreen'

const Stack = createStackNavigator()

export default props => {
  return (
    <Stack.Navigator initialRouteName="Dashboard"
      screenOptions={{headerShown: true}}>
      <Stack.Screen
        name="Dashboard"
        options={{title: "Dashboard"}}>
        {props => (
          <Dashboard {...props}>
          </Dashboard>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}
