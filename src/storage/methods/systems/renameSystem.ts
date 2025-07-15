import { db } from '@/storage'

export default async (local_id: string, newName: string) => {
  try {
    return await db.systems.update(local_id, {
      name: newName,
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error renaming system:', e);
  }
}
