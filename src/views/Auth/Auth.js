import React, {Component} from 'react'
import {Text,
        Image,
        StyleSheet,
        View,
        TextInput,
        TouchableOpacity,
        Alert} from 'react-native'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

import logoImage from '../../../assets/imgs/logo.png'
import {oapiUrl, showError, showSucess} from '../../common'

export default class Auth extends Component {

  state = {
      name: '',
      email: '',
      password: '',
      showPasswaord: false
  }

  signinOrSignup = () => {
    this.signin()
  }

  signin = async () => {
    try {
      const res = await axios.post(`${oapiUrl}/login`,{
        email: this.state.email,
        password: this.state.password
      })
      AsyncStorage.setItem('userData',JSON.stringify(res.data))
      axios.defaults.headers.common['Authorization'] = `${res.data.email}|${res.data.token}`
      this.props.navigation.navigate('Home')
    } catch(e) {
      showError(e)
    }
  }

  onBlur = (e) => { 
    this.signin()
  }

  render() {  
    return (
      <View
        style={styles.background}>
        <Image
        source={logoImage}
        style={styles.logoImage} />
        <Text style={styles.title}>Entre</Text>
        <TextInput
          placeholder='E-mail'
          style={styles.input}
          onChangeText={email => this.setState({email})}
          value={this.state.email}
        />
        <TextInput
          placeholder='Senha'
          value={this.state.password}
          style={styles.input}
          secureTextEntry={!this.state.showPasswaord}
          onChangeText={password => this.setState({password})}
          onBlur={this.onBlur}
        />
        <TouchableOpacity
          onPress={() => this.setState({showPasswaord : !this.state.showPasswaord})}>
          <View style={styles.buttomSecure}>
            <Text style={styles.buttomSecureText}>Exibir Senha</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={this.signinOrSignup}>
          <View style={styles.buttom}>
            <Text style={styles.buttomText}>Entrar</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  background: {
    flex:1,
    marginTop: 30,
    marginLeft: 22,
    marginRight: 22
  },
  logoImage: {
    width: 180,
    height: 45,
  },
  title: {
    //fontFamily: commonStyles.fontFamily,
    color: 'black',
    fontSize: 30,
    marginTop: 40,
    marginBottom: 10
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    marginTop: 10,
    fontSize: 15,
    height: 40,
    padding: 5
  },
  buttom: {
    backgroundColor: '#31749b',
    marginTop: 20,
    padding: 10,
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  buttomSecure: {
    alignItems: 'flex-end',
    marginTop: 5,
    marginRight: 5
  },
  buttomSecureText: {
    fontSize: 12,
    color: '#31749b',
  },
  buttomText: {
    //fontFamily: commonStyles.fontFamily,
    color: '#FFF',
    fontSize: 20
  }
})
