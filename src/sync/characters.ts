import { jwtDecode } from 'jwt-decode'
import { AuthStorage, SyncStorage } from '@lib/storage'
import { db } from '@/storage'
import { Character } from '@storage/schemas/character'
import {pullUpdatesForCharacters} from "@api/pullUpdatesForCharacters";
import {pushUpdatesForCharacters} from "@api/pushUpdatesForCharacters";
import { hasRole } from '@utils/roles/hasRole';
import Roles from '@/const/roles';

const CHECKPOINT = 'character-checkpoint'

export const pull = async () => {
  const cp = await SyncStorage.get<any>(CHECKPOINT)

  const { checkpoint, documents } = await pullUpdatesForCharacters(cp, 20)

  await SyncStorage.set(CHECKPOINT, checkpoint)

  return documents
}

export const push = async (): Promise<{ conflicts: any[], metadata: any[] }> => {
  const characters = await db.characters.toArray()

  const user = jwtDecode<{ id: String, role: number }>(await AuthStorage.get('token'))

  if (!user) return { conflicts: [], metadata: [] }

  const isPremium = hasRole(user.role, Roles.PREMIUM)

  const updatedCharacters = await SyncStorage.get<string[]>('updated_characters') || []
  const synced = await SyncStorage.get<string[]>('synced_characters') || []

  const localCharactersToPush = characters.filter(c => {
    const isSynced = synced.includes(c.local_id)
    const isUpdated = updatedCharacters.includes(c.local_id)

    // premium users can push all characters.
    if (isPremium && isUpdated) return true

    // free users can only push synced characters.
    return isSynced && isUpdated;
  })

  return await pushUpdatesForCharacters(localCharactersToPush)
}

export const bulkPut = (docs: Character[]) => db.characters.bulkPut(docs)

export const get = () => db.characters.toArray()
