import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'
import isObjectEmpty from '@/utils/object/isObjectEmpty'
import olderThanDays from '@/utils/dates/olderThanDays'

export function useDeletedCharacters() {
  const characters = useLiveQuery(async () => {
    const chars = await db.characters.toArray()

    // filter out fully cleared characters
    const filteredChars = chars.filter(char => char.deleted_at && !isObjectEmpty(char.data) && !olderThanDays(char.deleted_at, 10))
    
    filteredChars.sort((a, b) => {
      if (!a || !b) return 0

      const aTime = new Date(a.deleted_at!)
      const bTime= new Date(b.deleted_at!)

      return (aTime > bTime) ? -1 : 1
    })

    return filteredChars
  }, [])

  return { characters: characters || [], isLoading: (characters === undefined) }
}