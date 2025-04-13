import { newRidgeState } from 'react-ridge-state'

import { jwtDecode } from 'jwt-decode'

type User = {
  id: string;
  username: string;
  email: string;
  role: number;
  synced_characers: string[];
}

type AuthState = {
  isLoggedIn: boolean;
  user: User | null;
}

const defaultState: AuthState = {
  isLoggedIn: false,
  user: null
}

export const authState = newRidgeState<AuthState>(defaultState)

export const loadToken = () => {
  const token = localStorage.getItem('token')

  if (token) {
    const user = jwtDecode<User>(token)
    authState.set({ isLoggedIn: true, user })
  }
}

export const saveToken = (token: string) => {
  localStorage.setItem('token', token)

  const user = jwtDecode<User>(token)

  authState.set({ isLoggedIn: true, user })
}

export const logout = () => {
  localStorage.removeItem('token')
  authState.set(defaultState)
}

loadToken()
