import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'
import { VersionedResource } from '@/db/version/schema'

export function useVersionResource<T>(version_id: string | undefined): (Omit<VersionedResource, 'data'> & { data: T }) | undefined {
  const version = useLiveQuery(() => db.versions.get(version_id || ''), [version_id])

  if (!version) return undefined
    
  return {
    ...version,
    data: version?.data as T
  }
} 

