import { produce } from 'immer'
import { db } from '../../index'
import { type System } from '../../schemas/system'

export default async function updateSystem(local_id: string, updateFn: (draft: System) => void) {
  const doc = await db.systems.get(local_id)
  if (!doc) return

  try {
    const newState = produce(doc, updateFn)
    
    return await db.systems.update(local_id, {
      ...newState,
      updatedAt: new Date().toISOString(),
    })
  } catch (err: any) {
    console.log('Error updating system:', err)
  }
}