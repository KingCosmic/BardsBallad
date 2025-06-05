import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/storage'

export function useSystems() {
  const systems = useLiveQuery(async () => {
    const sys = await db.systems.toArray()

    // filter out deleted characters
    return sys.filter(sys => !sys.deleted_at)
  }, [])

  return { systems: systems || [], isLoading: (systems === undefined) }
}
