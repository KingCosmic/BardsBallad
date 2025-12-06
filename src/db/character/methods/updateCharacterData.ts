import { db } from '@/db'

export default async (local_id: string, newData: Record<string, any>) => {
  try {
    return await db.characters.update(local_id, {
      data: newData,
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error updating character data:', e);
  }
}
