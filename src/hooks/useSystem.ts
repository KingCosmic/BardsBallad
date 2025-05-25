import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/storage'

export function useSystem(systemId: string | undefined) {
  const system = useLiveQuery(() => db.systems.get(systemId || ''), [systemId])

  return system
} 
