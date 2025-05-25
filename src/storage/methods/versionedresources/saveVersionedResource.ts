import { db } from '@/storage'
import versionedResourceSchema, { VersionedResource } from '@storage/schemas/versionedResource';

export default async (vers: VersionedResource): Promise<VersionedResource | null> => {
  try {
    if (await db.versions.get(vers.local_id)) {
      return null
    }

    const result = versionedResourceSchema.safeParse(vers);
    if (!result.success) {
      console.log('Invalid version data:', result.error.format());
      return null
    }

    await db.versions.add(vers);
    return vers
  } catch (e) {
    console.log('Error saving version:', e);
    return null;
  }
}
