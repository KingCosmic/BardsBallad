import { db } from '@/storage'

export default async function storeMutation(local_id: string, promise: any) {
  const doc = await db.versions.get(local_id)
  if (!doc) return

  const data = await promise
  if (!data) return

  try {
    return await db.versions.update(local_id, {
      data: data,
    })
  } catch (err: any) {
    console.log('Error updating version resource:', err)
  }
}
