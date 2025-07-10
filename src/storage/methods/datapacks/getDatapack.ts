import { db } from '@/storage'

export default async (local_id: string) => {
  try {
    return await db.datapacks.get(local_id)
  } catch (e) {
    console.log('Error getting datapack:', e);
  }
}