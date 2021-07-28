import localforage from 'localforage'
import { newRidgeState } from 'react-ridge-state'
import { syncCharacters } from '../services/db'
import { authState } from './auth';

export interface SyncState {
  converted:boolean,
  syncIssues:boolean,
  isSyncing:boolean,
  created:string[],
  updated:string[],
  deleted:string[]
}

export const syncState = newRidgeState<SyncState>(
  {
    converted: false,
    syncIssues: true,
    isSyncing: false,
    created: [],
    updated: [],
    deleted: []
  },
  {
    onSet: async (newState) => {
      try {
        const { created, updated, deleted } = newState;

        await localforage.setItem('sync_data', {
          created,
          updated,
          deleted
        })

        if (created.length === 0 && updated.length === 0 && deleted.length === 0) return;

        syncCharacters(true);
      } catch(e) {}
    }
  }
)

async function setInitialState() {
  const auth = authState.get()

  if (!auth.isLoggedIn) return

  try {
    // grab the item from storage.
    const item:string = await localforage.getItem('sync_data');

    // check if our item exists.
    if (item) {
      // parse our state.
      const initialState = JSON.parse(item);

      // set our initial state
      syncState.set({
        converted: false,
        syncIssues: false,
        isSyncing: false,
        created: initialState.created,
        updated: initialState.updated,
        deleted: initialState.deleted
      });
    }
  } catch (e) {}
}

// set state as our application starts.
setInitialState();

/* start of our actions */

type SyncData = {
  id:string,
  type:string
}

// this function reduces code duplication,
export async function updateSyncData(data:Array<SyncData>):Promise<void> {
  try {
    var syncData = syncState.get();

    for (let i = 0; i < data.length; i++) {
      const { type, id } = data[i];

      // we made a character (second check to make sure it isn't duplicated)
      if (type === 'new' && !syncData.created.includes(id)) {
        syncData.created.push(id);
      }

      // we're changing a character and it isn't already changed.
      else if (type === 'modified' && !syncData.updated.includes(id)) {
        syncData.updated.push(id);
      }

      // we're removing a character
      else if (type === 'removed') {
        // if this character was made before we synced, just remove it from the created array.
        if (syncData.created.includes(id)) {
          syncData.created = syncData.created.filter(newID => newID != id);
        }

        // if this character was modified before we synced, just remove it from the updated array
        if (syncData.updated.includes(id)) {
          syncData.updated = syncData.updated.filter(updatedID => updatedID != id);
        }
        
        // otherwise we need to add it to the removed array if it isn't already.
        else if (!syncData.deleted.includes(id)) {
          syncData.deleted.push(id);
        }
      }
    }
    
    // I don't like this maybe a pr to react-ridge-state to have it use promises aswell as cb?
    await new Promise((resolve) => syncState.set(syncData, () => resolve(true)))
  } catch (e) {}
}