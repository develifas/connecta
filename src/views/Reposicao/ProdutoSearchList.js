import React, {Component} from 'react'
import { View, FlatList, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import { ListItem, Button, Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'

import {apiUrl, showError, showSucess} from '../../common'
import ScanCodBar from '../../components/ScanCodBar'

const initialState = {
  filter: '',
  grupoeconomico: {},
  empresa: {},
  repositor: {},
  produto: {},
  showScanCodBar: false,
  produtos: []
}

export default class ProdutoList extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    //guarda informacoes para inclusão
    this.setState({ showScanCodBar: false,
                    grupoeconomico: this.props.route.params.grupoeconomico,
                    empresa: this.props.route.params.empresa,
                    repositor: this.props.route.params.repositor})
    //atualiza lista
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
      const res = await axios.get(`${apiUrl}/produto?codigoBarras=${codigoBarras}`)
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

  onPressItem = async (produto) => {
    try {
      //objeto de filtro
      const empresa = this.state.empresa._id || this.state.empresa
      const repositor = this.state.repositor._id || this.state.repositor
      const grupoeconomico = this.state.grupoeconomico._id || this.state.grupoeconomico
      //busca o cadastro do produtoempresa
      const urlProdEmpresa = `${apiUrl}/produtoempresa?grupoeconomico=${grupoeconomico}&empresa=${empresa}&produto=${produto._id}`
      const resProdEmpresa = await axios.get(urlProdEmpresa)
      const produtoempresa = resProdEmpresa.data[0]
      //busca o cadastro do produtorepositor
      const urlProdRepositor = `${apiUrl}/produtoempresa?grupoeconomico=${grupoeconomico}&empresa=${repositor}&produto=${produto._id}`
      const resProdRepositor = await axios.get(urlProdRepositor)
      const produtorepositor = resProdRepositor.data[0]
      //verifica se existe o cadastro para as duas empresas
      if (produtoempresa && produtorepositor) {
        //monta objeto para inclusão
        const newReposicao = {
          grupoeconomico: produto.grupoeconomico,
          empresa: produtoempresa.empresa,
          repositor: produtorepositor.empresa,
          status: 'confirmado',
          origem: 'manual',
          quantidade: 1,
          valor: produtoempresa.custo || 0,
          valorTotal: produtoempresa.custo || 0,
          total: produtoempresa.custo || 0,
          produtoempresa: { _id: produtoempresa._id,
                            estoqueAtual: produtoempresa.estoqueAtual,
                            estoqueMaximo: produtoempresa.estoqueMaximo,
                            endereco: produtoempresa.endereco},
          produtorepositor: { _id: produtorepositor._id,
                              estoqueAtual: produtorepositor.estoqueAtual},
          produto: {_id: produto._id,
                    codigo: produto.codigo,
                    nome: produto.nome}
        }
        //verifica se tem codigo repositor
        if (produto.codigorepositor) {
          newReposicao.codigorepositor = produto.codigorepositor
        }
        //chama proxima tela com parametros para inclusão
        this.props.navigation.push('Reposicao',newReposicao)
      } else {
        //chama alert
        Alert.alert("Cadastro de Produtos","O Cadastro deste Produto não existe na Empresa ou no Repositor!",[{text: "Voltar"}])
      }
    } catch(e) {
      showError(e)
    }
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
          icon={<Icon name="check" size={40} color="gray"/>}
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
    marginTop: 5,
    color: 'black',
    marginRight: 25
  },
  input: {
    marginLeft: 15,
    width: '70%',
    fontSize: 15
  }
})
