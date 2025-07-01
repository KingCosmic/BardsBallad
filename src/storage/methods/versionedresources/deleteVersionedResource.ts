import { db } from '@/storage'

export default async (local_id: string, force: boolean = false) => {
  try {
    if (force) return await db.versions.delete(local_id)

    return await db.versions.update(local_id, {
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error deleting system:', e);
  }
}
