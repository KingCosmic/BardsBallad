import { db } from '@/db'

export default async <T>(local_id: string) => {
  try {
    return await db.docs.get(local_id)
  } catch (e) {
    console.log('Error grabbing doc:', e);
  }
}
