import { db } from '../../index'

export default async function storeMutation(local_id: string, data: any) {
  const doc = await db.versions.get(local_id)
  if (!doc) return

  try {
    return await db.versions.update(local_id, {
      data: data,
      updated_at: new Date().toISOString(),
    })
  } catch (err: any) {
    console.log('Error updating version resource:', err)
  }
}