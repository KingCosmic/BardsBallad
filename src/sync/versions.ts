import Roles from '@/constants/roles'
import { db } from '@/db'
import { VersionedResource } from '@/db/version/schema'
import { pullUpdatesForVersions } from '@/lib/api/pullUpdatesForVersions'
import { pushUpdatesForVersions } from '@/lib/api/pushUpdatesForVersions'
import { hasRole } from '@/utils/roles/hasRole'
import { jwtDecode } from 'jwt-decode'

const CHECKPOINT_KEY = 'version-checkpoint'

interface Checkpoint {
  updated_at: number
  id: string
}

const getCheckpoint = (): Checkpoint | null => {
  const stored = localStorage.getItem(CHECKPOINT_KEY)
  return stored ? JSON.parse(stored) : null
}

const setCheckpoint = (checkpoint: { id: number, updated_at: string }) => {
  // Convert the API checkpoint format to our storage format
  const storedCheckpoint: Checkpoint = {
    updated_at: new Date(checkpoint.updated_at).getTime(),
    id: checkpoint.id.toString()
  }
  localStorage.setItem(CHECKPOINT_KEY, JSON.stringify(storedCheckpoint))
}

const getToken = (): string | null => {
  return localStorage.getItem('token')
}

export const pull = async () => {
  const cp = getCheckpoint()

  const { checkpoint, documents } = await pullUpdatesForVersions(cp, 20)

  setCheckpoint(checkpoint)

  return documents
}

export const push = async (): Promise<{ conflicts: any[], metadata: any[] }> => {
  const versions = await db.versions.toArray()
  const characters = await db.characters.toArray()

  const token = getToken()
  
  if (!token) return { conflicts: [], metadata: [] }

  const user = jwtDecode<{ id: string, role: number, synced_characters?: string[] }>(token)
  
  if (!user) return { conflicts: [], metadata: [] }

  const synced = user.synced_characters || []
  const cp = getCheckpoint()
  
  const isPremium = hasRole(user.role, Roles.PREMIUM)

  const versionsToPush = versions.filter(v => {
    const isOwned = (v.user_id === user.id)

    // we only need to worry about syncing versions owned by us
    if (!isOwned) return false

    // If no checkpoint exists, use different logic
    if (!cp) {
      // Premium users: push all versions
      if (isPremium) return true

      // Free users: only push versions attached to synced characters
      const referencedBySyncedChar = characters.some(c => 
        c.system.version_id === v.local_id && synced.includes(c.local_id)
      )

      return referencedBySyncedChar
    }

    // Check if version was updated after last checkpoint
    const versionUpdatedAt = new Date(v.updated_at).getTime()
    const isUpdatedSinceCheckpoint = versionUpdatedAt > cp.updated_at

    if (!isUpdatedSinceCheckpoint) return false

    // Premium users: push all updated versions
    if (isPremium) return true

    // Free users: only push updated versions attached to synced characters
    const referencedBySyncedChar = characters.some(c => 
      c.system.version_id === v.local_id && synced.includes(c.local_id)
    )

    return referencedBySyncedChar
  })

  return await pushUpdatesForVersions(versionsToPush)
}

export const bulkPut = (docs: VersionedResource[]) => db.versions.bulkPut(docs)

export const get = () => db.versions.toArray()

