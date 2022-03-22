import React, {Component} from 'react'
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import { ListItem, Button, Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'

import {apiUrl, showError, showSucess} from '../../common'
import ScanCodBar from '../../components/ScanCodBar'

const initialState = {
  filter: '',
  showScanCodBar: false,
  produtos: []
}

export default class ProdutoList extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    this.setState({showScanCodBar: false})
    this.loadProdutos()
    //mecanismo para atualizar no goBack()
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
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
      const res = await axios.get(`${apiUrl}/produto?limit=25&filter=${this.state.filter}`)
      this.setState({produtos: res.data})
    } catch(e) {
      showError(e)
    }
  }

  loadProdutosBarCode = async (codigoBarras) => {
    try {
      const res = await axios.get(`${apiUrl}/produto?limit=25&filter=${this.state.filter}&codigoBarras=${codigoBarras}`)
      //verifica se retornou algum produto
      if (res.data.length == 0) {
        Alert.alert("Cadastro de Produtos",`Nenhum Produto encontrado para o Código de Barras ${codigoBarras}!`,[{text: "Voltar"}])
      } else {
        this.setState({produtos: res.data})
      }
    } catch(e) {
      showError(e)
    }
  }

  onBlur = (e) => {
    this.loadProdutos()
  }

  onPressBarcode = (e) => {
    this.setState({showScanCodBar: true})
  }

  getProdutoBarCode = (e) => {
    this.setState({showScanCodBar: false})
    this.loadProdutosBarCode(e.data)
  }

  onPressItem = (produto) => {
    this.props.navigation.push('ProdutoEmpresa',produto)
  }

  getProdutoItem = ({ item: produto }) => {
    return (
      <ListItem
        bottomDivider
        onPress={() => this.onPressItem(produto)}>
        <ListItem.Content>
          <ListItem.Title>{produto.nome}</ListItem.Title>
          <ListItem.Subtitle>Código {produto.codigo}</ListItem.Subtitle>
        </ListItem.Content>
        <Button
          onPress={() => this.onPressItem(produto)}
          type="clear"
          icon={<Icon name="edit" size={40} color="orange"/>}
        />
      </ListItem>
    )
  }

  render(){
    return (
      <View style={styles.container}>
        <ScanCodBar
          isVisible={this.state.showScanCodBar}
          onCancel={() => this.setState({showScanCodBar: false})}
          onBarcodeDetected={(e) => this.getProdutoBarCode(e)}
        />
        <View style={styles.containerFilter}>
          <TextInput style={styles.input}
            placeholder='Procure o Produto'
            onChangeText={filter => this.setState({filter})}
            value={this.state.filter}
            returnKeyType='search'
            onBlur={this.onBlur}>
          </TextInput>
          <TouchableOpacity onPress={this.onPressBarcode}>
            <Icon name='barcode' size={40} style={styles.icon}/>
          </TouchableOpacity>
        </View>
        <FlatList
          keyExtractor={produto => produto._id}
          data={this.state.produtos}
          renderItem={this.getProdutoItem}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  containerFilter: {
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  icon: {
    color: 'black',
    marginRight: 25,
    marginTop: 5,
  },
  input: {
    marginLeft: 15,
    width: '70%',
    fontSize: 15
  }
})
