import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'

export function useSubscriptions() {
  const subscriptions = useLiveQuery(() => db.docs.filter(doc => doc.type === 'subscription' && !doc.shadow.deleted_at).toArray(), [])

  return { subscriptions: subscriptions || [], isLoading: (subscriptions === undefined) }
}