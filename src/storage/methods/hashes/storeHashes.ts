import { db, Item } from '@/storage'

export default async (local_id: string, hashes: { name: string, hash: string }[]) => {
  try {
    return await db.typeHashes.put({
      local_id,
      hashes
    })
  } catch (e) {
    console.log('Error creating system:', e);
  }
}
