import { VersionedResource } from '../../schemas/versionedResource'
import { db } from '../../index'

export default async (oldResource: VersionedResource, new_id: string) => {
  try {
    const versionData = {
      ...oldResource,
      local_id: new_id,
      id: undefined
    }

    await db.versions.add(versionData);
    return versionData
  } catch (e) {
    console.log('Error creating versioned resource:', e);
  }
}