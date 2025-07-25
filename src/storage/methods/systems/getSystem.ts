import { db } from '@/storage'

export default async (local_id: string) => {
  try {
    return await db.systems.get(local_id)
  } catch (e) {
    console.log('Error deleting system:', e);
  }
}
