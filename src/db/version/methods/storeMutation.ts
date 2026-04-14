import { db } from '@/db'

export default async function storeMutation(local_id: string, promise: any) {
  const doc = await db.docs.get(local_id)
  if (!doc) {
    console.warn('No doc found for ID:', local_id)
    return
  }

  const data = await promise
  if (!data) {
    console.warn('No data returned from mutation')
    return
  }

  try {
    return await db.docs.update(local_id, {
      // @ts-expect-error
      data: data,
    })
  } catch (err: any) {
    console.log('Error updating version resource:', err)
  }
}
