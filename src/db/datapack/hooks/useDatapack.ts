import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'

export function useDatapack(packId: string | undefined) {
  const pack = useLiveQuery(() => db.docs.get(packId || ''), [packId])

  return pack
} 