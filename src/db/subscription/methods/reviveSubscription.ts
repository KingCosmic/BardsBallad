import { db } from '@/db'

export default async (local_id: string) => {
  try {
    return await db.subscriptions.update(local_id, {
      deleted_at: undefined,
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error reviving subscription:', e);
  }
}