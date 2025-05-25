import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/storage'
import { type UserSubscription } from '@storage/schemas/userSubscription'

export function useSubscriptionData(sub: UserSubscription) {
  const query = useLiveQuery(async () => {
    let baseData;

    switch (sub.resource_type) {
      case 'system':
        baseData = await db.systems.where('local_id').equals(sub.resource_id).toArray()
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

