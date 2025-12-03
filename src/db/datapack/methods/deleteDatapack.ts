import { db } from '@/db'

export default async (local_id: string, force: boolean = false) => {
  try {
    if (force) return await db.datapacks.delete(local_id)

    return await db.datapacks.update(local_id, {
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error deleting datapack:', e);
  }
}
