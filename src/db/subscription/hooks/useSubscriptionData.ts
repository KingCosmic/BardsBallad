import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'
import { type Subscription } from '@/db/subscription/schema'

export function useSubscriptionData(sub: Subscription) {
  const query = useLiveQuery(() => db.docs.get(sub.local_id), [])

  return { query, isLoading: (query === undefined) }
}