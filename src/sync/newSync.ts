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
import { addToast } from '@state/toasts'
import { hasRole } from '@utils/roles/hasRole'
import Roles from '@/const/roles'

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
    get: db.characters.bulkGet,
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
    openModal('handle-conflicts', ({ id }) => React.createElement(HandleConflicts, { data: conflicts, onSave: resolve }))
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
  try {
    const { isOnline } = syncState.get()
    const { isLoggedIn, user } = authState.get()

    if (!isOnline || !isLoggedIn || !user) return

    const isPremium = hasRole(user.role, Roles.PREMIUM)

    // Update synced characters array first.
    const synced = await SyncStorage.get<string[]>('synced_characters') || []

    await setSyncedCharacters(synced)

    // now that we've updated our synced_characters list, lets sort all the items to sync.
    const [subs, chars] = await Promise.all([
      db.subscriptions.toArray(),
      db.characters.toArray()
    ])

    const updatedSubs = await SyncStorage.get<string[]>('updated_subs') || []

    let subsToPush = []
    let sysToPush = []
    let versToPush = []
    // TODO: get characters to sync.
    // let charsToPush = await SyncStorage.get()

    for (let s = 0; s < subs.length; s++) {
      const sub = subs[s]

      const isOwned = (sub.user_id === user.id)

      // we only need to worry about syncing subscriptions owned by us (no idea how this would actually proc, but ya know).
      if (!isOwned) continue

      const pushedCharacterRef = chars.find(c => {
        const isCorrectSub = (c.system.version_id === sub.version_id && c.system.local_id === sub.resource_id)
        const isSynced = synced.includes(c.local_id)
        
        return (isCorrectSub && isSynced)
      })

      if (pushedCharacterRef) {
        sysToPush.push(sub.resource_id)
        versToPush.push(sub.version_id)
      }

      const isSynced = (!!sub.id)

      // if a character we're syncing relies on this version we need to sync it too.
      const isReferencedByChar = (pushedCharacterRef !== undefined)

      const wasUpdated = updatedSubs.includes(sub.local_id)

      // if we're referenced by a character and not synced this subscription needs to sync.
      if (!isSynced && isReferencedByChar) {
        subsToPush.push(sub.local_id)
      }

      // if we're not synced and premium this should be pushed anyways.
      if (!sub.id && isPremium) {
        subsToPush.push(sub.local_id)
      }

      // and lastly, if this record was updated it should and we're premium it should be synced.
      if (wasUpdated && isPremium) {
        subsToPush.push(sub.local_id)
      }
    }

    for (let i = 0; i < collectionsToSync.length; i++) {
      const coll = collectionsToSync[i]

      // await handlePullUpdates(coll.bulkPut, coll.pull, await coll.get())

      // await handlePushingUpdates(coll.bulkPut, coll.push, await coll.get())
    }
  } catch (e) {
    addToast(`Error occured while syncing. ${e}`, 'error')
    return console.error(`Error occured while syncing. ${e}`)
  }

  // TODO: setup websocket connection for real-time updates.
}

window.addEventListener('online', async () => {
  console.log('online')

  const isOnline = await checkInternetAccess()

  setOnlineState(isOnline)

  if (!isOnline) {
    return console.log('not connected')
  }

  // once we come back online we need to run a sync.
  sync()
})

window.addEventListener('offline', () => {
  console.log('offline')

  setOnlineState(false)

  // TODO: not sure what to do here yet. Maybe just cancel the websocket connection?
})