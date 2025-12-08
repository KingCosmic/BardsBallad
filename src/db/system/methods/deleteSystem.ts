import { db } from '@/db'

export default async (local_id: string, force: boolean = false) => {
  try {
    if (force) return await db.systems.delete(local_id)

    return await db.systems.update(local_id, {
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error deleting system:', e);
  }
}
