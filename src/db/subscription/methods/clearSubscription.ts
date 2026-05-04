import { db } from '@/db'

export default async (local_id: string) => {
  try {
    return await db.transaction('rw', db.docs, async () => {
      const sub = await db.docs.get(local_id)

      if (sub) {
        await db.docs.delete(sub.shadow.resource_id)
      }

      await db.docs.delete(local_id)
    })
  } catch (e) {
    console.log('Error clearing subscription:', e)
  }
}
