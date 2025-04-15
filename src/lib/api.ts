import axios from 'axios'
import { saveToken, updateSyncedCharacters } from '../state/auth'
import { getDeviceIdentifier } from '../utils/getDeviceName'
import { type Character } from '../storage/schemas/character'
import { updateDatabaseWithUserInfo } from '../storage/updateDatabaseWithUserInfo'

const api = axios.create({
  baseURL: 'http://localhost:3000/v1',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  const apiKey = localStorage.getItem('apiKey')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    config.headers['x-api-key'] = apiKey || ''
  }

  return config
})

api.interceptors.response.use((response) => {
  // Check if there's a new token in the response headers
  const newToken = response.headers['authorization']
  const apiKey = response.headers['x-api-key']

  console.log(response.headers)

  if (newToken) {
    // Remove 'Bearer ' prefix if it exists and save the token
    const token = newToken.replace('Bearer ', '')
    saveToken(token)
  }

  if (apiKey) {
    localStorage.setItem('apiKey', apiKey)
  }

  return response
}, (error) => {
  return Promise.reject(error)
})

// Technically this doesn't check internet access, but rather if the server is reachable
// The client should be considered offline if they have no internet or the server isn't reachable.
export const checkInternetAccess = async () => {
  try {
    const response = await api.get('/ping');
    return response.status === 200;
  } catch (err) {
    return false;
  }
}

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { username, email, password, deviceName: await getDeviceIdentifier() })

  const { accessToken, apiKey, deviceId } = response.data

  if (!(accessToken | apiKey | deviceId)) return

  const user = saveToken(accessToken)

  localStorage.setItem('apiKey', apiKey)
  localStorage.setItem('deviceId', deviceId)

  updateDatabaseWithUserInfo(user.id, deviceId)
}

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password, deviceName: await getDeviceIdentifier(), deviceId: localStorage.getItem('deviceId') })

  const { accessToken, apiKey, deviceId } = response.data

  if (!(accessToken | apiKey | deviceId)) return

  const user = saveToken(accessToken)

  localStorage.setItem('apiKey', apiKey)
  localStorage.setItem('deviceId', deviceId)

  updateDatabaseWithUserInfo(user.id, deviceId)
}

export const logout = async () => {

}

export const setSyncedCharacters = async (characters: string[]) => {
  updateSyncedCharacters(characters)
  const response = await api.post('/characters/change-synced', { characterIds: characters })

  updateSyncedCharacters(characters)

  return response.data
}

export const pullUpdatesForCharacters = async (checkpointOrNull: { updatedAt: number, id: string } | null, batchSize: number): Promise<{
  documents: Character[];
  checkpoint: { id: number, updatedAt: string };
}> => {
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

export const pushUpdatesForCharacters = async (items: Character[]) => {
  return await api.post('/characters/push', items).then((response) => response.data)
}

export default api


