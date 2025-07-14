import { jwtDecode } from 'jwt-decode'
import { AuthStorage, SyncStorage } from '@lib/storage'
import { db, Item } from '@/storage'
import {pushUpdatesForSystems} from "@api/pushUpdatesForSystems";
import {pullUpdatesForSystems} from "@api/pullUpdatesForSystems";
import Roles from '@/const/roles';
import { hasRole } from '@utils/roles/hasRole';

const CHECKPOINT = 'system-checkpoint'

export const pull = async () => {
  const cp = await SyncStorage.get<any>(CHECKPOINT)

  const { checkpoint, documents } = await pullUpdatesForSystems(cp, 20)

  await SyncStorage.set(CHECKPOINT, checkpoint)

  return documents
}

export const push = async (): Promise<{ conflicts: any[], metadata: any[] }> => {
  const systems = await db.systems.toArray()
  const characters = await db.characters.toArray()

  const user = jwtDecode<{ id: String, role: number }>(await AuthStorage.get('token'))
  
  if (!user) return { conflicts: [], metadata: [] }

  const synced = await SyncStorage.get<string[]>('synced_characters') || []
  
  const isPremium = hasRole(user.role, Roles.PREMIUM)

  const systemsToPush = systems.filter(s => {
    const isOwned = (s.user_id === user.id)

    // we only need to worry about syncing systems owned by us.
    if (!isOwned) return false

    const pushedCharacterRef = characters.find(c => c.system.local_id === s.local_id && synced.includes(c.local_id))

    // if a character we're syncing relies on this system we need to sync it too.
    const referencedByChar = (pushedCharacterRef !== undefined)

    // if this system hasn't been synced and we're a premium user it should be synced.
    const notSyncedAndPremium = (!s.id && isPremium)

    return (referencedByChar || notSyncedAndPremium)
  })

  return await pushUpdatesForSystems(systemsToPush)
}

export const bulkPut = (docs: Item[]) => db.systems.bulkPut(docs)

export const get = () => db.systems.toArray()

