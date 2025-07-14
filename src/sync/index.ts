import { SyncStorage } from '@lib/storage'
import { openModal } from '@state/modals'

import { get as systemsGet, bulkPut as systemsBulkPut, pull as systemsPull, push as systemsPush } from './systems'
import { get as versionsGet, bulkPut as versionsBulkPut, pull as versionsPull, push as versionsPush } from './versions'
import { get as charactersGet, bulkPut as charactersBulkPut, pull as charactersPull, push as charactersPush } from './characters'
import { get as subscriptionsGet, bulkPut as subscriptionsBulkPut, pull as subscriptionsPull, push as subscriptionsPush } from './subscriptions'
import { setOnlineState, syncState } from '@state/sync'
import { authState } from '@state/auth'
import {setSyncedCharacters} from "@api/setSyncedCharacters";
import {checkInternetAccess} from "@api/checkInternetAccess";
import React from 'react'
import HandleConflicts from '@modals/HandleConflicts'
import { db } from '@storage/index'
import storeHashes from '@storage/methods/hashes/storeHashes'
import generateTypeHash from '@utils/generateTypeHash'

const batchSize = 10

// TODO: We could probably sync based of subscriptions instead of each collection...
// or atleast pull our stuff to sync from subscriptions and just build out the id's to sync at once instead of multiple for loops and checks.

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

async function handleConflicts(conflicts: { local: any, remote: any }[]): Promise<any[]> {
  if (conflicts.length === 0) return []

  return new Promise(resolve => {
    openModal('handle-conflicts', ({ id }) => React.createElement(HandleConflicts, { id, data: conflicts, onSave: resolve }))
  })
}

type PullFunction = () => Promise<any[]>

type BulkPut = (docs: any[]) => Promise<any>

type PushFunction = () => Promise<{ conflicts: any[], metadata: any[] }>

async function handlePullUpdates(bulkPut: BulkPut, pull: PullFunction, localDocuments: any[]) {
  let pullUpdates = true
  while (pullUpdates) {
    const documents = await pull()

    if (documents.length < batchSize) {
      pullUpdates = false
    }

    const pullConflicts = documents.flatMap(doc => {
      const localDocument = localDocuments.find((localDoc) => localDoc.local_id === doc.local_id)

      if (!localDocument) return []

      const local = new Date(localDocument.updated_at).getTime()
      const remote = new Date(doc.updated_at).getTime()

      const versionsDontMatch = (localDocument.version !== doc.version)
      const wasUpdatedLocally = (local >= remote)

      return (versionsDontMatch && wasUpdatedLocally) ? { local: localDocument, remote: doc } : []
    })

    const chosen = await handleConflicts(pullConflicts)

    const newDocs = documents.map(d => (chosen.find(c => c.local_id === d.local_id) || d))

    await bulkPut(newDocs)
  }
}

async function handlePushingUpdates(bulkPut: BulkPut, push: PushFunction, localDocuments: any[]) {
  let pushUpdates = true
  while (pushUpdates) {
    const { conflicts, metadata } = await push()

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

    if (conflicts.length === 0) {
      pushUpdates = false
      return
    }

    const pushConflicts = conflicts.flatMap(doc => {
      const localDocument = localDocuments.find(localDoc => localDoc.local_id === doc.local_id)

      if (!localDocument) return []

      return { local: localDocument, remote: doc }
    })

    const chosen = await handleConflicts(pushConflicts)

    await bulkPut(chosen)

    // TODO: we may need to reSync to push up our chosen conflict resolutions.
    // can possibly get away without a reSync if we just update the updated_at field so it gets picked up in the next sync cycle.
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

  // TODO: only generate hashes for new items at some point. but this is a quick hack to make it work.
  const versions = await db.versions.toArray()
  versions.forEach(vers => {
    storeHashes(vers.local_id, vers.data.types.map(generateTypeHash))
  })

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
