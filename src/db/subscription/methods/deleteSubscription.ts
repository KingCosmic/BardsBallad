import { db } from '@/db'

export default async (local_id: string) => {
  try {
    const deletedAt = Date.now()

    return await db.docs.update(local_id, {
      deleted_at: deletedAt,
      'shadow.deleted_at': deletedAt,
    })
  } catch (e) {
    console.log('Error deleting subscription:', e)
  }
}
