import axios, { AxiosResponse } from 'axios'
import { authState, saveToken, updateSyncedCharacters } from '../state/auth'
import { getDeviceIdentifier } from '../utils/getDeviceName'
import { type Character } from '../storage/schemas/character'
import { updateDatabaseWithUserInfo } from '../storage/updateDatabaseWithUserInfo'
import { db } from '../storage'
import { AuthStorage, MiscStorage, SyncStorage } from './storage'
import { System } from '../storage/schemas/system'
import { VersionedResource } from '../storage/schemas/versionedResource'
import { UserSubscription } from '../storage/schemas/userSubscription'

const api = axios.create({
  baseURL: 'http://localhost:3000/v1',
})

api.interceptors.request.use(async (config) => {
  const token = await AuthStorage.get('token')
  const apiKey = await AuthStorage.get('apiKey')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    config.headers['x-api-key'] = apiKey || ''
  }

  return config
})

api.interceptors.response.use(async (response) => {
  // Check if there's a new token in the response headers
  const newToken = response.headers['authorization']
  const apiKey = response.headers['x-api-key']

  if (newToken) {
    // Remove 'Bearer ' prefix if it exists and save the token
    const token = newToken.replace('Bearer ', '')
    saveToken(token)
  }

  if (apiKey) {
    await AuthStorage.set('apiKey', apiKey)
  }

  return response
}, (error) => {
  return Promise.reject(error)
})

export const testApi = async () => {
  try {
    const response = await api.get('/test')
    return response.data
  } catch (err) {
    console.error('Error testing API:', err)
    return null
  }
}

// Technically this doesn't check internet access, but rather if the server is reachable
// The client should be considered offline if the server isn't reachable.
export const checkInternetAccess = async () => {
  try {
    const response = await api.get('/ping');
    return response.status === 200;
  } catch (err) {
    return false;
  }
}

export const getMarketplaceItem = async (id: string): Promise<any | null> => {
  try {
    const resp = await api.get(`/marketplace/${id}`)
    return resp.data
  } catch (err) {
    return null;
  }
}

export const publishItem = async (data: any) => {
  try {
    const response = await api.post('/marketplace', data)
    return response.status === 200;
  } catch (err) {
    return false;
  }
}

export const getMarketplaceItems = async (): Promise<any[]> => {
  try {
    const resp = await api.get(`/marketplace`)

    return resp.data
  } catch (err) {
    return [];
  }
}

export const getVersionsForItem = async (id: string): Promise<any[]> => {
  try {
    const resp = await api.get(`/marketplace/${id}/versions`)

    return resp.data
  } catch (err) {
    return [];
  }
}

export const getSubscriptionData = async (id: string): Promise<any | null> => {
  try {
    const resp = await api.get(`/marketplace/subscribe/${id}`)

    return resp.data
  } catch (err) {
    return null;
  }
}

export const register = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/register', { username, email, password, deviceName: await getDeviceIdentifier() })

  const { accessToken, apiKey, deviceId } = response.data

  if (!(accessToken | apiKey | deviceId)) return

  const user = await saveToken(accessToken)

  AuthStorage.set('apiKey', apiKey)
  AuthStorage.set('deviceId', deviceId)

  updateDatabaseWithUserInfo(user.id, deviceId)
}

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password, deviceName: await getDeviceIdentifier(), deviceId: await AuthStorage.get('deviceId') })

  const { accessToken, apiKey, deviceId } = response.data

  if (!(accessToken | apiKey | deviceId)) return

  const user = await saveToken(accessToken)

  AuthStorage.set('apiKey', apiKey)
  AuthStorage.set('deviceId', deviceId)

  updateDatabaseWithUserInfo(user.id, deviceId)
}

export const logout = async () => {
  AuthStorage.clear()
  SyncStorage.clear()

  authState.set({ isLoggedIn: false, user: null, synced_characters: [] })

  await Promise.all(
    db.tables.map(table => table.clear())
  );  
}

export const setSyncedCharacters = async (characters: string[]) => {
  updateSyncedCharacters(characters)
  const response = await api.post('/characters/change-synced', { characterIds: characters })

  updateSyncedCharacters(characters)

  return response.data
}

export const pullUpdatesForVersions = async (checkpointOrNull: { updated_at: number, id: string } | null, batchSize: number): Promise<{
  documents: VersionedResource[];
  checkpoint: { id: number, updated_at: string };
}> => {
  const updated_at = checkpointOrNull?.updated_at || 0
  const id = checkpointOrNull?.id || ''
  
  return await api.get<{ documents: any, checkpoint: any }>('/versions/pull', {
    params: {
      updated_at,
      id,
      batchSize
    }
  }).then((response) => response.data)
}

export const pushUpdatesForVersions = async (items: VersionedResource[]) => {
  return await api.post('/versions/push', items).then((response) => response.data)
}

export const pullUpdatesForSubscriptions = async (checkpointOrNull: { updated_at: number, id: string } | null, batchSize: number): Promise<{
  documents: UserSubscription[];
  checkpoint: { id: number, updated_at: string };
}> => {
  const updated_at = checkpointOrNull?.updated_at || 0
  const id = checkpointOrNull?.id || ''
  
  return await api.get<{ documents: any, checkpoint: any }>('/subscriptions/pull', {
    params: {
      updated_at,
      id,
      batchSize
    }
  }).then((response) => response.data)
}

export const pushUpdatesForSubscriptions = async (items: UserSubscription[]) => {
  return await api.post('/subscriptions/push', items).then((response) => response.data)
}

export const pullUpdatesForSystems = async (checkpointOrNull: { updated_at: number, id: string } | null, batchSize: number): Promise<{
  documents: System[];
  checkpoint: { id: number, updated_at: string };
}> => {
  const updated_at = checkpointOrNull?.updated_at || 0
  const id = checkpointOrNull?.id || ''
  
  return await api.get<{ documents: any, checkpoint: any }>('/systems/pull', {
    params: {
      updated_at,
      id,
      batchSize
    }
  }).then((response) => response.data)
}

export const pushUpdatesForSystems = async (items: System[]) => {
  return await api.post('/systems/push', items).then((response) => response.data)
}

export const pullUpdatesForCharacters = async (checkpointOrNull: { updated_at: number, id: string } | null, batchSize: number): Promise<{
  documents: Character[];
  checkpoint: { id: number, updated_at: string };
}> => {
  const updated_at = checkpointOrNull?.updated_at || 0
  const id = checkpointOrNull?.id || ''
  
  return await api.get<{ documents: any, checkpoint: any }>('/characters/pull', {
    params: {
      updated_at,
      id,
      batchSize
    }
  }).then((response) => response.data)
}

export const pushUpdatesForCharacters = async (items: Character[]) => {
  return await api.post('/characters/push', items).then((response) => response.data)
}

export const subscribe = async () => {
  return await api.get('/stripe/create-checkout-session').then((response) => response.data)
}

export const openBilling = async () => {
  return await api.get('/stripe/create-portal-session').then((response) => response.data)
}

export const syncStripeData = async () => {
  const response = await api.get('/stripe/sync-stripe-data')

  const { newAccessToken } = response.data

  if (!newAccessToken) return

  saveToken(newAccessToken)
}

export default api


