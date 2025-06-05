import axios from 'axios'
import { saveToken } from '@state/auth'
import { AuthStorage } from '@/lib/storage'
import {isHostnameLocal} from "@utils/isHostnameLocal";

const api = axios.create({
  baseURL: isHostnameLocal() ? `http://${window.location.hostname}:3000/v1` : 'https://api.bardsballad.com/v1',
});

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

export default api




