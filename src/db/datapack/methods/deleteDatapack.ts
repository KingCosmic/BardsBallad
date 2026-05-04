import { db } from '@/db'

export default async (local_id: string, force: boolean = false) => {
  try {
    return await db.transaction('rw', db.docs, async () => {
      const linkedSubscriptions = await db.docs
        .filter(doc => doc.type === 'subscription' && doc.shadow.resource_id === local_id)
        .toArray()

      if (force) {
        await db.docs.delete(local_id)

        for (const subscription of linkedSubscriptions) {
          await db.docs.delete(subscription.local_id)
        }

        return
      }

      const deletedAt = Date.now()

      await db.docs.update(local_id, { deleted_at: deletedAt })

      for (const subscription of linkedSubscriptions) {
        await db.docs.update(subscription.local_id, {
          deleted_at: deletedAt,
          'shadow.deleted_at': deletedAt,
        })
      }
    })
  } catch (e) {
    console.log('Error deleting datapack:', e)
  }
}
