import { newRidgeState } from 'react-ridge-state'

import api from '../services/api'

import { User } from '../types'

interface AuthState {
  isLoggedIn:boolean,
  user?:User
}

export const authState = newRidgeState<AuthState>({
  isLoggedIn: api.isLoggedIn(),
  user: api.getProfile()
})

// Wrap any Firebase methods we want to use making sure ...
// ... to save the user to state.
export function login(email: string, password: string) {
  return api.login(email, password).then(user => {
    authState.set({
      isLoggedIn: true,
      user
    })
  })
}

export function signup(email: string, password: string) {
  return api.signup(email, password).then(user => {
    authState.set({
      isLoggedIn: true,
      user
    })
  })
}

export function signout() {
  return api.logout().then(() => {
    authState.set({
      isLoggedIn: false,
      user: undefined
    })
  })
}
