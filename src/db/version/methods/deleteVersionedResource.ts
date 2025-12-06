import { db } from '@/db'

export default async (local_id: string, force: boolean = false) => {
  try {
    if (force) return await db.versions.delete(local_id)

    return await db.versions.delete(local_id)
  } catch (e) {
    console.log('Error deleting version:', e);
  }
}
