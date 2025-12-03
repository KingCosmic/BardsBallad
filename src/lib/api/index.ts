import axios from 'axios'
import { saveToken } from '@/state/auth'
import { isHostnameLocal } from "@/utils/network/isHostnameLocal";

const version = 'v1'
const api = axios.create({
  baseURL: isHostnameLocal() ? `http://${window.location.hostname}:3000/${version}` : `https://api.bardsballad.com/${version}`,
});

api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('token')
  const apiKey = localStorage.getItem('apiKey')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    config.headers['x-api-key'] = apiKey || ''
  }

  return config
})

// Response interceptor to handle the new format
api.interceptors.response.use(
  (response) => {
    // Check if there's a new token in the response headers
    const newToken = response.headers['authorization']
    const apiKey = response.headers['x-api-key']

    if (newToken) {
      // Remove 'Bearer ' prefix if it exists and save the token
      const token = newToken.replace('Bearer ', '')
      saveToken(token)
    }

    // if we got a new apiKey we need to update our local one.
    if (apiKey) {
      localStorage.setItem('apiKey', apiKey)
    }
  
    // Check if the response has the new format
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      const { error, data } = response.data;
      
      // Handle silent errors (show toast)
      if (error && error.trim() !== '') {
        // addToast(error, 'error');
        console.warn('API Error:', error);
      }
      
      // Return just the data portion to maintain backward compatibility
      response.data = data;
    }
    
    return response;
  },
  (error) => {
    // Handle HTTP errors (4xx, 5xx)
    if (error.response && error.response.data) {
      const { error: apiError } = error.response.data;
      
      if (apiError && apiError.trim() !== '') {
        // addToast(apiError, 'error');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api