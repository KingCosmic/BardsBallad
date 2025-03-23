import axios from 'axios'
import { saveToken } from '../state/auth'
import { RxReplicationWriteToMasterRow } from 'rxdb'

const api = axios.create({
  baseURL: 'http://localhost:3000/v1',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use((response) => {
  // Check if there's a new token in the response headers
  const newToken = response.headers['authorization']

  if (newToken) {
    // Remove 'Bearer ' prefix if it exists and save the token
    const token = newToken.replace('Bearer ', '')
    saveToken(token)
  }

  return response
}, (error) => {
  return Promise.reject(error)
})

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { username, email, password })

  if (response.data.token) {
    saveToken(response.data.token)
  }
}

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password })

  if (response.data.token) {
    saveToken(response.data.token)
  }
}

export const pullUpdatesForCharacters = async (checkpointOrNull: { updatedAt: number, id: string } | null, batchSize: number) => {
  const updatedAt = checkpointOrNull?.updatedAt || 0
  const id = checkpointOrNull?.id || ''
  
  return await api.get<{ documents: any, checkpoint: any }>('/characters/pull', {
    params: {
      updatedAt,
      id,
      batchSize
    }
  }).then((response) => response.data)
}

export const pushUpdatesForCharacters = async (rows: RxReplicationWriteToMasterRow<unknown>[]) => {
  return await api.post('/characters/push', rows).then((response) => response.data)
}

export default api


