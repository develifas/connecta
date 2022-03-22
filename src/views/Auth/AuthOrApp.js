import React, { Component } from 'react'
import {StyleSheet, View, ActivityIndicator} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

import {oapiUrl} from '../../common'

export default class AuthOrApp extends Component {

  componentDidMount = async () => {
    this.loginOrHome()
    //mecanismo para atualizar no goBack()
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
      this.loginOrHome()
    })
  }

  //necessario para a atualização no goBack()
  componentWillUnmount = () => {
    // Remove the event listener
    if (this.focusListener != null && this.focusListener.remove) {
      this.focusListener.remove();
    }
  }

  loginOrHome = async () => {
    const userDataJson = await AsyncStorage.getItem('userData')
    let userData

    try {
      userData = JSON.parse(userDataJson)
    } catch(e) {
      //userData invalido
    }

    if (userData && userData.token) {
      try {
        const res = await axios.post(`${oapiUrl}/validateToken`,{
          user: userData._id,
          token: userData.token
        })
        axios.defaults.headers.common['Authorization'] = `${userData.email}|${userData.token}`
        this.props.navigation.navigate('Home',userData)
      } catch(e) {
        delete axios.defaults.headers.common['Authorization']
        AsyncStorage.removeItem('userData')
        this.props.navigation.navigate('Auth')
      }
    } else {
      this.props.navigation.navigate('Auth')
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator size='large' animating={true} color="#ffffff"/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  }
})
