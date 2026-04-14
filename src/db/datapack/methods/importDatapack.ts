import { db } from '@/db'
import { authState } from '@/state/auth'
import versionedResourceSchema from '@/db/version/schema'
import generateUniqueID from '@/utils/db/generateUniqueID'
import deleteItem from '@/db/shared/methods/deleteItem'
import storeHashes from '@/db/typeHashes/methods/storeHashes'
import { Item, itemSchema } from '@/db/shared/schema'
import { from } from '@automerge/automerge'

// TODO: since datapacks, systems, and themes are all of type Item. they could probably all use this
// single function if slightly modified.

export default async (pack: Item, version: any) => {
  try {
    const pack_local_id = await generateUniqueID()
    const { user } = authState.get()
    const user_id = (user) ? user.id : 'none'

    const packData = {
      ...pack,
      local_id: pack_local_id,
      user_id,
      created_at: 0,
      updated_at: 0,
      deleted_at: 0
    }

    const parsedResult = itemSchema.safeParse(packData);
    if (!parsedResult.success) {
      console.log('Invalid pack data:', parsedResult.error.format());
      return;
    }

    await db.docs.add(packData);

    const version_local_id = await generateUniqueID()

    const versData = {
      ...version,
      local_id: version_local_id,
      reference_id: pack_local_id,
      user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    }

    const versionResult = versionedResourceSchema.safeParse(versData);
    if (!versionResult.success) {
      // since the version didn't pass, we should delete the system we created.
      deleteItem('datapack', pack_local_id, true)
      console.log('Invalid Version data:', versionResult.error.format());
      return;
    }

    await db.docs.add(versData);

    // @ts-ignore
    storeHashes(versData.local_id, versData.data.types)

    let subscription_local_id = await generateUniqueID()

    // now we need to create a subscription for it.
    await db.docs.add({
      local_id: subscription_local_id,
    
      owner_id: user_id,
    
      type: 'subscription',
      doc: from({
        resource_id: pack_local_id,
        resource_type: pack.type
      }),

      snapshot: undefined, id: '', version: 0, shadow: {},
      namespace: 'test', lifecycle: 'crdt', last_change_index: BigInt(0),
    
      updated_at: 0,
      deleted_at: 0,
    })
  } catch (e) {
    console.log('Error importing system or version or creating subscription:', e);
  }
}
