import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/storage'

export function useVersions() {
  const query = useLiveQuery(async () => {
    const versions = await db.versions.toArray()

    // filter out versions
    return versions.filter(vers => {
      const wasDeleted = vers.deleted_at
      const isEdits = vers.local_id.split('|')[1] !== undefined

      return (!wasDeleted && !isEdits)
    })
  }, [])

  return { versions: query || [], isLoading: (query === undefined) }
}
