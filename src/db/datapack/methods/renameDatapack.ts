import { db } from '@/db'

export default async (local_id: string, newName: string) => {
  try {
    return await db.datapacks.update(local_id, {
      name: newName,
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error renaming datapack:', e);
  }
}