import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'

export function useCharacters() {
  const characters = useLiveQuery(
    () => db.docs.filter(doc => doc.type === 'character'),
    []
  )

  return { characters: characters || [], isLoading: (characters === undefined) }
}
