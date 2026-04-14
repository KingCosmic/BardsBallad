import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'
import olderThanDays from '@/utils/dates/olderThanDays'

export function useDeletedSubscriptions() {
  const subs = useLiveQuery(() => db.docs.filter(
    doc => doc.type === 'subscription' &&
    doc.shadow.deleted_at &&
    !olderThanDays(doc.shadow.deleted_at, 10)
  ).toArray(), [])

  return { subscriptions: subs || [], isLoading: (subs === undefined) }
}