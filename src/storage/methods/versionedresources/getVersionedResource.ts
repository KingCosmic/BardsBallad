import { db } from '@/storage'
import { VersionedResource } from '@storage/schemas/versionedResource';

export default async <T>(local_id: string): Promise<Omit<VersionedResource, 'data'> & { data?: T } | undefined> => {
  try {
    return await db.versions.get(local_id);
  } catch (e) {
    console.log('Error getting subscription:', e);
    return undefined
  }
}
