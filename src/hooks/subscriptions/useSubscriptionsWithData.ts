import { db, Item } from '@/db'
import getVersionedResource from '@/db/version/methods/getVersionedResource'
import { Subscription } from '@/db/subscription/schema'
import { VersionedResource } from '@/db/version/schema'
import getItem from '@/db/shared/methods/getItem'
import { useLiveQuery } from 'dexie-react-hooks'

export interface Grouped {
  item_id: string,
  item: Item,
  type: 'system' | 'theme' | 'datapack',
  versions: VersionedResource[],
  subscriptions: Subscription[],
  hashes: { [local_id: string]: { name: string, hash: string }[] }
}

const useSubscriptionsWithData = (filters: ('system' | 'theme' | 'datapack')[] = []): { subscriptions: Grouped[], isLoading: boolean } => {
  const subscriptions = useLiveQuery(async () => {
    const subs = await db.subscriptions.toArray()

    if (!subs) return []

    // filter out deleted subscriptions
    const filteredSubs = subs.filter(sub => (!sub.deleted_at && !filters.includes(sub.resource_type))).sort((a, b) => new Date(a.subscribed_at) > new Date(b.subscribed_at) ? -1 : 1)

    const grouped: { [local_id:string]: Grouped } = {}
    const failedGrabs: { [local_id:string]: boolean } = {}

    for (let s = 0; s < filteredSubs.length; s++) {
      const item = filteredSubs[s]

      if (failedGrabs[item.resource_id]) continue

      if (!grouped[item.resource_id]) {
        const itemData = await getItem(item.resource_type, item.resource_id)
        
        if (!itemData) {
          failedGrabs[item.resource_id] = true
          continue
        }

        grouped[item.resource_id] = {
          item_id: item.resource_id,
          item: itemData,
          type: item.resource_type,
          versions: [],
          subscriptions: [],
          hashes: {}
        }
      }

      const versionData = await getVersionedResource<Record<string, unknown>>(item.version_id)
      const typeHash = await db.typeHashes.get(item.version_id)

      grouped[item.resource_id].subscriptions.push(item)

      if (versionData) grouped[item.resource_id].versions.push(versionData)
    
      if (typeHash) {
        grouped[item.resource_id].hashes[item.version_id] = typeHash.hashes
      }
      
    }

    return Object.values(grouped).map(group =>
      ({ ...group,
        versions: group.versions.sort((a, b) => {
          if (!a || !b) return 0

          const aCreated = new Date(a.created_at)
          const bCreated = new Date(b.created_at)

          return (aCreated > bCreated) ? 1 : 0
        })
      })
    )
  }, [])

  return { subscriptions: subscriptions ?? [], isLoading: subscriptions === undefined}
}

export default useSubscriptionsWithData