import React, {Component} from 'react'
import { View, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { ListItem, Button, Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'
import moment from 'moment'
import 'moment/locale/pt-br'

import {apiUrl, showError, showSucess} from '../../common'

const initialState = {
  pedidos: []
}

export default class PedidoList extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    //carrega lista
    this.loadPedidos()
    //mecanismo para atualizar no goBack()
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
      //carrega lista
      await this.loadPedidos()
    })
  }

  //necessario para a atualização no goBack()
  componentWillUnmount = () => {
    // Remove the event listener
    if (this.focusListener != null && this.focusListener.remove) {
      this.focusListener.remove();
    }
  }

  loadPedidos = async () => {
    try {
      //busca novos dados
      const res = await axios.get(`${apiUrl}/reposicao/pedido?grupoeconomico=${this.props.route.params.grupoeconomico._id}&empresa=${this.props.route.params.empresa._id}&repositor=${this.props.route.params.repositor._id}&codigoErp=`)
      this.setState({pedidos: res.data})
    } catch(e) {
      showError(e)
    }
  }

  createReposicao = async () => {
    this.props.navigation.push('ProdutoSearch',this.props.route.params)
  }

  getPedidoItem = ({ item: pedido }) => {

    const formattedDate = moment(pedido.data).locale('pt-br').format('DD/MM/YYYY')

    return (
      <ListItem
        bottomDivider
        onPress={() => this.props.navigation.push(this.props.proximaTela,pedido)}>
        <ListItem.Content>
          <ListItem.Title>{formattedDate}</ListItem.Title>
          <ListItem.Subtitle>Qtd.Produtos {pedido.qtdpedidos} e em Ruptura {pedido.qtdruptura}</ListItem.Subtitle>
        </ListItem.Content>
        <Button
          onPress={() => this.props.navigation.push(this.props.proximaTela,pedido)}
          type="clear"
          icon={<Icon name="edit" size={40} color="orange"/>}
        />
      </ListItem>
    )
  }

  render(){
    return (
      <View style={styles.container}>
        <FlatList
          keyExtractor={pedido => pedido._id}
          data={this.state.pedidos}
          renderItem={this.getPedidoItem}
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
