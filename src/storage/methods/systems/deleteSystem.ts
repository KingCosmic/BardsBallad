import { db } from '@/storage'

export default async (local_id: string) => {
  try {
    return await db.systems.update(local_id, {
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error deleting system:', e);
  }
}
