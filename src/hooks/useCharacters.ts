import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../storage'

export function useCharacters() {
  const characters = useLiveQuery(async () => {
    const chars = await db.characters.toArray()

    // filter out deleted characters
    return chars.filter(char => !char.isDeleted)
  }, [])

  return { characters: characters || [], isLoading: (characters === undefined) }
}