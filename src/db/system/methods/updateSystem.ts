import { produce } from 'immer'
import { db, Item } from '@/db'

export default async function updateSystem(local_id: string, updateFn: (draft: Item) => void) {
  const doc = await db.systems.get(local_id)
  if (!doc) return

  try {
    const newState = produce(doc, updateFn)
    
    return await db.systems.update(local_id, {
      ...newState,
      updated_at: new Date().toISOString(),
    })
  } catch (err: any) {
    console.log('Error updating system:', err)
  }
}
