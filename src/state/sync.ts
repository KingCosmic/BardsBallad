import localforage from 'localforage'
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

export async function loadState() {
  let state:SyncState = await localforage.getItem('sync_data') || { created: [], updated: [], deleted: [] } as SyncState;
  
  syncState.set({
    converted: false,
    syncIssues: false,
    syncing: false,
    created: state.created,
    updated: state.updated,
    deleted: state.deleted
  })
}

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