import { VersionedResource } from '@storage/schemas/versionedResource'
import { db } from '@/storage'
import generateLocalId from '@utils/generateLocalId'
import { authState } from '@state/auth'
import ensureUniqueness from '@utils/db/ensureIdUniqueness'

export default async (oldResource: VersionedResource, new_id?: string) => {
  try {
    const { user } = authState.get()

    const user_id = (user) ? user.id : 'none'

    let local_id = new_id ?? await generateLocalId()

    while (!await ensureUniqueness(local_id)) {
      local_id = await generateLocalId()
    }

    const versionData = {
      ...oldResource,
      user_id,
      local_id,
      id: undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    await db.versions.put(versionData);
    return versionData
  } catch (e) {
    console.log('Error creating versioned resource:', e);
  }
}
