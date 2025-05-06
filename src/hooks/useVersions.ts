import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../storage'

export function useVersions() {
  const versions = useLiveQuery(async () => {
    const versions = await db.versions.toArray()

    // filter out versions
    return versions.filter(vers => (!vers.deleted_at) && (!vers.local_id.split('|')[1]))
  }, [])

  return { versions: versions || [], isLoading: (versions === undefined) }
}