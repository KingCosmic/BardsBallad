import { jwtDecode } from 'jwt-decode'
import { pullUpdatesForVersions, pushUpdatesForVersions } from '../lib/api'
import { AuthStorage, SyncStorage } from '../lib/storage'
import { db } from '../storage'
import { VersionedResource } from '../storage/schemas/versionedResource'

const CHECKPOINT = 'version-checkpoint'

export const pull = async () => {
  const cp = await SyncStorage.get<any>(CHECKPOINT)

  console.log('pulling versions')

  const { checkpoint, documents } = await pullUpdatesForVersions(cp, 20)

  await SyncStorage.set(CHECKPOINT, checkpoint)

  return documents
}

export const push = async (): Promise<{ conflicts: any[], metadata: any[] }> => {
  const versions = await db.versions.toArray()
  const characters = await db.characters.toArray()

  const user = jwtDecode<{ id: String, role: number }>(await AuthStorage.get('token'))
  
  if (!user) return { conflicts: [], metadata: [] }

  const synced = await SyncStorage.get<string[]>('synced_characters') || []
  
  const isPremium = user.role > 0

  const versionsToPush = versions.filter(v => {
    const isOwned = (v.user_id === user.id)

    // we only need to worry about syncing versions owned by us.
    if (!isOwned) return false

    const pushedCharacterRef = characters.find(c => c.system.version_id === v.local_id && synced.includes)

    // if a character we're syncing relies on this version we need to sync it too.
    const referencedByChar = (pushedCharacterRef !== undefined)

    // if this version hasn't been synced and we're a premium user it should be synced.
    const notSyncedAndPremium = (!v.id && isPremium)

    return (referencedByChar || notSyncedAndPremium)
  })

  return await pushUpdatesForVersions(versionsToPush)
}

export const bulkPut = async (docs: VersionedResource[]) => db.versions.bulkPut(docs)

export const get = async () => await db.versions.toArray()