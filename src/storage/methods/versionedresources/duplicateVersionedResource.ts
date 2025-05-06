import { VersionedResource } from '../../schemas/versionedResource'
import { db } from '../../index'
import generateLocalId from '../../../utils/generateLocalId'
import { authState } from '../../../state/auth'

export default async (oldResource: VersionedResource, new_id?: string) => {
  try {
    const { user } = authState.get()

    const user_id = (user) ? user.id : 'none'

    if (!new_id) {
      new_id = await generateLocalId()
    
      while (await db.systems.get(new_id) !== undefined) {
        // Generate a new id until we find one that doesn't exist in the database
        new_id = await generateLocalId()
      }
    }

    const versionData = {
      ...oldResource,
      user_id: user_id,
      local_id: new_id,
      id: undefined
    }

    await db.versions.put(versionData);
    return versionData
  } catch (e) {
    console.log('Error creating versioned resource:', e);
  }
}