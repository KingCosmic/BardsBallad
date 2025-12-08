import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'
import olderThanDays from '@/utils/dates/olderThanDays'

export function useDeletedSubscriptions() {
  const subscriptions = useLiveQuery(() => db.subscriptions.toArray(), [])

  const filteredSubscriptions = subscriptions?.filter(sub => sub.deleted_at && !olderThanDays(sub.deleted_at, 10))

  return { subscriptions: filteredSubscriptions || [], isLoading: (subscriptions === undefined) }
}