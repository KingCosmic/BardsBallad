import { db } from '@/db'
import { VersionedResource } from '@/db/version/schema';

export default async <T>(local_id: string): Promise<Omit<VersionedResource, 'data'> & { data: T } | undefined> => {
  try {
    // @ts-ignore
    return await db.versions.get(local_id);
  } catch (e) {
    console.log('Error getting subscription:', e);
    return undefined
  }
}
