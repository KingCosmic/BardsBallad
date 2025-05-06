import { jwtDecode } from 'jwt-decode'
import { checkInternetAccess, pullUpdatesForCharacters, pullUpdatesForSystems, pushUpdatesForCharacters, pushUpdatesForSystems, setSyncedCharacters } from '../lib/api'
import { AuthStorage, SyncStorage } from '../lib/storage'
import { openModal } from '../state/modals'
import { db } from '../storage'
import { type Character } from '../storage/schemas/character'

const batchSize = 10

// set our initial value to the navigator value.
// this checks the device is connected, not if that internet is working.
let isOnline = navigator.onLine

// this checks if the user has internet / the server is reachable.
// this is better than the navigator value since it checks if the server is reachable.
checkInternetAccess().then((val) => {
  isOnline = val
})

setInterval(async () => {
  isOnline = await checkInternetAccess()
}, 5 * 60 * 1000) // every 5 minutes.

async function handleConflicts(conflicts: { local: Character, remote: Character }[]): Promise<Character[]> {
  if (conflicts.length === 0) return []

  return new Promise((res) => {
    // TODO: show a modal to the user to resolve conflicts
    openModal({
      title: 'Handle Conflicts',
      type: 'handleConflicts',
      data: conflicts,
      onSave: res
    })
  })
}

type PullFunction = (checkpointOrNull: {
  updated_at: number;
  id: string;
} | null, batchSize: number) => Promise<{
  documents: any[];
  checkpoint: {
    id: number;
    updated_at: string;
  };
}>

type PushFunction = (localDocuments: any[]) => Promise<{ local: any, remote: any }[]>

async function handlePullUpdates(pull: PullFunction, localDocuments: any[]) {
  const cp = await SyncStorage.get('sync_checkpoint')
  console.log('syncing')

  let pullUpdates = true
  while (pullUpdates) {
    const { checkpoint, documents } = await pull(cp ?? null, batchSize)

    await SyncStorage.set('sync_checkpoint', checkpoint)

    console.log('sync checkpoint', checkpoint)
    console.log('sync documents', documents)

    const pullConflicts = documents.flatMap(doc => {
      const localDocument = localDocuments.find((localDoc) => localDoc.local_id === doc.local_id)

      if (!localDocument) return []

      const local = new Date(localDocument.updated_at).getTime()
      const remote = new Date(doc.updated_at).getTime()

      return (local > remote) ? { local: localDocument, remote: doc } : []
    })

    const chosen = await handleConflicts(pullConflicts)

    if (documents.length < batchSize) {
      pullUpdates = false
    }

    const newDocs = documents.map(d => (chosen.find(c => c.local_id === d.local_id) || d))

    await db.characters.bulkPut(newDocs)

    console.log('bulk put', documents.length)
  }
}

async function handlePushingUpdates(push: PushFunction, localDocuments: any[]) {
  let pushUpdates = true
  while (pushUpdates) {
    const pushConflicts = await push(localDocuments)

    if (pushConflicts.length === 0) {
      pushUpdates = false
      console.log('no conflicts')
    }

    const chosen = await handleConflicts(pushConflicts)

    await db.characters.bulkPut(chosen)
    // TODO: we may need to reSync to push up our chosen conflict resolutions.

    console.log('documents pushed', localDocuments.length)
    console.log('conflicts handled', pushConflicts.length)
  }
}

export const sync = async () => {
  if (!isOnline) return

  // Update synced characters array first.
  const synced = await SyncStorage.get('synced_characters') || []

  await setSyncedCharacters(synced)

  const user = jwtDecode<{ role: number }>(await AuthStorage.get('token'))

  if (!user) return

  const isPremium = user.role > 0

  // Systems need to be synced *FIRST* just on the offchance that syncing fails halfway through, another
  // client won't download a character that references a system that doesn't exist.
  // downloading a system that isn't being used is fine, but downloading a character that references a system that doesn't exist is bad.

  // TODO: Sync Systems before characters.

  const localCharacters = await db.characters.toArray()

  const updatedCharacters = await SyncStorage.get('updated_characters') || []
  const localCharactersToPush = localCharacters.filter(c => {
    const isSynced = synced.includes(c.local_id)
    const isUpdated = updatedCharacters.includes(c.local_id)

    // premium users can push all characters.
    if (isPremium && isUpdated) return true

    // free users can only push synced characters.
    if (isSynced && isUpdated) return true

    return false
  })

  /* Systems */

  const localSystems = await db.systems.toArray()

  await handlePullUpdates(pullUpdatesForSystems, localSystems)

  const systemsToPush = localSystems.filter(s => {
    const pushedCharacterRef = localCharactersToPush.find(c => c.system.local_id === s.local_id)

    // if a character we're syncing relies on this character we need to sync it too.
    const referencedByChar = (pushedCharacterRef !== undefined)

    // if this system hasn't been synced and we're premium it should be synced.
    const notSyncedAndPremium = (!s.id && isPremium)

    return (referencedByChar || notSyncedAndPremium)
  })

  await handlePushingUpdates(pushUpdatesForSystems, systemsToPush)

  /* Characters */

  await handlePullUpdates(pullUpdatesForCharacters, localCharacters)
  console.log('documents pulled', localCharacters.length)


  await handlePushingUpdates(pushUpdatesForCharacters, localCharactersToPush)

  // TODO: setup websocket connection for real-time updates.
}

window.addEventListener('online', async () => {
  console.log('online')

  const isConnected = await checkInternetAccess()
  
  if (!isConnected) {
    console.log('not connected')
    isOnline = false
    return
  }

  sync()
})

window.addEventListener('offline', () => {
  console.log('offline')
  
  // TODO: not sure what to do here yet. Maybe just cancel the websocket connection?
})