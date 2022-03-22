import React from 'react'
import {createStackNavigator} from '@react-navigation/stack'

import Empresa from './EmpresaList'
import Repositor from './RepositorList'
import Pedido from './PedidoList'
import Endereco from './EnderecoList'
import Produto from './ProdutoList'
import ProdutoSearch from './ProdutoSearchList'
import Reposicao from './ReposicaoForm'

const Stack = createStackNavigator()

export default props => {
  return (
    <Stack.Navigator initialRouteName="Empresa"
      screenOptions={{headerShown: true}}>
      <Stack.Screen
        name="Empresa"
        options={{title: "Empresas"}}>
        {props => (
          <Empresa {...props} proximaTela='Repositor'>
          </Empresa>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Repositor"
        options={{title: "Repositores"}}>
        {props => (
          <Repositor {...props} proximaTela='Pedido'>
          </Repositor>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Pedido"
        options={{title: "Pedidos"}}>
        {props => (
          <Pedido {...props} proximaTela='Endereco'>
          </Pedido>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Endereco"
        options={{title: "Endereços"}}>
        {props => (
          <Endereco {...props} proximaTela='Produto'>
          </Endereco>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Produto"
        options={{title: "Produtos"}}>
        {props => (
          <Produto {...props} proximaTela='Reposicao'>
          </Produto>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Reposicao"
        options={{title: "Reposição"}}>
        {props => (
          <Reposicao {...props}>
          </Reposicao>
        )}
      </Stack.Screen>
      <Stack.Screen
        name="ProdutoSearch"
        options={{title: "Busca Por Produto"}}>
        {props => (
          <ProdutoSearch {...props}>
          </ProdutoSearch>
        )}
      </Stack.Screen>
    </Stack.Navigator>
  )
}
