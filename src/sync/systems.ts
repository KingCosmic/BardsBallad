import Roles from '@/constants/roles'
import { db, Item } from '@/db'
import { pullUpdatesForSystems } from '@/lib/api/pullUpdatesForSystems'
import { pushUpdatesForSystems } from '@/lib/api/pushUpdatesForSystems'
import { hasRole } from '@/utils/roles/hasRole'
import { jwtDecode } from 'jwt-decode'

const CHECKPOINT_KEY = 'system-checkpoint'

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

  const { checkpoint, documents } = await pullUpdatesForSystems(cp, 20)

  setCheckpoint(checkpoint)

  return documents
}

export const push = async (): Promise<{ conflicts: any[], metadata: any[] }> => {
  const systems = await db.systems.toArray()
  const characters = await db.characters.toArray()

  const token = getToken()
  
  if (!token) return { conflicts: [], metadata: [] }

  const user = jwtDecode<{ id: string, role: number, synced_characters?: string[] }>(token)
  
  if (!user) return { conflicts: [], metadata: [] }

  const synced = user.synced_characters || []
  const cp = getCheckpoint()
  
  const isPremium = hasRole(user.role, Roles.PREMIUM)

  const systemsToPush = systems.filter(s => {
    const isOwned = (s.user_id === user.id)

    // we only need to worry about syncing systems owned by us
    if (!isOwned) return false

    // If no checkpoint exists, use different logic
    if (!cp) {
      // Premium users: push all systems
      if (isPremium) return true

      // Free users: only push systems attached to synced characters
      const referencedBySyncedChar = characters.some(c => 
        c.system.local_id === s.local_id && synced.includes(c.local_id)
      )

      return referencedBySyncedChar
    }

    // Check if system was updated after last checkpoint
    const systemUpdatedAt = new Date(s.updated_at).getTime()
    const isUpdatedSinceCheckpoint = systemUpdatedAt > cp.updated_at

    if (!isUpdatedSinceCheckpoint) return false

    // Premium users: push all updated systems
    if (isPremium) return true

    // Free users: only push updated systems attached to synced characters
    const referencedBySyncedChar = characters.some(c => 
      c.system.local_id === s.local_id && synced.includes(c.local_id)
    )

    return referencedBySyncedChar
  })

  return await pushUpdatesForSystems(systemsToPush)
}

export const bulkPut = (docs: Item[]) => db.systems.bulkPut(docs)

export const get = () => db.systems.toArray()
