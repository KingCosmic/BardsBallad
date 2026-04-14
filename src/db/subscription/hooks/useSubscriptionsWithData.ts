import { db } from '@/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { Item, SubType } from '@/db/shared/schema'

export interface Grouped {
  local_id: string
  type: SubType
  item: Item
  sub: Item
  hashes: { [local_id: string]: { name: string, hash: string }[] }
}

const useSubscriptionsWithData = (filters: SubType[] = []): { subscriptions: Grouped[], isLoading: boolean } => {
  const subscriptions = useLiveQuery(async () => {
    let subData: Grouped[] = []

    const subs = await db.docs.filter(doc =>
      doc.type === 'subscription' &&
      !doc.deleted_at &&
      !filters.includes(doc.shadow.resource_type)
    ).toArray()

    for (let i = 0; i < subs.length; i++) {
      const item = await db.docs.get(subs[i].shadow.resource_id)

      if (!item) continue

      subData.push({
        local_id: item.local_id,
        type: item.type,
        item,
        sub: subs[i],
        hashes: {}
      })
    }

    return subData
  },[])

  return { subscriptions: subscriptions ?? [], isLoading: subscriptions === undefined }
}

export default useSubscriptionsWithData