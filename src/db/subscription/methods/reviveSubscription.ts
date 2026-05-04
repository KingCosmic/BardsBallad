import { db } from '@/db'

export default async (local_id: string) => {
  try {
    return await db.docs.update(local_id, {
      deleted_at: 0,
      'shadow.deleted_at': 0,
    })
  } catch (e) {
    console.log('Error reviving subscription:', e)
  }
}
