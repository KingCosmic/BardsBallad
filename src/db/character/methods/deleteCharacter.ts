import { db } from '@/db'

export default async (local_id: string) => {
  try {
    return await db.transaction('rw', db.docs, async () => {
      const deletedAt = Date.now()

      await db.docs.update(local_id, {
        deleted_at: deletedAt,
      })

      const linkedSubscriptions = await db.docs
        .filter(doc => doc.type === 'subscription' && doc.shadow.resource_id === local_id)
        .toArray()

      for (const sub of linkedSubscriptions) {
        await db.docs.update(sub.local_id, {
          deleted_at: deletedAt,
          'shadow.deleted_at': deletedAt,
        })
      }
    })
  } catch (e) {
    console.log('Error deleting character:', e);
  }
}
