import axios from "axios"
import { getToken } from "./Auth"
import { getCurrentDatapool } from "./Datapools";

const Server = 'http://localhost:6001/api/'

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
      if(data_pool_id) url += `/${data_pool_id}`
    }

    const headers = {}
    if(token) {
      headers['Authorization'] = 'Bearer ' + token
    }
    
    return axios.get(url, { headers })
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

  const headers = {}
  if(token) {
    headers['Authorization'] = 'Bearer ' + token
  }
  
  return axios.post(url,
    {
      ...Body,
      DatapoolId
    },
    { headers })
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

  const headers = {}
  if(token) {
    headers['Authorization'] = 'Bearer ' + token
  }
  
  return axios.post(url,
    {
      ...Body,
      DatapoolId
    },
    { headers })
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

  const headers = {
    'Content-Type': 'multipart/form-data'
  }
  if(token) {
    headers['Authorization'] = 'Bearer ' + token
  }
  
  return axios.post(url, FileData, { headers })
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
  
  const headers = {}
  if(token) {
    headers['Authorization'] = 'Bearer ' + token
  }
  
  return axios.post(url,
    {
      ...Body,
      DatapoolId
    },
    { headers })
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

  const headers = {
    'Content-Type': 'multipart/form-data'
  }
  if(token) {
    headers['Authorization'] = 'Bearer ' + token
  }
  
  return axios.post(url, FileData, { headers })
        .then(res => res)
        .catch(error => error)

}
