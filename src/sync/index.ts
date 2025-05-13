import { checkInternetAccess, setSyncedCharacters } from '../lib/api'
import { SyncStorage } from '../lib/storage'
import { openModal } from '../state/modals'

import { get as systemsGet, bulkPut as systemsBulkPut, pull as systemsPull, push as systemsPush } from './systems'
import { get as versionsGet, bulkPut as versionsBulkPut, pull as versionsPull, push as versionsPush } from './versions'
import { get as charactersGet, bulkPut as charactersBulkPut, pull as charactersPull, push as charactersPush } from './characters'
import { get as subscriptiosGet, bulkPut as subscriptionsBulkPut, pull as subscriptionsPull, push as subscriptionsPush } from './subscriptions'
import { setOnlineState, syncState } from '../state/sync'
import { authState } from '../state/auth'

const batchSize = 10

const collectionsToSync = [
  {
    name: 'Subscriptions',
    get: subscriptiosGet,
    bulkPut: subscriptionsBulkPut,
    pull: subscriptionsPull,
    push: subscriptionsPush,
  },
  {
    name: 'Systems',
    get: systemsGet,
    bulkPut: systemsBulkPut,
    pull: systemsPull,
    push: systemsPush
  },
  {
    name: 'Versions',
    get: versionsGet,
    bulkPut: versionsBulkPut,
    pull: versionsPull,
    push: versionsPush
  },
  {
    name: 'Characters',
    get: charactersGet,
    bulkPut: charactersBulkPut,
    pull: charactersPull,
    push: charactersPush
  }
]

// this checks if the user has internet / the server is reachable.
// this is better than the navigator value since it checks if the server is reachable.
checkInternetAccess().then((val) => {
  setOnlineState(val)
})

const runSync = async () => {
  try {
    const isOnline = await checkInternetAccess()
    const { isLoggedIn } = authState.get()

    setOnlineState(isOnline)

    if (isOnline && isLoggedIn) {
      await sync()
    }
  } catch (e) {
    console.error('Error in sync', e)
  }

  setTimeout(runSync, 10 * 1000) // every 10 seconds
}

runSync()

async function handleConflicts(conflicts: { local: any, remote: any }[]): Promise<any[]> {
  if (conflicts.length === 0) return []

  return new Promise((res) => {
    openModal({
      title: 'Handle Conflicts',
      type: 'handleConflicts',
      data: conflicts,
      onSave: res
    })
  })
}

type PullFunction = () => Promise<any[]>

type BulkPut = (docs: any[]) => Promise<any>

type PushFunction = () => Promise<{ local: any, remote: any }[]>

async function handlePullUpdates(bulkPut: BulkPut, pull: PullFunction, localDocuments: any[]) {
  let pullUpdates = true
  while (pullUpdates) {
    const documents = await pull()

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

    await bulkPut(newDocs)

    console.log('bulk put', documents.length)
  }
}

async function handlePushingUpdates(bulkPut: BulkPut, push: PushFunction) {
  let pushUpdates = true
  while (pushUpdates) {
    const pushConflicts = await push()

    if (pushConflicts.length === 0) {
      pushUpdates = false
      console.log('no conflicts')
    }

    const chosen = await handleConflicts(pushConflicts)

    await bulkPut(chosen)
    // TODO: we may need to reSync to push up our chosen conflict resolutions.

    console.log('conflicts handled', pushConflicts.length)
  }
}

export const sync = async () => {
  const { isOnline } = syncState.get()

  if (!isOnline) return

  // Update synced characters array first.
  const synced = await SyncStorage.get<string[]>('synced_characters') || []

  await setSyncedCharacters(synced)


  for (let i = 0; i < collectionsToSync.length; i++) {
    const coll = collectionsToSync[i]

    await handlePullUpdates(coll.bulkPut, coll.pull, await coll.get())

    await handlePushingUpdates(coll.bulkPut, coll.push)
  }

  // TODO: setup websocket connection for real-time updates.
}

window.addEventListener('online', async () => {
  console.log('online')

  const isOnline = await checkInternetAccess()

  setOnlineState(isOnline)
  
  if (!isOnline) {
    console.log('not connected')
    return
  }

  sync()
})

window.addEventListener('offline', () => {
  console.log('offline')

  setOnlineState(false)
  
  // TODO: not sure what to do here yet. Maybe just cancel the websocket connection?
})