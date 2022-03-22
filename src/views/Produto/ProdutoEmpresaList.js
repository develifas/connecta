import React, {Component} from 'react'
import { View,FlatList, StyleSheet } from 'react-native'
import { ListItem, Button, Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'

import {apiUrl, showError, showSucess} from '../../common'

const initialState = {
  produtoempresas: []
}

export default class ProdutoEmpresaList extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    //carrega lista
    await this.loadProdutoEmpresas()
    //mecanismo para atualizar no goBack()
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
      //carrega lista
      await this.loadProdutoEmpresas()
    })
  }

  //necessario para a atualização no goBack()
  componentWillUnmount = () => {
    // Remove the event listener
    if (this.focusListener != null && this.focusListener.remove) {
      this.focusListener.remove();
    }
  }

  loadProdutoEmpresas = async () => {
    try {
      const url = `${apiUrl}/produtoempresa?limit=25&grupoeconomico=${this.props.route.params.grupoeconomico._id}&produto=${this.props.route.params._id}`
      const res = await axios.get(url)
      this.setState({produtoempresas: res.data})
    } catch(e) {
      showError(e)
    }
  }

  onPressItem = (produtoempresa) => {
    this.props.navigation.push('ProdutoEmpresaForm',produtoempresa)
  }

  getProdutoEmpresaItem = ({ item: produtoempresa }) => {
    return (
      <ListItem
        bottomDivider
        onPress={() => this.onPressItem(produtoempresa)}>
        <ListItem.Content>
          <ListItem.Title>{produtoempresa.empresa.fantasia}</ListItem.Title>
          <ListItem.Subtitle>{produtoempresa.grupoeconomico.nome}</ListItem.Subtitle>
        </ListItem.Content>
        <Button
          onPress={() => this.onPressItem(produtoempresa)}
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
          keyExtractor={produtoempresas => produtoempresas._id}
          data={this.state.produtoempresas}
          renderItem={this.getProdutoEmpresaItem}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
})
