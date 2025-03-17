import { newRidgeState } from 'react-ridge-state'

import { jwtDecode } from 'jwt-decode'

type User = {
  id: string;
  username: string;
  email: string;
}

type AuthState = {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: User | null;
}

const defaultState: AuthState = {
  isLoggedIn: false,
  isLoading: false,
  user: null
}

export const authState = newRidgeState<AuthState>(defaultState)

export const loadToken = () => {
  const token = localStorage.getItem('token')

  if (token) {
    const user = jwtDecode<User>(token)
    authState.set({ isLoggedIn: true, isLoading: false, user })
  }
}

export const saveToken = (token: string) => {
  localStorage.setItem('token', token)

  const user = jwtDecode<User>(token)

  authState.set({ isLoggedIn: true, isLoading: false, user })
}

export const logout = () => {
  localStorage.removeItem('token')
  authState.set(defaultState)
}