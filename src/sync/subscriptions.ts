import { jwtDecode } from 'jwt-decode'
import { AuthStorage, SyncStorage } from '@lib/storage'
import { db } from '@/storage'
import { UserSubscription } from '@storage/schemas/userSubscription'
import {pushUpdatesForSubscriptions} from "@api/pushUpdatesForSubscriptions";
import {pullUpdatesForSubscriptions} from "@api/pullUpdatesForSubscriptions";

const CHECKPOINT = 'subscription-checkpoint'

export const pull = async () => {
  const cp = await SyncStorage.get<any>(CHECKPOINT)

  console.log('pulling subscriptions')

  const { checkpoint, documents } = await pullUpdatesForSubscriptions(cp, 20)

  await SyncStorage.set(CHECKPOINT, checkpoint)

  return documents
}

export const push = async (): Promise<{ conflicts: any[], metadata: any[] }> => {
  const subscriptions = await db.subscriptions.toArray()
  const characters = await db.characters.toArray()

  const user = jwtDecode<{ id: String, role: number }>(await AuthStorage.get('token'))
  
  if (!user) return { conflicts: [], metadata: [] }

  const synced = await SyncStorage.get<string[]>('synced_characters') || []
  
  const isPremium = user.role > 0

  const subscriptionsToPush = subscriptions.filter(v => {
    const isOwned = (v.user_id === user.id)

    // we only need to worry about syncing subscriptions owned by us (no idea how this would actually proc, but ya know).
    if (!isOwned) return false

    const pushedCharacterRef = characters.find(c => {
      const isCorrectSub = (c.system.version_id === v.version_id && c.system.local_id === v.resource_id)
      const isSynced = synced.includes(c.local_id)
      
      return (isCorrectSub && isSynced)
    })

    // if a character we're syncing relies on this version we need to sync it too.
    const referencedByChar = (pushedCharacterRef !== undefined)

    // if this version hasn't been synced and we're a premium user it should be synced.
    const notSyncedAndPremium = (!v.id && isPremium)

    return (referencedByChar || notSyncedAndPremium)
  })

  return await pushUpdatesForSubscriptions(subscriptionsToPush)
}

export const bulkPut = async (docs: UserSubscription[]) => db.subscriptions.bulkPut(docs)

export const get = async () => await db.subscriptions.toArray()

