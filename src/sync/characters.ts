import Roles from '@/constants/roles'
import { db } from '@/db'
import { Character } from '@/db/character/schema'
import { pullUpdatesForCharacters } from '@/lib/api/characters/pullUpdatesForCharacters'
import { pushUpdatesForCharacters } from '@/lib/api/characters/pushUpdatesForCharacters'
import { hasRole } from '@/utils/roles/hasRole'
import { jwtDecode } from 'jwt-decode'

const CHECKPOINT_KEY = 'character-checkpoint'

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

  const { checkpoint, documents } = await pullUpdatesForCharacters(cp, 20)

  setCheckpoint(checkpoint)

  return documents
}

export const push = async (): Promise<{ conflicts: any[], metadata: any[] }> => {
  const characters = await db.characters.toArray()

  const token = getToken()

  if (!token) return { conflicts: [], metadata: [] }

  const user = jwtDecode<{ id: string, role: number, synced_characters?: string[] }>(token)

  if (!user) return { conflicts: [], metadata: [] }

  const isPremium = hasRole(user.role, Roles.PREMIUM)
  const synced = user.synced_characters || []
  const cp = getCheckpoint()

  const localCharactersToPush = characters.filter(c => {
    const isSynced = synced.includes(c.local_id)
    
    // If no checkpoint exists, push all characters (based on premium/synced rules)
    if (!cp) {
      return isPremium || isSynced
    }

    // Check if character was updated after last checkpoint
    const characterUpdatedAt = new Date(c.updated_at).getTime()
    const isUpdatedSinceCheckpoint = characterUpdatedAt > cp.updated_at

    // Premium users can push all updated characters
    if (isPremium && isUpdatedSinceCheckpoint) return true

    // Free users can only push synced characters that were updated
    return isSynced && isUpdatedSinceCheckpoint
  })

  return await pushUpdatesForCharacters(localCharactersToPush)
}

export const bulkPut = (docs: Character[]) => db.characters.bulkPut(docs)

export const get = () => db.characters.toArray()
