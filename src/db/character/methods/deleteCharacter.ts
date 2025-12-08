import { db } from '@/db'

export default async (local_id: string) => {
  try {
    return await db.characters.update(local_id, {
      deleted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error deleting character:', e);
  }
}
