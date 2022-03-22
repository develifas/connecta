import React, { Component } from 'react'
import {StyleSheet, View, Text, TouchableOpacity, ScrollView} from 'react-native'
import { Gravatar } from 'react-native-gravatar'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Ionicons from 'react-native-vector-icons/Ionicons'
import NumberFormat from 'react-number-format'
import axios from 'axios'

import {apiUrl, showError, showSucess} from '../../common'

const initialState = {
  countProdutos: 0,
  countEmpresas: 0,
  compraSugestao: {total: 0, itens: 0,ruptura: 0},
  reposicaoSugestao: {total: 0, itens: 0,ruptura: 0}
}

export default class Dashboard extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    //carrega lista
    this.loadDashboard()
    //mecanismo para atualizar no goBack()
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
      //carrega lista
      await this.loadDashboard()
    })
  }

  //necessario para a atualização no goBack()
  componentWillUnmount = () => {
    // Remove the event listener
    if (this.focusListener != null && this.focusListener.remove) {
      this.focusListener.remove();
    }
  }

  loadDashboard = async () => {
    try {
      //informações do cadastro de produtos
      const resEmpresa = await axios.get(`${apiUrl}/empresa/count`)
      this.setState({countEmpresas: resEmpresa.data.value})
      //informações do cadastro de produtos
      const resProduto = await axios.get(`${apiUrl}/produto/count`)
      this.setState({countProdutos: resProduto.data.value})
      //informações de compras em aberto
      const resCompra = await axios.get(`${apiUrl}/compra/totalsugestao`)
      this.setState({compraSugestao: resCompra.data})
      //informações de reposicao em aberto
      const resReposicao = await axios.get(`${apiUrl}/reposicao/totalsugestao`)
      this.setState({reposicaoSugestao: resReposicao.data})
    } catch(e) {
      showError(e)
    }
  }

  render() {
    return (
      <View>
        <ScrollView>
          <View style={styles.kpis}>
            <View>
              <Text style={styles.numberkpi}>{this.state.countEmpresas}</Text>
              <Text style={styles.textkpi}>Empresas</Text>
            </View>
            <View>
              <Ionicons style={styles.iconkpi} name='business' size={50} color='gray'/>
            </View>
          </View>
          <View style={styles.kpis}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Produto')}>
              <Text style={styles.numberkpi}>{this.state.countProdutos}</Text>
              <Text style={styles.textkpi}>Produtos</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Produto')}>
              <Ionicons style={styles.iconkpi} name='cube-outline' size={50} color='gray'/>
            </TouchableOpacity>
          </View>
          <View style={styles.kpis}>
            <View>
              <Text style={styles.numberPkpiMov}>R$ {this.state.compraSugestao.total.toFixed(2)}</Text>
              <Text style={styles.numberSkpiMov}>{this.state.compraSugestao.itens} itens e {this.state.compraSugestao.ruptura} em ruptura</Text>
              <Text style={styles.textkpi}>Sugestão de Compra</Text>
            </View>
            <View>
              <Ionicons style={styles.iconkpi} name='cart-outline' size={50} color='gray'/>
            </View>
          </View>
          <View style={styles.kpis}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Reposicao')}>
              <Text style={styles.numberPkpiMov}>R$ {this.state.reposicaoSugestao.total.toFixed(2)}</Text>
              <Text style={styles.numberSkpiMov}>{this.state.reposicaoSugestao.itens} itens e {this.state.reposicaoSugestao.ruptura} em ruptura</Text>
              <Text style={styles.textkpi}>Sugestão de Reposição</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Reposicao')}>
              <Ionicons style={styles.iconkpi} name='swap-horizontal-outline' size={50} color='gray'/>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  kpis: {
    margin: 15,
    flexDirection: 'row',
    borderColor: '#AAA',
    borderBottomWidth: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFF',
    justifyContent: 'space-between',
    marginBottom: 0
  },
  numberkpi: {
    color: '#999999',
    marginLeft: 10,
    fontSize: 35,
  },
  textkpi: {
    color: '#404040',
    marginLeft: 10,
    fontSize: 15,
    marginBottom: 10
  },
  numberPkpiMov: {
    color: '#6699cc',
    marginLeft: 10,
    fontSize: 35
  },
  numberSkpiMov: {
    color: '#b3b3b3',
    marginLeft: 10,
    fontSize: 20
  },
  iconkpi: {
    marginRight: 10,
  }
})
