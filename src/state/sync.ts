import { newRidgeState } from 'react-ridge-state'
import { convertCharacters } from '../system/converters'

export interface SyncState {
  converted:boolean,
  syncIssues:boolean,
  syncing:boolean,
  created:string[],
  updated:string[],
  deleted:string[]
}

export const syncState = newRidgeState<SyncState>({
  converted: false,
  syncIssues: true,
  syncing: false,
  created: [],
  updated: [],
  deleted: []
})

export function updateCharacters(chars) {
  const state = syncState.get()

  convertCharacters(chars)

  syncState.set({
    converted: true,
    syncIssues: true,
    syncing: false,
    created: state.created,
    updated: state.updated,
    deleted: state.deleted
  })
}