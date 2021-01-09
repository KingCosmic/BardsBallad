import { newRidgeState } from 'react-ridge-state'

import api from '../services/api'

interface AuthState {
  isLoggedIn: boolean
}

export const authState = newRidgeState<AuthState>({
  isLoggedIn: api.isLoggedIn()
})

// Wrap any Firebase methods we want to use making sure ...
// ... to save the user to state.
export function login(email: string, password: string) {
  return api.login(email, password).then(() => {
    authState.set({
      isLoggedIn: true
    })
  })
}

export function signup(email: string, password: string) {
  return api.signup(email, password).then(() => {
    authState.set({
      isLoggedIn: true
    })
  })
}

export function signout() {
  return api.logout().then(() => {
    authState.set({
      isLoggedIn: false
    })
  })
}
