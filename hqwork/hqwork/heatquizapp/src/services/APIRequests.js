import axios from "axios"
import { getToken } from "./Auth"
import { getCurrentDatapool } from "./Datapools";

// IMPORTANT:
// In production, the API base URL must NOT be hardcoded to localhost.
// - Configure via REACT_APP_API_SERVER at build time (Create React App bakes env vars into the bundle).
// - Example: REACT_APP_API_SERVER=https://<your-quizapi-app>.azurewebsites.net/api/
const normalizeApiBase = (value) => {
  const v = (value || '').trim();
  if (!v) return null;
  return v.endsWith('/') ? v : `${v}/`;
};

const Server =
  normalizeApiBase(process.env.REACT_APP_API_SERVER) ||
  // Reasonable fallback: if frontend+backend are hosted behind the same origin (reverse proxy), this works.
  `${window.location.origin}/api/`;

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
