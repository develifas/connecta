import React, {Component} from 'react'
import { ScrollView, View,FlatList, StyleSheet, TouchableOpacity, Text, TextInput, Platform } from 'react-native'
import { ListItem, Button, Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import ModalSelector from 'react-native-modal-selector'
import DateTimePicker from '@react-native-community/datetimepicker'
import axios from 'axios'
import moment from 'moment'

import {apiUrl, showError, showSucess} from '../../common'
import commonStyles from '../../commonStyles'

const initialState = {
  showDataMinSeguranca: false,
  showDataMaxSeguranca: false,
  produtoempresa: {}
}

export default class ProdutoEmpresaForm extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    await this.loadProdutoEmpresa()
  }

  loadProdutoEmpresa = async () => {
    try {
      const url = `${apiUrl}/produtoempresa/id/${this.props.route.params._id}`
      const res = await axios.get(url)
      this.setState({produtoempresa: res.data})
    } catch(e) {
      showError(e)
    }
  }

  updateProdutoEmpresa = async () => {
    try {
      //chama endpoint
      await axios.put(`${apiUrl}/produtoempresa/${this.state.produtoempresa._id}`,this.state.produtoempresa)
      //retorna para a pagina anterior
      this.props.navigation.goBack()
    } catch(e) {
      showError(e)
    }
  }

  getDataMinSeguranca = () => {

    let dataMinSeguranca = this.state.produtoempresa.dataMinSeguranca ? new Date(this.state.produtoempresa.dataMinSeguranca) : new Date()
    let dateString = moment(dataMinSeguranca).locale('pt-br').format('DD/MM/YYYY')
    let datePicker =  <DateTimePicker
                        value={dataMinSeguranca}
                        onChange={(_,date) => this.setState({produtoempresa: {...this.state.produtoempresa,dataMinSeguranca: date}, showDataMinSeguranca: false })}
                        mode='date' />

    if (Platform.OS === 'android') {
      datePicker = (
        <View>
          <TouchableOpacity onPress={() => this.setState({showDataMinSeguranca: true})}>
            <Text style={styles.data}>
              {dateString}
            </Text>
          </TouchableOpacity>
          {this.state.showDataMinSeguranca && datePicker}
        </View>
      )
    }
    return datePicker
  }

  getDataMaxSeguranca = () => {

    let dataMaxSeguranca = this.state.produtoempresa.dataMaxSeguranca ? new Date(this.state.produtoempresa.dataMaxSeguranca) : new Date()
    let dateString = moment(dataMaxSeguranca).locale('pt-br').format('DD/MM/YYYY')
    let datePicker =  <DateTimePicker
                        value={dataMaxSeguranca}
                        onChange={(_,date) => this.setState({produtoempresa: {...this.state.produtoempresa,dataMaxSeguranca: date}, showDataMaxSeguranca: false })}
                        mode='date' />

    if (Platform.OS === 'android') {
      datePicker = (
        <View>
          <TouchableOpacity onPress={() => this.setState({showDataMaxSeguranca: true})}>
            <Text style={styles.data}>
              {dateString}
            </Text>
          </TouchableOpacity>
          {this.state.showDataMaxSeguranca && datePicker}
        </View>
      )
    }
    return datePicker
  }

  render(){

    //opcoes para alteração do status
    const dataSimNao = [{ key: 'sim',label: 'Sim'},
                        { key: 'nao',label: 'Não'}]

    //opcoes para alteração do status
    const dataCurva = [ {key:'a',label:'Curva A'},
                        {key:'b',label:'Curva B'},
                        {key:'c',label:'Curva C'},
                        {key:'d',label:'Curva D'},
                        {key:'e',label:'Curva E'},
                        {key:'f',label:'Curva F'},
                        {key:'g',label:'Curva G'},
                        {key:'sc',label:'Sem Curva'}]

    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.label}>Grupo Econômico</Text>
          <TextInput
            style={styles.inputNotEdit}
            editable={false}
            value={this.state.produtoempresa.grupoeconomico ? this.state.produtoempresa.grupoeconomico.nome : ''}
          />
          <Text style={styles.label}>Empresa</Text>
          <TextInput
            style={styles.inputNotEdit}
            editable={false}
            value={this.state.produtoempresa.empresa ? this.state.produtoempresa.empresa.fantasia : ''}
          />
          <Text style={styles.label}>Código</Text>
          <TextInput
            style={styles.inputNotEdit}
            editable={false}
            value={this.state.produtoempresa.produto ? this.state.produtoempresa.produto.codigo : ''}
          />
          <Text style={styles.label}>Nome</Text>
          <TextInput
            style={styles.inputNotEdit}
            editable={false}
            value={this.state.produtoempresa.produto ? this.state.produtoempresa.produto.nome : ''}
          />
          <Text style={styles.label}>Quantidade do Conjunto</Text>
          <TextInput
            style={styles.input}
            keyboardType='number-pad'
            onChangeText={quantidadeConjunto => this.setState({produtoempresa: {...this.state.produtoempresa,quantidadeConjunto: parseInt(quantidadeConjunto)}})}
            value={this.state.produtoempresa.quantidadeConjunto ? String(this.state.produtoempresa.quantidadeConjunto) : '0'}
          />
          <Text style={styles.label}>Multiplo de Compra</Text>
          <TextInput
            style={styles.input}
            keyboardType='number-pad'
            onChangeText={multiploCompra => this.setState({produtoempresa: {...this.state.produtoempresa,multiploCompra: parseInt(multiploCompra)}})}
            value={this.state.produtoempresa.multiploCompra ? String(this.state.produtoempresa.multiploCompra) : '0'}
          />
          <Text style={styles.label}>Multiplo de Reposição</Text>
          <TextInput
            style={styles.input}
            keyboardType='number-pad'
            onChangeText={multiploReposicao => this.setState({produtoempresa: {...this.state.produtoempresa,multiploReposicao: parseInt(multiploReposicao)}})}
            value={this.state.produtoempresa.multiploReposicao ? String(this.state.produtoempresa.multiploReposicao) : '0'}
          />
          <Text style={styles.label}>Estoque Mínimo</Text>
          <TextInput
            style={styles.inputNotEdit}
            editable={false}
            value={this.state.produtoempresa.estoqueMinimo ? String(this.state.produtoempresa.estoqueMinimo): '0'}
          />
          <Text style={styles.label}>Estoque Máximo</Text>
          <TextInput
            style={styles.input}
            keyboardType='number-pad'
            onChangeText={estoqueMaximo => this.setState({produtoempresa: {...this.state.produtoempresa,estoqueMaximo: parseInt(estoqueMaximo)}})}
            value={this.state.produtoempresa.estoqueMaximo ? String(this.state.produtoempresa.estoqueMaximo) : '0'}
          />
          <Text style={styles.label}>Estoque Ideal</Text>
          <TextInput
            style={styles.inputNotEdit}
            editable={false}
            value={this.state.produtoempresa.estoqueIdeal ? String(this.state.produtoempresa.estoqueIdeal): '0'}
          />
          <Text style={styles.label}>Estoque Atual</Text>
          <TextInput
            style={styles.inputNotEdit}
            editable={false}
            value={this.state.produtoempresa.estoqueAtual ? String(this.state.produtoempresa.estoqueAtual): '0'}
          />
          <Text style={styles.label}>Estoque Segurança</Text>
          <TextInput
            style={styles.input}
            keyboardType='number-pad'
            onChangeText={estoqueSeguranca => this.setState({produtoempresa: {...this.state.produtoempresa,estoqueSeguranca: parseInt(estoqueSeguranca)}})}
            value={this.state.produtoempresa.estoqueSeguranca ? String(this.state.produtoempresa.estoqueSeguranca): '0'}
          />
          <Text style={styles.label}>Data Min.Segurança</Text>
          {this.getDataMinSeguranca()}
          <Text style={styles.label}>Data Max.Segurança</Text>
          {this.getDataMaxSeguranca()}
          <Text style={styles.label}>Prioridade</Text>
          <TextInput
            style={styles.input}
            keyboardType='number-pad'
            onChangeText={prioridade => this.setState({produtoempresa: {...this.state.produtoempresa,prioridade: parseInt(prioridade)}})}
            value={this.state.produtoempresa.prioridade ? String(this.state.produtoempresa.prioridade) : '0'}
          />
          <Text style={styles.label}>Endereço</Text>
          <TextInput
            style={styles.input}
            onChangeText={endereco => this.setState({produtoempresa: {...this.state.produtoempresa,endereco: endereco}})}
            value={this.state.produtoempresa.endereco ? this.state.produtoempresa.endereco : ''}
          />
          <Text style={styles.labelModal}>Curva</Text>
          <ModalSelector
            style={styles.inputModal}
            data={dataCurva}
            disabled={true}
            selectedKey={this.state.produtoempresa.curva}
          />
          <Text style={styles.labelModal}>Comprar</Text>
          <ModalSelector
            style={styles.inputModal}
            data={dataSimNao}
            selectedKey={this.state.produtoempresa.comprar}
            cancelText='Voltar'
            onChange={option => this.setState({produtoempresa: {...this.state.produtoempresa,comprar: option.key}})}
          />
          <Text style={styles.labelModal}>Cotação</Text>
          <ModalSelector
            style={styles.inputModal}
            data={dataSimNao}
            selectedKey={this.state.produtoempresa.cotacao}
            cancelText='Voltar'
            onChange={option => this.setState({produtoempresa: {...this.state.produtoempresa,cotacao: option.key}})}
          />
          <Text style={styles.labelModal}>Repor</Text>
          <ModalSelector
            style={styles.inputModal}
            data={dataSimNao}
            selectedKey={this.state.produtoempresa.repor}
            cancelText='Voltar'
            onChange={option => this.setState({produtoempresa: {...this.state.produtoempresa,repor: option.key}})}
          />
          <Text style={styles.labelModal}>Aglutina Demanda</Text>
          <ModalSelector
            style={styles.inputModal}
            data={dataSimNao}
            selectedKey={this.state.produtoempresa.aglutinaDemanda}
            cancelText='Voltar'
            onChange={option => this.setState({produtoempresa: {...this.state.produtoempresa,aglutinaDemanda: option.key}})}
          />
          {/*
          <View style={styles.buttons}>
            <Button
              onPress={() => this.props.navigation.goBack()}
              type="clear"
              icon={<Icon name="arrow-left" size={40} color="gray"/>}
            />
            <Button
              onPress={() => this.updateProdutoEmpresa()}
              type="clear"
              icon={<Icon name="edit" size={40} color="orange"/>}
            />
          </View>
          */}
        </ScrollView>
        <TouchableOpacity
          style={styles.editButton}
          activeOpacity={0.5}
          onPress={() => this.updateProdutoEmpresa()}>
          <Icon name='edit' size={20} color='white'></Icon>
        </TouchableOpacity>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20
  },
  button: {
    marginRight: 30,
    marginLeft: 30
  },
  label: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 15
  },
  labelModal: {
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 10,
    marginRight: 10,
    fontWeight: 'bold',
    fontSize: 15
  },
  input: {
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15,
    borderColor: 'gray',
    borderBottomWidth: 1,
    fontSize: 15,
    color: 'black'
  },
  data: {
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15,
    borderColor: 'gray',
    borderBottomWidth: 1,
    fontSize: 15,
    color: 'black',
    textAlignVertical: 'center'
  },
  inputModal: {
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15,
    fontSize: 15,
    color: 'black'
  },
  inputNotEdit: {
    height: 40,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15,
    borderColor: 'gray',
    borderBottomWidth: 1,
    fontSize: 15,
    color: '#595959'
  },
  editButton: {
    backgroundColor: 'orange',
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
