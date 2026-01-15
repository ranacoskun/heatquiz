import axios from "axios"
import { getToken } from "./Auth"
import { getCurrentDatapool } from "./Datapools";

const Server = 'http://167.86.98.171:6001/api/'

export const LOGIN_REQUEST_API = (username, password, datapoolId) => {

  return axios.post(`${Server}Account/Login` , {
      username,
      password,
      datapoolId
  }).then(res => res)
  .catch(error => error)
}

export const GET_REQUEST_API = (Path, Value = null, withDatapool) => {
    const Route = `${Server}${Path}`
    const token = getToken()

    let url = Route

    if(Value) url += `/${Value}`

    if(withDatapool) {
      const data_pool_id = getCurrentDatapool()
      url += `/${data_pool_id}`
    }

    return axios.get(url,
      {
        headers: {
            'Authorization': token ? 'bearer ' + token : ''
          }
      })
    .then(res => res)
    .catch(error => error)
 }

 export const GET_REQUEST_BODY_API = (Path, Body, withDatapool) => {
  const Route = `${Server}${Path}`
  const token = getToken()

  let url = Route
  let DatapoolId = null

  if(withDatapool) {
    DatapoolId = getCurrentDatapool()
  }

  return axios.post(url,
    {
      ...Body,
      DatapoolId
    },
    {
      headers: {
          'Authorization': token ? 'bearer ' + token : ''
        }
    })
    .then(res => res)
    .catch(error => error)
}

//
export const ADD_REQUEST_BODY_API = (Path, Body, withDatapool) => {
  const Route = `${Server}${Path}`
  const token = getToken()

  let url = Route
  let DatapoolId = null

  if(withDatapool) {
    DatapoolId = getCurrentDatapool()
  }
  
  console.log(token)

  return axios.post(url,
    {
      ...Body,
      DatapoolId
    },
    {
      headers: {
          'Authorization': token ? 'bearer ' + token : ''
        }
    })
    .then(res => res)
    .catch(error => error)
}

export const ADD_REQUEST_FILE_API = (Path, FileData, withDatapool) => {
  const Route = `${Server}${Path}`
  const token = getToken()

  let url = Route
  let DatapoolId = null

  if(withDatapool) {
    DatapoolId = getCurrentDatapool()
  }

  FileData.append('DataPoolId', DatapoolId)

  return axios.post(url, 
      FileData,
      {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': token ? 'bearer ' + token : ''
            }
        })
        .then(res => res)
        .catch(error => error)

}

export const EDIT_REQUEST_BODY_API = (Path, Body, withDatapool) => {
  const Route = `${Server}${Path}`
  const token = getToken()

  let url = Route
  let DatapoolId = null

  if(withDatapool) {
    DatapoolId = getCurrentDatapool()
  }
  
  return axios.post(url,
    {
      ...Body,
      DatapoolId
    },
    {
      headers: {
          'Authorization': token ? 'bearer ' + token : ''
        }
    })
    .then(res => res)
    .catch(error => error)
}

export const EDIT_REQUEST_FILE_API = (Path, FileData, withDatapool) => {
  const Route = `${Server}${Path}`
  const token = getToken()

  let url = Route
  let DatapoolId = null

  if(withDatapool) {
    DatapoolId = getCurrentDatapool()
  }

  FileData.append('DataPoolId', DatapoolId)

  return axios.post(url, 
      FileData,
      {
          headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': token ? 'bearer ' + token : ''
            }
        })
        .then(res => res)
        .catch(error => error)

}
