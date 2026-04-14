import { db } from '@/db'
import generateUniqueID from '@/utils/db/generateUniqueID'
import { authState } from '@/state/auth'
import { Item } from '@/db/shared/schema'

export default async (oldResource: Item, new_id?: string, overwriteIfExists: boolean = false) => {
  try {
    const { user } = authState.get()

    const user_id = (user) ? user.id : 'none'

    const local_id = new_id ?? await generateUniqueID()

    const versionData = {
      ...oldResource,
      user_id,
      local_id,
      id: overwriteIfExists ? oldResource.id : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    {/* @ts-expect-error */}
    await db.docs.put(versionData);
    return versionData
  } catch (e) {
    console.log('Error creating versioned resource:', e);
  }
}
