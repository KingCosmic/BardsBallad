import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../storage'

export function useVersionResource(version_id: string | undefined) {
  const system = useLiveQuery(() => db.versions.get(version_id || ''), [version_id])
    
  return system
} 