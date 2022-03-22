import React, {Component} from 'react'
import { View,FlatList } from 'react-native'
import { ListItem, Button, Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import axios from 'axios'

import {apiUrl, showError, showSucess} from '../../common'

const initialState = {
  repositores: []
}

export default class RepositorList extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    //carrega lista
    await this.loadRepositores()
    //mecanismo para atualizar no goBack()
    const { navigation } = this.props;
    this.focusListener = navigation.addListener('focus', async () => {
      //carrega lista
      await this.loadRepositores()
    })
  }

  //necessario para a atualização no goBack()
  componentWillUnmount = () => {
    // Remove the event listener
    if (this.focusListener != null && this.focusListener.remove) {
      this.focusListener.remove();
    }
  }

  loadRepositores = async () => {
    try {
      const res = await axios.get(`${apiUrl}/parametro/repositor?grupoeconomico=${this.props.route.params.grupoeconomico._id}&empresa=${this.props.route.params._id}`)
      this.setState({repositores: res.data})
    } catch(e) {
      showError(e)
    }
  }

  getRepositorItem = ({ item: repositor }) => {
    return (
      <ListItem
        bottomDivider
        onPress={() => this.props.navigation.push(this.props.proximaTela,repositor)}>
        <ListItem.Content>
          <ListItem.Title>{repositor.fantasia}</ListItem.Title>
          <ListItem.Subtitle>{repositor.grupoeconomico.nome}</ListItem.Subtitle>
        </ListItem.Content>
        <Button
          onPress={() => this.props.navigation.push(this.props.proximaTela,repositor)}
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
          keyExtractor={repositor => repositor._id}
          data={this.state.repositores}
          renderItem={this.getRepositorItem}
        />
      </View>
    )
  }

}
