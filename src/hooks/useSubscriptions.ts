import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/storage'

export function useSubscriptions() {
  const subscriptions = useLiveQuery(async () => {
    const subs = await db.subscriptions.toArray()

    // filter out deleted characters
    return subs.filter(sub => !sub.deleted_at)
  }, [])

  return { subscriptions: subscriptions || [], isLoading: (subscriptions === undefined) }
}
