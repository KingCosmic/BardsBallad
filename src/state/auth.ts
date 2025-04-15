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
  synced_characters: string[];
}

const defaultState: AuthState = {
  isLoggedIn: false,
  user: null,
  synced_characters: []
}

export const authState = newRidgeState<AuthState>(defaultState)

export const loadToken = () => {
  const token = localStorage.getItem('token')

  if (token) {
    const user = jwtDecode<User>(token)
    authState.set({ isLoggedIn: true, user, synced_characters: user.synced_characers })
  }
}

export const saveToken = (token: string) => {
  localStorage.setItem('token', token)

  const user = jwtDecode<User>(token)
  console.log('decoded', user)

  authState.set({ isLoggedIn: true, user, synced_characters: user.synced_characers })
}

export const updateSyncedCharacters = (characters: string[]) => {
  authState.set((prev) => ({ ...prev, synced_characters: characters }))
  localStorage.setItem('synced_characters', JSON.stringify(characters))
}

export const logout = () => {
  localStorage.removeItem('token')
  authState.set(defaultState)
}

loadToken()
