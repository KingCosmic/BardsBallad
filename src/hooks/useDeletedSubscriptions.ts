import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/storage'
import olderThanDays from '@utils/olderThanDays'

export function useDeletedSubscriptions() {
  const subscriptions = useLiveQuery(() => db.subscriptions.toArray(), [])

  const filteredSubscriptions = subscriptions?.filter(sub => sub.deleted_at && !olderThanDays(sub.deleted_at, 10))

  return { subscriptions: filteredSubscriptions || [], isLoading: (subscriptions === undefined) }
}

