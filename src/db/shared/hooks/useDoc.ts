import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '@/db'

export function useDoc(doc_id: string) {
  return useLiveQuery(() => db.docs.get(doc_id), [doc_id])
}