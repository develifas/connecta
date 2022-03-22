import React, {Component} from 'react'
import { View,FlatList } from 'react-native'
import { ListItem, Button, Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'

import {apiUrl, showError, showSucess} from '../../common'

const initialState = {
  empresas: []
}

export default class EmpresaList extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    //carrega lista
    await this.loadEmpresas()
    //mecanismo para atualizar no goBack()
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
      //carrega lista
      await this.loadEmpresas()
    })
  }

  //necessario para a atualização no goBack()
  componentWillUnmount = () => {
    // Remove the event listener
    if (this.focusListener != null && this.focusListener.remove) {
      this.focusListener.remove();
    }
  }

  loadEmpresas = async () => {
    try {
      const res = await axios.get(`${apiUrl}/empresa`)
      this.setState({empresas: res.data})
    } catch(e) {
      showError(e)
    }
  }

  getEmpresaItem = ({ item: empresa }) => {
    return (
      <ListItem
        bottomDivider
        onPress={() => this.props.navigation.push(this.props.proximaTela,empresa)}>
        <ListItem.Content>
          <ListItem.Title>{empresa.fantasia}</ListItem.Title>
          <ListItem.Subtitle>{empresa.grupoeconomico.nome}</ListItem.Subtitle>
        </ListItem.Content>
        <Button
          onPress={() => this.props.navigation.push(this.props.proximaTela,empresa)}
          type="clear"
          icon={<Icon name="edit" size={40} color="orange"/>}
        />
      </ListItem>
    )
  }

  render(){
    return (
      <View>
        <FlatList
          keyExtractor={empresa => empresa._id}
          data={this.state.empresas}
          renderItem={this.getEmpresaItem}
        />
      </View>
    )
  }

}
