import React, { Component } from 'react'
import { ScrollView, View, FlatList, Alert, StyleSheet, TouchableOpacity, Text, TextInput, Platform, VirtualizedList } from 'react-native'
import { ListItem, Button, Avatar } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome'
import ModalSelector from 'react-native-modal-selector'
import axios from 'axios'

import { apiUrl, showError, showSucess } from '../../common'
import commonStyles from '../../commonStyles'
import ScrollableTabView, { DefaultTabBar, ScrollableTabBar } from 'react-native-scrollable-tab-view-forked'

import SegmentedControlTab from 'react-native-segmented-control-tab'
import { SafeAreaView } from 'react-native-safe-area-context'
import { red100 } from 'react-native-paper/lib/typescript/styles/colors'

const initialState = {
  create: false,
  reposicao: {},
  selectedIndex: 0,
  demandaIndex: 0,
  demanda: {},
  hideEditButton:true
}

export default class ReposicaoForm extends Component {

  state = {
    ...initialState
  }

  componentDidMount = async () => {
    await this.loadReposicao()


  }

  loadReposicao = async () => {
    //verifica se é inclusão ou alteração
    if (this.props.route.params._id) {
      try {
        const url = `${apiUrl}/reposicao/id/${this.props.route.params._id}`
        const res = await axios.get(url)
        //verifica se já foi integrado
        if (res.data.codigoErp) {
          //chama alert
          Alert.alert("Status da Reposição", "Esta Reposição não pode ser alterada pois já encontra-se integrada ao ERP!", [
            {
              text: "Voltar",
              onPress: () => {
                //retorna para a pagina anterior
                this.props.navigation.goBack()
              }
            }
          ])
        } else {

          this.setState({ reposicao: res.data })

          this.loadDemanda(this.props.route.params._id);
        }
      } catch (e) {
        showError(e)
      }
    } else {
      this.setState({ reposicao: this.props.route.params, create: true })
    }

  }



  loadDemanda = async () => {
    //verifica se é inclusão ou alteração
    if (this.props.route.params._id) {
      try {
        const url = `${apiUrl}/demanda/detail?grupoeconomico=${this.props.route.params.grupoeconomico._id}&empresa=${this.props.route.params.empresa._id}&produto=${this.props.route.params.produto._id}&produtoempresa=${this.props.route.params.produtoempresa._id}`
        const res = await axios.get(url)
        //verifica se já foi integrado
        this.setState({ demanda: res.data })


      } catch (e) {
        showError(e)
      }
    } else {
      this.setState({ reposicao: this.props.route.params, create: true })
    }

  }

  setEstoqueMaximo = (estoqueMaximo) => {
    //recupera valor
    const newReposicao = this.state.reposicao
    //altera para novo valor
    newReposicao.produtoempresa.estoqueMaximo = parseInt(estoqueMaximo)
    //atualiza state
    this.setState({ reposicao: newReposicao })
  }

  setEndereco = (endereco) => {
    //recupera valor
    const newReposicao = this.state.reposicao
    //altera para novo valor
    newReposicao.produtoempresa.endereco = endereco
    //atualiza state
    this.setState({ reposicao: newReposicao })
  }

  onBlurEstoqueMaximo = () => {
    //verifica se estoque maximo é maior que zero e menor que quantidade solicitada
    if (this.state.reposicao.produtoempresa.estoqueMaximo && this.state.reposicao.produtoempresa.estoqueMaximo < this.state.reposicao.quantidade) {
      //chama alert
      Alert.alert("Estoque Máximo", "Deseja alterar a Quantidade da Reposição com o valor do Estoque Máximo?", [
        {
          text: "Sim",
          onPress: () => { this.setState({ reposicao: { ...this.state.reposicao, quantidade: this.state.reposicao.produtoempresa.estoqueMaximo } }) }
        },
        {
          text: "Não"
        }
      ])
    }
  }


  verificaStatus = async () => {
    //verifica se mesmo apos alteração, continua como sugestão
    if (this.state.reposicao.status == 'sugestao') {
      //chama alert
      Alert.alert("Confirmar Reposição", "Deseja alterar o Status da Reposição para Confirmado?", [
        {
          text: "Sim",
          onPress: () => {
            this.setState({ reposicao: { ...this.state.reposicao, status: 'confirmado' } })
            this.updateReposicao()
          }
        },
        {
          text: "Não",
          onPress: () => {
            this.updateReposicao()
          }
        }
      ])
    } else {
      this.updateReposicao()
    }
  }

  updateReposicao = async () => {
    try {
      //atualiza valor total
      var valorTotal = 0
      //valores por produto
      valorTotal = (this.state.reposicao.valor || 0) * (this.state.reposicao.quantidade || 0)
      //arredonda 4 casas
      valorTotal = Math.round(valorTotal * 100, 2) / 100
      //total do item
      this.setState({ reposicao: { ...this.state.reposicao, valorTotal: valorTotal, total: valorTotal } })
      //chama endpoint
      await axios.put(`${apiUrl}/reposicao/${this.state.reposicao._id}`, this.state.reposicao)
      //retorna para a pagina anterior
      this.props.navigation.goBack()
    } catch (e) {
      showError(e)
    }
  }

  createReposicao = async () => {
    try {
      //atualiza valor total
      var valorTotal = 0
      //valores por produto
      valorTotal = (this.state.reposicao.valor || 0) * (this.state.reposicao.quantidade || 0)
      //arredonda 4 casas
      valorTotal = Math.round(valorTotal * 100, 2) / 100
      //total do item
      this.setState({ reposicao: { ...this.state.reposicao, valorTotal: valorTotal, total: valorTotal } })
      //chama endpoint
      await axios.post(`${apiUrl}/reposicao/`, this.state.reposicao)
      //retorna para a pagina anterior
      this.props.navigation.goBack()
    } catch (e) {
      showError(e)
    }
  }

  handleIndexChange = (index) => {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
  }

  handleIndexChangeDemanda = (index) => {
    this.setState({
      ...this.state,
      demandaIndex: index,
    });
  }

  render() {


if(this.state.selectedIndex == 0){
  this.state.hideEditButton = true;
}else{
  this.state.hideEditButton = false;
}

    //opcoes para alteração do status
    const dataStatus = [{ key: 'sugestao', label: 'Sugestão' },
    { key: 'confirmado', label: 'Confirmado' },
    { key: 'baixado', label: 'Baixado' }]
    //
    return (
      <View style={styles.container}>
        <SegmentedControlTab
          borderRadius={0}
          tabStyle={{padding:10,marginBottom:5}}
          values={['Produto', 'Saidas']}
          selectedIndex={this.state.selectedIndex}
          onTabPress={this.handleIndexChange}
        />


        {this.state.selectedIndex == 0 &&
      

          <ScrollView>
            <Text style={styles.label}>Grupo Econômico</Text><TextInput
              style={styles.inputNotEdit}
              editable={false}
              value={this.state.reposicao.grupoeconomico ? this.state.reposicao.grupoeconomico.nome : ''} /><Text style={styles.label}>Empresa</Text><TextInput
              style={styles.inputNotEdit}
              editable={false}
              value={this.state.reposicao.empresa ? this.state.reposicao.empresa.fantasia : ''} /><Text style={styles.label}>Repositor</Text><TextInput
              style={styles.inputNotEdit}
              editable={false}
              value={this.state.reposicao.repositor ? this.state.reposicao.repositor.fantasia : ''} /><Text style={styles.label}>Código</Text><TextInput
              style={styles.inputNotEdit}
              editable={false}
              value={this.state.reposicao.produto ? this.state.reposicao.produto.codigo : ''} /><Text style={styles.label}>Nome</Text><TextInput
              style={styles.inputNotEdit}
              editable={false}
              value={this.state.reposicao.produto ? this.state.reposicao.produto.nome : ''} /><Text style={styles.label}>Estoque Atual</Text><TextInput
              style={styles.inputNotEdit}
              editable={false}
              value={this.state.reposicao.produtoempresa ? String(this.state.reposicao.produtoempresa.estoqueAtual || 0) : '0'} /><Text style={styles.label}>Estoque Repositor</Text><TextInput
              style={styles.inputNotEdit}
              editable={false}
              value={this.state.reposicao.produtorepositor ? String(this.state.reposicao.produtorepositor.estoqueAtual || 0) : '0'} /><Text style={styles.label}>Quantidade Sugerida</Text><TextInput
              style={styles.inputNotEdit}
              editable={false}
              value={this.state.reposicao.quantidadeSugerida ? String(this.state.reposicao.quantidadeSugerida) : '0'} /><Text style={styles.label}>Quantidade</Text><TextInput
              style={styles.input}
              keyboardType='number-pad'
              onChangeText={quantidade => this.setState({ reposicao: { ...this.state.reposicao, quantidade: parseInt(quantidade) } })}
              value={this.state.reposicao.quantidade ? String(this.state.reposicao.quantidade) : '0'} /><Text style={styles.label}>Estoque Máximo</Text><TextInput
              style={styles.input}
              keyboardType='number-pad'
              onBlur={this.onBlurEstoqueMaximo}
              onChangeText={estoqueMaximo => this.setEstoqueMaximo(estoqueMaximo)}
              value={this.state.reposicao.produtoempresa ? String(this.state.reposicao.produtoempresa.estoqueMaximo || 0) : '0'} /><Text style={styles.label}>Endereço</Text><TextInput
              style={styles.input}
              onChangeText={endereco => this.setEndereco(endereco)}
              value={this.state.reposicao.produtoempresa ? this.state.reposicao.produtoempresa.endereco : ''} /><Text style={styles.labelModal}>Status</Text>


          </ScrollView>
        }


        {
          this.state.selectedIndex == 1 &&
          <SegmentedControlTab tabTextStyle={{ fontSize: 9 }}
            values={['Semana ', 'Ultimas Semanas', 'Ultimos meses', 'Ultimos 24 meses']}
            borderRadius={0}
            selectedIndex={this.state.demandaIndex}
            onTabPress={this.handleIndexChangeDemanda}
          />


        }

        {
          this.state.demandaIndex == 0 && this.state.selectedIndex > 0 &&


          <SafeAreaView>

            <Text style={styles.tabRowPeriodo}>Mês</Text>
            <Text style={styles.tabRowQuant}>Quantidade</Text>
            <FlatList

              data={this.state.demanda.saidasUltimaSemana}

              renderItem={(item) => {

                if (item.item.periodo != 'sabado' && item.item.periodo != 'domingo') {
                  var periodo = item.item.periodo + "-Feira";
                } else {
                  var periodo = item.item.periodo
                }

                return (
                  <View style={styles.container}>

                    <Text style={styles.upper}>{periodo}</Text>
                    <Text style={styles.quantidadeDemanda}>{item.item.quantidade ? String(item.item.quantidade || 0) : '0'}</Text>
                    <Text style={{
                      borderColor: 'gray',
                      borderBottomWidth: 1,
                      fontSize: 12,
                      color: 'black',
                    }}></Text>


                  </View>
                );
              }}

              keyExtractor={item => item._id.toString()}

            />

          </SafeAreaView>

        }

        {
          this.state.demandaIndex == 1 && this.state.selectedIndex > 0 &&
          <SafeAreaView>
            <Text style={styles.tabRowPeriodo}>Mês</Text>
            <Text style={styles.tabRowQuant}>Quantidade</Text>
            <FlatList

              data={this.state.demanda.saidasUltimasSemanas}

              renderItem={(item) => {

                if (item.item.periodo == 'semana1') {
                  var periodo = "Semana Corrente";
                } else if (item.item.periodo == 'semana2') {
                  var periodo = "Semana Passada";
                } else if (item.item.periodo == 'semana3') {
                  var periodo = "Semana Retrasada";
                } else if (item.item.periodo == 'semana4') {
                  var periodo = '4° Semana '
                } else if (item.item.periodo == 'semana5') {
                  var periodo = '5° Semana '
                } else if (item.item.periodo == 'semana6') {
                  var periodo = '6° Semana '
                } else if (item.item.periodo == 'semana7') {
                  var periodo = '7° Semana '
                }

                return (
                  <View style={styles.container}>
                    <Text style={styles.upper}>{periodo}</Text>
                    <Text style={styles.quantidadeDemanda}>{item.item.quantidade ? String(item.item.quantidade || 0) : '0'}</Text>
                    <Text style={{
                      borderColor: 'gray',
                      borderBottomWidth: 1,
                      fontSize: 12,
                      color: 'black',
                    }}></Text>

                  </View>
                );
              }}

              keyExtractor={item => item._id.toString()}

            />
          </SafeAreaView>


        }


        {
          this.state.demandaIndex == 2 && this.state.selectedIndex > 0 &&
          <SafeAreaView>
            <Text style={styles.tabRowPeriodo}>Mês</Text>
            <Text style={styles.tabRowQuant}>Quantidade</Text>
            <FlatList

              data={this.state.demanda.saidasUltimosMeses}

              renderItem={(item) => {

                if (item.item.periodo == 'marco') {
                  var periodo = "MARÇO";
                } else {
                  var periodo = item.item.periodo;
                }

                return (
                  <View style={styles.container}>
                    <Text style={styles.upper}>{periodo}</Text>
                    <Text style={styles.quantidadeDemanda}>{item.item.quantidade ? String(item.item.quantidade || 0) : '0'}</Text>
                    <Text style={{
                      borderColor: 'gray',
                      borderBottomWidth: 1,
                      fontSize: 12,
                      color: 'black',
                    }}></Text>


                  </View>
                );
              }}

              keyExtractor={item => item._id.toString()}

            />
          </SafeAreaView>



        }


        {
          this.state.demandaIndex == 3 && this.state.selectedIndex > 0 &&
          <SafeAreaView>
            <Text style={styles.tabRowPeriodo}>Mês</Text>
            <Text style={styles.tabRowQuant}>Quantidade</Text>
            <FlatList

              data={this.state.demanda.saidasUltimos24Meses}

              renderItem={(item) => {
                if (item.item.periodo == 'marco') {
                  var periodo = "MARÇO";
                } else {
                  var periodo = item.item.periodo;
                }


                return (
                  <View style={styles.container}>
                    <Text style={styles.upper}>{item.item.periodo}</Text>
                    <Text style={styles.quantidadeDemanda}>{item.item.quantidade ? String(item.item.quantidade || 0) : '0'}</Text>
                    <Text style={{
                      borderColor: 'gray',
                      borderBottomWidth: 1,
                      fontSize: 12,
                      color: 'black',
                    }}></Text>

                  </View>
                );
              }}

              keyExtractor={item => item._id.toString()}

            />
          </SafeAreaView>


        }


        {
          this.state.hideEditButton?
          this.state.create  ?
            <TouchableOpacity
              style={styles.addButton}
              activeOpacity={0.5}
              onPress={() => this.createReposicao()}>
              <Icon name='save' size={20} color='white'></Icon>
            </TouchableOpacity>
            :
            <TouchableOpacity
            
              style={styles.editButton}
              activeOpacity={0.5}
              onPress={() => this.verificaStatus()}>
              <Icon name='edit' size={20} color='white'></Icon>
            </TouchableOpacity>
            :<></>
        }
      </View >
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,

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
  tabRowPeriodo: {
    marginTop: 15,
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 18,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    position: 'relative'
  },
  tabRowQuant: {
    marginTop: 15,
    marginLeft: 15,
    fontWeight: 'bold',
    fontSize: 18,
    position: 'absolute',
    left: 250
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
  },
  upper: {
    padding: 12,
    textTransform: 'uppercase',
    position: 'absolute',
    fontWeight: 'bold',

    fontSize: 12
  },
  quantidadeDemanda: {

    padding: 12,
    textTransform: 'uppercase',
    position: 'absolute',
    fontWeight: 'bold',
    left: 320,
    fontSize: 12

  }

})
