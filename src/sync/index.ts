import { checkInternetAccess, setSyncedCharacters } from '../lib/api'
import { SyncStorage } from '../lib/storage'
import { openModal } from '../state/modals'

import { get as systemsGet, bulkPut as systemsBulkPut, pull as systemsPull, push as systemsPush } from './systems'
import { get as versionsGet, bulkPut as versionsBulkPut, pull as versionsPull, push as versionsPush } from './versions'
import { get as charactersGet, bulkPut as charactersBulkPut, pull as charactersPull, push as charactersPush } from './characters'
import { get as subscriptionsGet, bulkPut as subscriptionsBulkPut, pull as subscriptionsPull, push as subscriptionsPush } from './subscriptions'
import { setOnlineState, syncState } from '../state/sync'
import { authState } from '../state/auth'

const batchSize = 10

const collectionsToSync = [
  {
    name: 'Subscriptions',
    get: subscriptionsGet,
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

// wait 2 seconds for our initial sync (lets our data load)
setTimeout(runSync, 2 * 1000)

async function handleConflicts(conflicts: { local: any, remote: any }[]): Promise<any[]> {
  if (conflicts.length === 0) return []

  return new Promise(resolve => {
    openModal({
      title: 'Handle Conflicts',
      type: 'HandleConflicts',
      data: conflicts,
      onSave: resolve
    })
  })
}

type PullFunction = () => Promise<any[]>

type BulkPut = (docs: any[]) => Promise<any>

type PushFunction = () => Promise<{ conflicts: any[], metadata: any[] }>

type Get = () => Promise<any[]>

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

      const doVersionsMatch = (localDocument.version === doc.version)
      const wasUpdatedLocaly = (local >= remote)

      return (doVersionsMatch && wasUpdatedLocaly) ? [] : { local: localDocument, remote: doc }
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

async function handlePushingUpdates(bulkPut: BulkPut, push: PushFunction, localDocuments: any[]) {
  let pushUpdates = true
  while (pushUpdates) {
    const { conflicts, metadata } = await push()

    if (conflicts.length === 0) {
      pushUpdates = false
      console.log('no conflicts')
    }

    // we need to combine our metadata with our local documents (version hash updates, server id generation, etc.)
    const updatedDocs = metadata.map(data => {
      const localDoc = localDocuments.find(doc => doc.local_id === data.local_id)

      return {
        ...localDoc,
        ...data
      }
    })

    // store our updated docs.
    await bulkPut(updatedDocs)

    const pushConflicts = conflicts.flatMap(doc => {
      const localDocument = localDocuments.find(localDoc => localDoc.local_id === doc.local_id)

      if (!localDocument) return []

      return { local: localDocument, remote: doc }
    })

    const chosen = await handleConflicts(pushConflicts)

    console.log(chosen)

    await bulkPut(chosen)
    // TODO: we may need to reSync to push up our chosen conflict resolutions.
    // can possibly get away without a reSync if we just update the updated_at field so it gets picked up in the next sync cycle.

    console.log('conflicts handled', pushConflicts.length)
  }
}

export const sync = async () => {
  const { isOnline } = syncState.get()
  const { isLoggedIn } = authState.get()

  if (!isOnline || !isLoggedIn) return

  // Update synced characters array first.
  const synced = await SyncStorage.get<string[]>('synced_characters') || []

  await setSyncedCharacters(synced)


  for (let i = 0; i < collectionsToSync.length; i++) {
    const coll = collectionsToSync[i]

    await handlePullUpdates(coll.bulkPut, coll.pull, await coll.get())

    await handlePushingUpdates(coll.bulkPut, coll.push, await coll.get())
  }

  // TODO: setup websocket connection for real-time updates.
}

window.addEventListener('online', async () => {
  console.log('online')

  const isOnline = await checkInternetAccess()

  setOnlineState(isOnline)
  
  if (!isOnline) {
    console.log('not connected')
  }

  sync()
})

window.addEventListener('offline', () => {
  console.log('offline')

  setOnlineState(false)
  
  // TODO: not sure what to do here yet. Maybe just cancel the websocket connection?
})