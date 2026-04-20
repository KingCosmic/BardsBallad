import { db } from '@/db'
import generateUniqueID from '@/utils/db/generateUniqueID'
import { authState } from '@/state/auth'
import { Item } from '@/db/shared/schema'
import { from, save } from '@automerge/automerge'

export default async (oldResource: Item, new_id?: string, overwriteIfExists: boolean = false) => {
  try {
    const { user } = authState.get()

    const owner_id = (user) ? user.id : 'none'

    const local_id = new_id ?? await generateUniqueID()

    const versionData: Item = {
      ...oldResource,
      lifecycle: 'crdt',
      doc: (oldResource.lifecycle === 'snapshot') ? save(from(oldResource.snapshot)) : oldResource.doc,
      owner_id,
      local_id: overwriteIfExists ? oldResource.local_id : local_id,
      id: overwriteIfExists ? oldResource.id : '',
    }

    await db.docs.put(versionData);
    return versionData
  } catch (e) {
    console.log('Error creating versioned resource:', e);
  }
}
