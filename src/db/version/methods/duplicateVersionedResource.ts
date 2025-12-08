import { VersionedResource } from '@/db/version/schema'
import { db } from '@/db'
import generateUniqueID from '@/utils/db/generateUniqueID'
import { authState } from '@/state/auth'

export default async (oldResource: VersionedResource, new_id?: string, overwriteIfExists: boolean = false) => {
  try {
    const { user } = authState.get()

    const user_id = (user) ? user.id : 'none'

    const local_id = new_id ?? generateUniqueID()

    const versionData = {
      ...oldResource,
      user_id,
      local_id,
      id: overwriteIfExists ? oldResource.id : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    await db.versions.put(versionData);
    return versionData
  } catch (e) {
    console.log('Error creating versioned resource:', e);
  }
}
