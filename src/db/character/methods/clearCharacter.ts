import { db } from '@/db'

export default async (local_id: string) => {
  try {
    return await db.docs.update(local_id, {
      doc: undefined,
    })
  } catch (e) {
    console.log('Error clearing character:', e);
  }
}