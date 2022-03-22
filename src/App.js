import React from 'react'
import { SafeAreaView} from 'react-native'
import { NavigationContainer} from '@react-navigation/native'
import {createAppContainer, createSwitchNavigator} from 'react-navigation'
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons';
import {createStackNavigator} from '@react-navigation/stack'

import Auth from './views/Auth/Auth'
import AuthOrApp from './views/Auth/AuthOrApp'
import Dashboard from './views/Dashboard/Dashboard'
import Produto from './views/Produto/Produto'
import Reposicao from './views/Reposicao/Reposicao'
import Configuracao from './views/Configuracao/Configuracao'

const Tab = createBottomTabNavigator()

const Home = props => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName
                switch (route.name) {
                  case 'Dashboard':
                    iconName = 'home-outline'
                    break
                  case 'Produto':
                    iconName = 'cube-outline'
                    break
                  case 'Compra':
                    iconName = 'cart-outline'
                    break
                  case 'Reposicao':
                    iconName = 'swap-horizontal-outline'
                    break
                  case 'Configuracao':
                    iconName = 'cog-outline'
                    break
                }
                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color}/>;
              },
            })}
      tabBarOptions={{
        //showLabel: false
      }}>
      <Tab.Screen
        name= "Dashboard"
        component={Dashboard}
        options={{title: 'Dashboard'}}/>
      <Tab.Screen
        name= "Produto"
        component={Produto}
        options={{title: 'Produtos'}}/>
      <Tab.Screen
        name= "Reposicao"
        component={Reposicao}
        options={{title: 'Reposições'}}/>
      <Tab.Screen
        name= "Configuracao"
        component={Configuracao}
        options={{title: 'Configuração'}}/>
    </Tab.Navigator>
  )
}

const Stack = createStackNavigator()

export default props => {
  return (
    <SafeAreaView style= {{flex:1}}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="AuthOrApp"
          headerMode="none">
          <Stack.Screen name="AuthOrApp" component={AuthOrApp} options={{title: "Login"}}/>
          <Stack.Screen name="Auth" component={Auth} options={{title: "Login"}}/>
          <Stack.Screen name="Home" component={Home} options={{title: "Home"}}/>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  )
}


/*
const mainRoutes = {
  AuthOrApp: {
    name: 'AuthOrApp',
    screen: AuthOrApp
  },
  Auth: {
    name: 'Auth',
    screen: Auth
  },
  Home: {
    name: 'Home',
    screen: Home
  }
}

const mainNavigator = createSwitchNavigator(mainRoutes,{
  initialRouteName: 'AuthOrApp'
})

const AppContainer = createAppContainer(mainNavigator)

const App = props => {
  return (
    <SafeAreaView style= {{flex:1}}>
      <NavigationContainer>
        <AppContainer>
        </AppContainer>
      </NavigationContainer>
    </SafeAreaView>
  );
}

export default App
*/
