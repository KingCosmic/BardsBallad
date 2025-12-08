import Roles from '@/constants/roles'
import { db } from '@/db'
import { Subscription } from '@/db/subscription/schema'
import { pullUpdatesForSubscriptions } from '@/lib/api/pullUpdatesForSubscriptions'
import { pushUpdatesForSubscriptions } from '@/lib/api/pushUpdatesForSubscriptions'
import { hasRole } from '@/utils/roles/hasRole'
import { jwtDecode } from 'jwt-decode'

const CHECKPOINT_KEY = 'subscription-checkpoint'

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

  const { checkpoint, documents } = await pullUpdatesForSubscriptions(cp, 20)

  setCheckpoint(checkpoint)

  return documents
}

export const push = async (): Promise<{ conflicts: any[], metadata: any[] }> => {
  const subscriptions = await db.subscriptions.toArray()
  const characters = await db.characters.toArray()

  const token = getToken()
  
  if (!token) return { conflicts: [], metadata: [] }

  const user = jwtDecode<{ id: string, role: number, synced_characters?: string[] }>(token)
  
  if (!user) return { conflicts: [], metadata: [] }

  const synced = user.synced_characters || []
  const cp = getCheckpoint()
  
  const isPremium = hasRole(user.role, Roles.PREMIUM)

  const subscriptionsToPush = subscriptions.filter(v => {
    const isOwned = (v.user_id === user.id)

    // we only need to worry about syncing subscriptions owned by us
    if (!isOwned) return false

    // If no checkpoint exists, use different logic
    if (!cp) {
      // Premium users: push all subscriptions
      if (isPremium) return true

      // Free users: only push subscriptions attached to synced characters
      const referencedBySyncedChar = characters.some(c => {
        const isCorrectSub = (c.system.version_id === v.version_id && c.system.local_id === v.resource_id)
        const isSynced = synced.includes(c.local_id)
        
        return (isCorrectSub && isSynced)
      })

      return referencedBySyncedChar
    }

    // Check if subscription was updated after last checkpoint
    const subscriptionUpdatedAt = new Date(v.updated_at).getTime()
    const isUpdatedSinceCheckpoint = subscriptionUpdatedAt > cp.updated_at

    if (!isUpdatedSinceCheckpoint) return false

    // Premium users: push all updated subscriptions
    if (isPremium) return true

    // Free users: only push updated subscriptions attached to synced characters
    const referencedBySyncedChar = characters.some(c => {
      const isCorrectSub = (c.system.version_id === v.version_id && c.system.local_id === v.resource_id)
      const isSynced = synced.includes(c.local_id)
      
      return (isCorrectSub && isSynced)
    })

    return referencedBySyncedChar
  })

  return await pushUpdatesForSubscriptions(subscriptionsToPush)
}

export const bulkPut = (docs: Subscription[]) => db.subscriptions.bulkPut(docs)

export const get = () => db.subscriptions.toArray()
