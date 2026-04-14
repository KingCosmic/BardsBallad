import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'

export function useCharacter(characterId: string) {
  const c = useLiveQuery(() => db.docs.get(characterId), [characterId])

  return c
}