import { db } from '@/db'

export default async (local_id: string) => {
  try {
    return await db.characters.get(local_id)
  } catch (e) {
    console.log('Error getting character:', e);
  }
}