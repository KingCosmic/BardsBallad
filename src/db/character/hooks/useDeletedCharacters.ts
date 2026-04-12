import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'
import olderThanDays from '@/utils/dates/olderThanDays'

export function useDeletedCharacters() {
  const characters = useLiveQuery(
    () => db.docs.filter(doc =>
      doc.type === 'character' &&
      doc.doc !== undefined &&
      doc.shadow.deleted_at &&
      !olderThanDays(doc.shadow.deleted_at, 10)
    ).sortBy('shadow.deleted_at'),
    []
  )

  return { characters: characters || [], isLoading: (characters === undefined) }
}