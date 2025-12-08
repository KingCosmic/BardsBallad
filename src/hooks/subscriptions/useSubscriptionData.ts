import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'
import { type Subscription } from '@/db/subscription/schema'

export function useSubscriptionData(sub: Subscription) {
  const query = useLiveQuery(async () => {
    let baseData;

    switch (sub.resource_type) {
      case 'system':
        baseData = await db.systems.where('local_id').equals(sub.resource_id).toArray()
        break
      case 'datapack':
        baseData = await db.datapacks.where('local_id').equals(sub.resource_id).toArray()
        break
    }

    if (!baseData || baseData.length === 0) {
      return undefined
    }

    const versionData = await db.versions.where('local_id').equals(sub.version_id).toArray()
    if (!versionData || versionData.length === 0) {
      return undefined
    }

    return { baseData: baseData[0], versionData: versionData[0] }
  }, [])

  return { query, isLoading: (query === undefined) }
}