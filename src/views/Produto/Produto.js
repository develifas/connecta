import React from 'react'
import {StyleSheet} from 'react-native'
import {createStackNavigator} from '@react-navigation/stack'

import Produto from './ProdutoList'
import ProdutoEmpresa from './ProdutoEmpresaList'
import ProdutoEmpresaForm from './ProdutoEmpresaForm'

const Stack = createStackNavigator()

export default props => {
  return (
    <Stack.Navigator initialRouteName="Produto"
      screenOptions={{headerShown: true}}>
      <Stack.Screen
        name="Produto"
        options={{title: "Produtos"}}>
        {props => (
          <Produto {...props}>
          </Produto>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="ProdutoEmpresa"
        options={{title: "Empresas"}}>
        {props => (
          <ProdutoEmpresa {...props}>
          </ProdutoEmpresa>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="ProdutoEmpresaForm"
        options={{title: "Produto x Empresa"}}>
        {props => (
          <ProdutoEmpresaForm {...props}>
          </ProdutoEmpresaForm>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}
