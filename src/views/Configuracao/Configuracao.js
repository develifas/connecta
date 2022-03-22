import React from 'react'
import {StyleSheet} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'

import Configuracao from './ConfiguracaoScreen'

const Stack = createStackNavigator()

export default props => {
  return (
    <Stack.Navigator initialRouteName="Configuracao"
      screenOptions={{headerShown: true}}>
      <Stack.Screen
        name="Configuracao"
        options={{title: "Configuração"}}>
        {props => (
          <Configuracao {...props}>
          </Configuracao>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}
