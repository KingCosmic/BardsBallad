import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'

export function useSystems() {
  const systems = useLiveQuery(async () => {
    const sys = await db.docs.toArray()

    // filter out deleted characters
    return sys
  }, [])

  return { systems: systems || [], isLoading: (systems === undefined) }
}