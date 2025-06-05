import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/storage'
import { authState } from '@state/auth'

export function useOurSystems() {
  const systems = useLiveQuery(() => db.systems.toArray(), [])

  const { user } = authState.useValue()

  const user_id = user ? user.id : 'none'

  // filter out deleted systems and systems not owned by us
  const filteredSystems = systems?.filter(sys => {
    const wasDeleted = sys.deleted_at
    const doWeOwnIt = (sys.user_id === user_id)

    return (!wasDeleted && doWeOwnIt)
  })

  return { systems: filteredSystems || [], isLoading: (systems === undefined) }
}

