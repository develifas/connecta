import React, {Component} from 'react'
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native'
import { ListItem, Button, Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

import {apiUrl, showError, showSucess} from '../../common'

const initialState = {
  qtdpedidos: 0,
  qtdruptura: 0,
  showFilterReposicao: false,
  enderecos: []
}

export default class EnderecoList extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    //recupera async para setar o filtro
    const stateString = await AsyncStorage.getItem('reposicaoState')
    const savedState = JSON.parse(stateString) || {showFilterReposicao: this.state.showFilterReposicao}
    //atualiza variavel em state
    this.setState({showFilterReposicao: savedState.showFilterReposicao})
    //carrrega os itens
    this.loadEnderecos()
    //mecanismo para atualizar no goBack()
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
      //recupera async para setar o filtro
      const stateString = await AsyncStorage.getItem('reposicaoState')
      const savedState = JSON.parse(stateString) || {showFilterReposicao: this.state.showFilterReposicao}
      //atualiza variavel em state
      this.setState({showFilterReposicao: savedState.showFilterReposicao})
      //carrega lista
      await this.loadEnderecos()
    })
  }

  //necessario para a atualização no goBack()
  componentWillUnmount = () => {
    // Remove the event listener
    if (this.focusListener != null && this.focusListener.remove) {
      this.focusListener.remove();
    }
  }

  loadEnderecos = async () => {
    try {
      //busca novos dados
      var url = `${apiUrl}/reposicao/endereco/?grupoeconomico=${this.props.route.params.grupoeconomico._id}`
      url += `&empresa=${this.props.route.params.empresa._id}`
      url += `&repositor=${this.props.route.params.repositor._id}`
      url += `&data=${this.props.route.params.data}`
      url += `&codigoErp=`
      //filtra conforme parametro
      if (this.state.showFilterReposicao) {
        url += `&status=sugestao`
      }
      const res = await axios.get(url)
      //monta variaveis de totalizadores
      var qtdpedidos = 0
      var qtdruptura = 0
      //monta variaveis de totalizadores
      for (let endereco of res.data) {
        qtdpedidos += endereco.qtdpedidos
        qtdruptura += endereco.qtdruptura
      }
      //atualiza valores
      this.setState({enderecos: res.data, qtdpedidos: qtdpedidos, qtdruptura: qtdruptura})
    } catch(e) {
      showError(e)
    }
  }

  onPressFilter = async () => {
    //atualiza varialva
    var showFilterReposicao = !this.state.showFilterReposicao
    //atualiza variavel state
    this.setState({showFilterReposicao: showFilterReposicao},this.loadEnderecos)
    //salva state no async para futuros acessos
    AsyncStorage.setItem('reposicaoState',JSON.stringify({showFilterReposicao: showFilterReposicao}))
  }

  createReposicao = async () => {
    this.props.navigation.push('ProdutoSearch',this.props.route.params)
  }

  getEnderecoItem = ({ item: endereco }) => {
    return (
      <ListItem
        bottomDivider
        onPress={() => this.props.navigation.push(this.props.proximaTela,endereco)}>
        <ListItem.Content>
          <ListItem.Title>Endereço {(endereco.produtoempresa.endereco||'Não Preenchido')}</ListItem.Title>
          <ListItem.Subtitle>Qtd.Produtos {endereco.qtdpedidos} e em Ruptura {endereco.qtdruptura}</ListItem.Subtitle>
        </ListItem.Content>
        <Button
          onPress={() => this.props.navigation.push(this.props.proximaTela,endereco)}
          type="clear"
          icon={<Icon name="edit" size={40} color="orange"/>}
        />
      </ListItem>
    )
  }

  render(){
    return (
      <View style={styles.container}>
        <View style={styles.containerDetail}>
          <Text style={styles.textDetail}>Qtd.Produtos {this.state.qtdpedidos} e em Ruptura {this.state.qtdruptura}</Text>
          <TouchableOpacity onPress={this.onPressFilter}>
            <Icon name={this.state.showFilterReposicao ? 'eye-slash' : 'eye'} size={30} style={styles.icon}/>
          </TouchableOpacity>
        </View>
        <FlatList
          keyExtractor={endereco => (endereco._id.endereco||'')}
          data={this.state.enderecos}
          renderItem={this.getEnderecoItem}
        />
        <TouchableOpacity
          style={styles.addButton}
          activeOpacity={0.5}
          onPress={() => this.createReposicao()}>
          <Icon name='plus' size={20} color='white'></Icon>
        </TouchableOpacity>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerDetail: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icon: {
    color: 'gray',
    marginRight: 25
  },
  textDetail: {
    fontSize: 15,
    margin: 15
  },
  addButton: {
    backgroundColor: 'green',
    position: 'absolute',
    right: 25,
    bottom: 25,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center'
  }
})
