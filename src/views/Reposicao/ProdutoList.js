import React, {Component} from 'react'
import { View, FlatList, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native'
import { ListItem, Button, Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import Swipeable from 'react-native-gesture-handler/Swipeable'
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from 'axios'

import {apiUrl, showError, showSucess} from '../../common'

const initialState = {
  qtdpedidos: 0,
  qtdruptura: 0,
  showFilterReposicao: false,
  produtos: []
}

export default class ProdutoList extends Component {

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
    this.loadProdutos()
    //mecanismo para atualizar no goBack()
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
      //recupera async para setar o filtro
      const stateString = await AsyncStorage.getItem('reposicaoState')
      const savedState = JSON.parse(stateString) || {showFilterReposicao: this.state.showFilterReposicao}
      //atualiza variavel em state
      this.setState({showFilterReposicao: savedState.showFilterReposicao})
      //carrega lista
      await this.loadProdutos()
    })
  }

  //necessario para a atualização no goBack()
  componentWillUnmount = () => {
    // Remove the event listener
    if (this.focusListener != null && this.focusListener.remove) {
      this.focusListener.remove();
    }
  }

  loadProdutos = async () => {
    try {
      var url = `${apiUrl}/reposicao/?grupoeconomico=${this.props.route.params.grupoeconomico._id}`
      url += `&empresa=${this.props.route.params.empresa._id}`
      url += `&repositor=${this.props.route.params.repositor._id}`
      url += `&endereco=${(this.props.route.params.produtoempresa.endereco||'')}`
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
      for (let produto of res.data) {
        qtdpedidos += 1
        qtdruptura += produto.ruptura == 'sim' ? 1 : 0
      }
      //atualiza valores
      this.setState({produtos: res.data, qtdpedidos: qtdpedidos, qtdruptura: qtdruptura})
    } catch(e) {
      showError(e)
    }
  }

  setStatus = async (item,status) => {
    //verifica se é possivel alterar o status
    if (item.status == status) {
      //chama alert
      Alert.alert("Status "+this.getStatus(item.status).nome,"Está Reposição já encontra-se neste Status!",[{text: "Voltar"}])
    } else {
      //altera status do objeto
      item.status = status
      //chama endpoint
      await axios.put(`${apiUrl}/reposicao/${item._id}`,item)
      //chama atualização da lista
      this.loadProdutos()
    }
  }

  getStatus = (statusItem) => {
    //objeto status
    let status = {}
    //tratamento status
    switch (statusItem) {
      case 'sugestao':
        status = {nome:'Sugestão',cor: 'green'}
        break
      case 'confirmado':
        status = {nome:'Confirmado',cor: 'purple'}
        break
      case 'baixado':
        status = {nome:'Baixado',cor: 'red'}
        break
    }
    return status
  }

  getColorItem = (produto) => {
    //color default
    let color
    //caso produto for ruptura, pinta de vermelho
    if (produto.ruptura  == 'sim') {
      color = 'red'
    } else if (produto.produtoempresa && (produto.produtoempresa.estoqueMaximo||0) == 0) {
      color = 'blue'
    } else {
      color = 'black'
    }
    //retorno da cor
    return color
  }

  onPressFilter = async () => {
    //atualiza varialva
    var showFilterReposicao = !this.state.showFilterReposicao
    //atualiza variavel state
    this.setState({showFilterReposicao: showFilterReposicao},this.loadProdutos)
    //salva state no async para futuros acessos
    AsyncStorage.setItem('reposicaoState',JSON.stringify({showFilterReposicao: showFilterReposicao}))
  }

  createReposicao = async () => {
    this.props.navigation.push('ProdutoSearch',this.props.route.params)
  }

  getProdutoItem = ({ item: produto }) => {

    const getLeftContent = () => {
      return (
        <TouchableOpacity style={styles.left}
          onPress={() => this.setStatus(produto,'baixado')}>
          <Text style={styles.textswipeable}>Baixar</Text>
        </TouchableOpacity>
      )
    }

    const getRightContent = () => {
      return (
        <TouchableOpacity style={styles.right}
          onPress={() => this.setStatus(produto,'confirmado')}>
          <Text style={styles.textswipeable}>Confirmar</Text>
        </TouchableOpacity>
      )
    }

    const onPressNavigation = () => {
      this.props.navigation.push(this.props.proximaTela,produto)
    }

    return (
      <Swipeable
        renderRightActions={getRightContent}
        renderLeftActions={getLeftContent}
        key={produto._id}>
        <ListItem
          bottomDivider
          onPress={() => this.props.navigation.push(this.props.proximaTela,produto)}>
          <TouchableOpacity
            style={[styles.avatar,{backgroundColor: this.getStatus(produto.status).cor}]}
            onPress={() => this.props.navigation.push(this.props.proximaTela,produto)}>
            <Text style={styles.textavatar}>{this.getStatus(produto.status).nome.substring(0,1)}</Text>
          </TouchableOpacity>
          <ListItem.Content>
            <ListItem.Title style={{ color: this.getColorItem(produto)}}>{produto.produto.nome}</ListItem.Title>
            <ListItem.Subtitle>Código {produto.produto.codigo} / {produto.produto.codigoBarras}</ListItem.Subtitle>
            <ListItem.Subtitle>Quantidade {produto.quantidade}</ListItem.Subtitle>
          </ListItem.Content>
          <Button
            onPress={onPressNavigation}
            type="clear"
            icon={<Icon name="edit" size={40} color="orange"/>}
          />
        </ListItem>
      </Swipeable>
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
          keyExtractor={produto => produto._id}
          data={this.state.produtos}
          renderItem={this.getProdutoItem}
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
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  textavatar: {
    fontSize: 25,
    color: 'white'
  },
  right: {
    backgroundColor: 'purple',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  left: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20
  },
  textswipeable: {
    fontSize: 20,
    color: 'white'
  },
})
