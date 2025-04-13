import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../newstorage'

export function useSystems() {
  const systems = useLiveQuery(async () => {
      const sys = await db.systems.toArray()
  
      // filter out deleted characters
      return sys.filter(sys => !sys.isDeleted)
    }, [])
  
    return { systems: systems || [], isLoading: (systems === undefined) }
} 