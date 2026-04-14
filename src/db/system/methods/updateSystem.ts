import { produce } from 'immer'
import { db } from '@/db'
import { Item } from '@/db/shared/schema'

export default async function updateSystem(local_id: string, updateFn: (draft: Item) => void) {
  const doc = await db.docs.get(local_id)
  if (!doc) return

  try {
    const newState = produce(doc, updateFn)
    
    return await db.docs.update(local_id, {
      ...newState
    })
  } catch (err: any) {
    console.log('Error updating system:', err)
  }
}
