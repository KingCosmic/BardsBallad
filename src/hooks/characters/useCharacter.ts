import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'

export function useCharacter(characterId: string | undefined) {
  const character = useLiveQuery(() => db.characters.get(characterId || ''), [characterId])

  return character
}