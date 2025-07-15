import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/storage'
import { authState } from '@state/auth'

export function useOurSystems() {
  const systems = useLiveQuery(() => db.systems.toArray(), [])

  const { user } = authState.useValue()

  const user_id = user ? user.id : 'none'

  // filter out deleted systems and systems not owned by us
  const filteredSystems = systems?.filter(sys => {
    const doWeOwnIt = (sys.user_id === user_id)

    return doWeOwnIt
  })

  return { systems: filteredSystems || [], isLoading: (systems === undefined) }
}

