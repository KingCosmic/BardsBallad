import { newRidgeState } from 'react-ridge-state'

import { jwtDecode } from 'jwt-decode'
import { AuthStorage, SyncStorage } from '../lib/storage';

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

export const loadToken = async () => {
  const token = await AuthStorage.get<string>('token')

  if (token) {
    const user = jwtDecode<User>(token)
    authState.set({ isLoggedIn: true, user, synced_characters: user.synced_characers || [] })
  }
}

export const saveToken = async (token: string) => {
  await AuthStorage.set('token', token)

  const user = jwtDecode<User>(token)
  console.log('decoded', user)

  authState.set({ isLoggedIn: true, user, synced_characters: user.synced_characers || [] })

  return user
}

export const updateSyncedCharacters = (characters: string[]) => {
  authState.set((prev) => ({ ...prev, synced_characters: characters }))
  SyncStorage.set('synced_characters', characters)
}

export const logout = () => {
  AuthStorage.remove('token')
  authState.set(defaultState)
}

loadToken()
