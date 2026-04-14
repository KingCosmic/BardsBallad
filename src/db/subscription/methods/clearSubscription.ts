import { db } from '@/db'

export default async (local_id: string) => {
  try {
    const newDeletionDate = new Date();
    newDeletionDate.setDate(newDeletionDate.getDate() - 11);

    return await db.docs.update(local_id, {})
  } catch (e) {
    console.log('Error clearing subscription:', e);
  }
}
