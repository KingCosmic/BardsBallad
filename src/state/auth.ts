import { newRidgeState } from 'react-ridge-state'

import { jwtDecode } from 'jwt-decode'

type User = {
  id: string;
  username: string;
  email: string;
  role: number;
  synced_characters: string[];
  discord_id: string;
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
    authState.set({ isLoggedIn: true, user, synced_characters: user.synced_characters || [] })
  }
}

export const saveToken = (token: string) => {
  localStorage.setItem('token', token)

  const user = jwtDecode<User>(token)

  authState.set({ isLoggedIn: true, user, synced_characters: user.synced_characters || [] })

  return user
}

loadToken()