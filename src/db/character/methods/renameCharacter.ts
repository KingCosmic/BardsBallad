import { db } from '@/db'

export default async (local_id: string, newName: string) => {
  try {
    return await db.docs.update(local_id, {
      
    })
  } catch (e) {
    console.log('Error renaming character:', e);
  }
}
