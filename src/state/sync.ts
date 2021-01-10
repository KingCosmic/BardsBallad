import { newRidgeState } from 'react-ridge-state'

interface SyncState {
  syncing:boolean,
  new:string[],
  modified:string[],
  removed:string[]
}

export const syncState = newRidgeState<SyncState>({
  syncing: false,
  new: [],
  modified: [],
  removed: []
})