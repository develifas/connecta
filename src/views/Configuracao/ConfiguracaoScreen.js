import React, { Component } from 'react'
import {StyleSheet, View, Text, TouchableOpacity} from 'react-native'
import { Gravatar } from 'react-native-gravatar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'

import commonStyles from '../../commonStyles'
import {version} from '../../common'

const initialState = {
  nome: '',
  email: ''
}

export default class Configuracao extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    const userDataJson = await AsyncStorage.getItem('userData')
    const userData = JSON.parse(userDataJson)
    //seta no state
    this.setState({nome: userData.nome, email: userData.email})
  }

  logout = () => {
    delete axios.defaults.headers.common['Authorization']
    AsyncStorage.removeItem('userData')
    this.props.navigation.navigate('AuthOrApp')
  }

  render() {
    return (
      <View style={styles.header}>
        <Gravatar
          style={styles.avatar}
          options={{
            email: this.state.email,
            secure: true
          }}/>
        <View style={styles.userInfo}>
          <Text style={styles.name}>{this.state.nome}</Text>
          <Text style={styles.email}>{this.state.email}</Text>
          <Text style={styles.email}>Versão {version}</Text>
        </View>
        <TouchableOpacity
          onPress={this.logout}>
          <View style={styles.logoutIcon}>
            <Icon name='sign-out' size={30} color= '#800' />
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  userInfo: {
    marginLeft: 10
  },
  name: {
    fontSize: 20,
    marginBottom: 5,
    color: commonStyles.colors.mainText
  },
  email: {
    fontSize: 15,
    marginBottom: 10,
    color: commonStyles.colors.subText
  },
  avatar: {
    width: 60,
    height: 60,
    borderWidth: 3,
    borderRadius: 30,
    margin: 10
  },
  logoutIcon: {
    marginLeft: 10,
    marginBottom: 10
  }
})
