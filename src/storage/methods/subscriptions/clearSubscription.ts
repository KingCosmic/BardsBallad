import { db } from '@/storage'

export default async (local_id: string) => {
  try {
    const newDeletionDate = new Date();
    newDeletionDate.setDate(newDeletionDate.getDate() - 11);

    return await db.subscriptions.update(local_id, {
      deleted_at: newDeletionDate.toISOString(),
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error clearing subscription:', e);
  }
}
