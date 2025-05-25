import { db } from '@/storage'

export default async (local_id: string) => {
  try {
    return await db.versions.get(local_id);
  } catch (e) {
    console.log('Error getting subscription:', e);
    return undefined
  }
}
