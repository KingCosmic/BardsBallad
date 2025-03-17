import axios from 'axios'
import { saveToken } from '../state/auth'

const api = axios.create({
  baseURL: 'http://localhost:3000/',
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  return config
})

api.interceptors.response.use((response) => {
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

export default api


