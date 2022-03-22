import {Alert, Platform} from 'react-native'

const apiUrl = 'https://api.conectasupply.com.br/api'
const oapiUrl = 'https://api.conectasupply.com.br/oapi'
const version = '1.0.5'

function showError(err) {

  if (err && err.response && err.response.data && err.response.data.errors) {
    if(err.response.data.errors instanceof Array) {
      err.response.data.errors.forEach(e => Alert.alert('Ops! Ocorreu um Problema!',e))
    } else {
      Alert.alert('Ops! Ocorreu um Problema!',`Mensagem: ${err.response.data.errors}`)
    }
  } else {
    Alert.alert('Ops! Ocorreu um Problema!',`Mensagem: ${err}`)
  }
}

function showSucess(msg) {
  Alert.alert('Sucesso!',msg)
}

export {apiUrl,
        oapiUrl,
        version,
        showError,
        showSucess}
