import { db } from '@/db'
import { save } from '@automerge/automerge'

export default async function updateAutomergeDoc(local_id: string, promise: any) {
  const data = await promise
  if (!data) {
    console.warn('No data returned from mutation')
    return
  }

  try {
    return await db.docs.update(local_id, {
      doc: save(data),
    })
  } catch (err: any) {
    console.log('Error updating version resource:', err)
  }
}
