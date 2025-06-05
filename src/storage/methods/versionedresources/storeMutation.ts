import { db } from '@/storage'

export default async function storeMutation(local_id: string, promise: any) {
  const doc = await db.versions.get(local_id)
  if (!doc) {
    console.warn('No doc found for ID:', local_id)
    return
  }

  const data = await promise
  if (!data) {
    console.warn('No data returned from mutaiton')
    return
  }

  try {
    return await db.versions.update(local_id, {
      data: data,
    })
  } catch (err: any) {
    console.log('Error updating version resource:', err)
  }
}
