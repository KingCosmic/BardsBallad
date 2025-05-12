import { newRidgeState } from 'react-ridge-state'

type SyncState = {
  isOnline: boolean
}

export const syncState = newRidgeState<SyncState>({
  isOnline: navigator.onLine
})

export const setOnlineState = (isOnline: boolean) => syncState.set((prevState) => ({ ...prevState, isOnline }))