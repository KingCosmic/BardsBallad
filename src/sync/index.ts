import { openModal } from '@/state/modals'
import { createElement } from 'react'
import { authState } from '@/state/auth'
import { setOnlineState, syncState } from '@/state/sync'
import { checkInternetAccess } from '@/lib/api/misc/checkInternetAccess'
import { setSyncedCharacters } from '@/lib/api/characters/setSyncedCharacters'
import HandleConflicts from '@/modals/sync/handle-conflicts'
import { db } from '@/db'
import storeHashes from '@/db/typeHashes/methods/storeHashes'
import generateTypeHash from '@/db/typeHashes/methods/generateTypeHash'
import { pullUpdatesForCharacters } from '@/lib/api/characters/pullUpdatesForCharacters'
import { pushUpdatesForCharacters } from '@/lib/api/characters/pushUpdatesForCharacters'
import { pullUpdatesForSystems } from '@/lib/api/pullUpdatesForSystems'
import { pushUpdatesForSystems } from '@/lib/api/pushUpdatesForSystems'
import { pullUpdatesForVersions } from '@/lib/api/pullUpdatesForVersions'
import { pushUpdatesForVersions } from '@/lib/api/pushUpdatesForVersions'
import { pullUpdatesForSubscriptions } from '@/lib/api/pullUpdatesForSubscriptions'
import { pushUpdatesForSubscriptions } from '@/lib/api/pushUpdatesForSubscriptions'
import Roles from '@/constants/roles'
import { hasRole } from '@/utils/roles/hasRole'
import { jwtDecode } from 'jwt-decode'

const batchSize = 10

interface Checkpoint {
  updated_at: number
  id: string
}

type UserInfo = {
  id: string
  role: number
  synced_characters?: string[]
}

const getCheckpoint = (key: string): Checkpoint | null => {
  const stored = localStorage.getItem(key)
  return stored ? JSON.parse(stored) : null
}

const setCheckpoint = (key: string, checkpoint: { id: number, updated_at: string }) => {
  const storedCheckpoint: Checkpoint = {
    updated_at: new Date(checkpoint.updated_at).getTime(),
    id: checkpoint.id.toString()
  }
  localStorage.setItem(key, JSON.stringify(storedCheckpoint))
}

const getUserInfo = (): UserInfo | null => {
  const token = localStorage.getItem('token')
  if (!token) return null
  
  try {
    return jwtDecode<UserInfo>(token)
  } catch {
    return null
  }
}

type CollectionConfig = {
  name: string
  coll: any
  checkpointKey: string
  pullFn: (checkpoint: Checkpoint | null, batchSize: number) => Promise<{ checkpoint: any, documents: any[] }>
  pushFn: (items: any[]) => Promise<{ conflicts: any[], metadata: any[] }>
}

const collectionsToSync: CollectionConfig[] = [
  {
    name: 'Subscriptions',
    coll: db.subscriptions,
    checkpointKey: 'subscription-checkpoint',
    pullFn: pullUpdatesForSubscriptions,
    pushFn: pushUpdatesForSubscriptions
  },
  {
    name: 'Systems',
    coll: db.systems,
    checkpointKey: 'system-checkpoint',
    pullFn: pullUpdatesForSystems,
    pushFn: pushUpdatesForSystems
  },
  {
    name: 'Versions',
    coll: db.versions,
    checkpointKey: 'version-checkpoint',
    pullFn: pullUpdatesForVersions,
    pushFn: pushUpdatesForVersions
  },
  {
    name: 'Characters',
    coll: db.characters,
    checkpointKey: 'character-checkpoint',
    pullFn: pullUpdatesForCharacters,
    pushFn: pushUpdatesForCharacters
  }
]

// this checks if the user has internet / the server is reachable.
// this is better than the navigator value since it checks if the server is reachable.
checkInternetAccess().then(setOnlineState)

async function handleConflicts(conflicts: { local: any, remote: any }[]): Promise<any[]> {
  if (conflicts.length === 0) return []

  return new Promise(resolve => {
    openModal('handle-conflicts', ({ id }) => createElement(HandleConflicts, { id, data: conflicts, onSave: resolve }))
  })
}

type LocalDocumentMap = Map<string, any>

async function handlePullUpdates(
  collection: CollectionConfig,
  localDocuments: LocalDocumentMap
) {
  let pullUpdates = true
  
  while (pullUpdates) {
    const checkpoint = getCheckpoint(collection.checkpointKey)
    const { checkpoint: newCheckpoint, documents } = await collection.pullFn(checkpoint, batchSize)

    setCheckpoint(collection.checkpointKey, newCheckpoint)

    if (documents.length < batchSize) {
      pullUpdates = false
    }

    const pullConflicts = documents.flatMap(doc => {
      const localDocument = localDocuments.get(doc.local_id)

      if (!localDocument) return []

      const local = new Date(localDocument.updated_at).getTime()
      const remote = new Date(doc.updated_at).getTime()

      const versionsDontMatch = (localDocument.version !== doc.version)
      const wasUpdatedLocally = (local >= remote)

      return (versionsDontMatch && wasUpdatedLocally) ? { local: localDocument, remote: doc } : []
    })

    const chosen = await handleConflicts(pullConflicts)

    const newDocs = documents.map(d => (chosen.find(c => c.local_id === d.local_id) || d))

    await collection.coll.bulkPut(newDocs)
    
    // Update local document map with newly pulled documents
    newDocs.forEach(doc => localDocuments.set(doc.local_id, doc))
  }
}

async function handlePushingUpdates(
  collection: CollectionConfig,
  itemsToPush: any[],
  localDocuments: LocalDocumentMap
) {
  if (itemsToPush.length === 0) return

  let pushUpdates = true
  
  while (pushUpdates) {
    const { conflicts, metadata } = await collection.pushFn(itemsToPush)

    // we need to combine our metadata with our local documents (version hash updates, server id generation, etc.)
    const updatedDocs = metadata.map(data => {
      const localDoc = localDocuments.get(data.local_id)

      return {
        ...localDoc,
        ...data
      }
    })

    // store our updated docs.
    await collection.coll.bulkPut(updatedDocs)
    
    // Update local document map
    updatedDocs.forEach(doc => localDocuments.set(doc.local_id, doc))

    if (conflicts.length === 0) {
      pushUpdates = false
      return
    }

    const pushConflicts = conflicts.flatMap(doc => {
      const localDocument = localDocuments.get(doc.local_id)

      if (!localDocument) return []

      return { local: localDocument, remote: doc }
    })

    const chosen = await handleConflicts(pushConflicts)

    await collection.coll.bulkPut(chosen)
    
    // Update local document map with chosen resolutions
    chosen.forEach(doc => localDocuments.set(doc.local_id, doc))
  }
}

async function syncCollection(
  collection: CollectionConfig,
  itemsToPush: any[],
  localDocuments: LocalDocumentMap
) {
  await handlePullUpdates(collection, localDocuments)
  await handlePushingUpdates(collection, itemsToPush, localDocuments)
}

export const sync = async () => {
  const { isOnline } = syncState.get()
  const { isLoggedIn } = authState.get()

  if (!isOnline || !isLoggedIn) return

  // Get user info
  const user = getUserInfo()
  if (!user) return

  const isPremium = hasRole(user.role, Roles.PREMIUM)
  const syncedCharacterIds = user.synced_characters || []

  // Update synced characters array on server
  await setSyncedCharacters(syncedCharacterIds)

  // Precompute: Load all local documents once at the beginning
  const [subscriptions, systems, versions, characters] = await Promise.all([
    db.subscriptions.toArray(),
    db.systems.toArray(),
    db.versions.toArray(),
    db.characters.toArray()
  ])

  // Create local document maps for efficient lookups during sync
  const localDocumentMaps = {
    Subscriptions: new Map(subscriptions.map(doc => [doc.local_id, doc])),
    Systems: new Map(systems.map(doc => [doc.local_id, doc])),
    Versions: new Map(versions.map(doc => [doc.local_id, doc])),
    Characters: new Map(characters.map(doc => [doc.local_id, doc]))
  }

  // Precompute what needs to be synced for each collection
  const checkpoints = {
    subscriptions: getCheckpoint('subscription-checkpoint'),
    systems: getCheckpoint('system-checkpoint'),
    versions: getCheckpoint('version-checkpoint'),
    characters: getCheckpoint('character-checkpoint')
  }

  // Filter items to push based on premium status and sync rules
  const itemsToPush = {
    Subscriptions: subscriptions.filter(item => {
      if (item.user_id !== user.id) return false
      
      const checkpoint = checkpoints.subscriptions
      if (checkpoint) {
        const itemUpdatedAt = new Date(item.updated_at).getTime()
        if (itemUpdatedAt <= checkpoint.updated_at) return false
      }

      if (isPremium) return true

      // Free users: only sync subscriptions related to synced characters
      return characters.some(c => {
        const isCorrectSub = (c.system.version_id === item.version_id && c.system.local_id === item.resource_id)
        return isCorrectSub && syncedCharacterIds.includes(c.local_id)
      })
    }),

    Systems: systems.filter(item => {
      if (item.user_id !== user.id) return false

      const checkpoint = checkpoints.systems
      if (checkpoint) {
        const itemUpdatedAt = new Date(item.updated_at).getTime()
        if (itemUpdatedAt <= checkpoint.updated_at) return false
      }

      if (isPremium) return true

      // Free users: only sync systems related to synced characters
      return characters.some(c => 
        c.system.local_id === item.local_id && syncedCharacterIds.includes(c.local_id)
      )
    }),

    Versions: versions.filter(item => {
      if (item.user_id !== user.id) return false

      const checkpoint = checkpoints.versions
      if (checkpoint) {
        const itemUpdatedAt = new Date(item.updated_at).getTime()
        if (itemUpdatedAt <= checkpoint.updated_at) return false
      }

      if (isPremium) return true

      // Free users: only sync versions related to synced characters
      return characters.some(c => 
        c.system.version_id === item.local_id && syncedCharacterIds.includes(c.local_id)
      )
    }),

    Characters: characters.filter(item => {
      const checkpoint = checkpoints.characters
      if (checkpoint) {
        const itemUpdatedAt = new Date(item.updated_at).getTime()
        if (itemUpdatedAt <= checkpoint.updated_at) return false
      }

      if (isPremium) return true

      // Free users: only sync explicitly marked characters
      return syncedCharacterIds.includes(item.local_id)
    })
  }

  // Sync all collections sequentially (important for dependency order)
  for (const collection of collectionsToSync) {
    await syncCollection(
      collection,
      itemsToPush[collection.name as keyof typeof itemsToPush],
      localDocumentMaps[collection.name as keyof typeof localDocumentMaps]
    )
  }

  // Generate type hashes for versions
  versions.forEach(vers => {
    storeHashes(vers.local_id, (vers.data as any).types.map(generateTypeHash))
  })
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
