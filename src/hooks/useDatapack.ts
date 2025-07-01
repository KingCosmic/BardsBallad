import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/storage'

export function useDatapack(packId: string | undefined) {
  const pack = useLiveQuery(() => db.datapacks.get(packId || ''), [packId])

  return pack
} 
