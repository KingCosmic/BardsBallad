import SystemSchema from '@storage/schemas/system'
import { db, Item, itemSchema } from '@/storage'
import generateLocalId from '@utils/generateLocalId'
import { authState } from '@state/auth'
import versionedResourceSchema, { VersionedResource } from '@storage/schemas/versionedResource'
import ensureUniqueness from '@utils/db/ensureIdUniqueness'
import deleteItem from '@utils/items/deleteItem'
import datapackSchema from '@storage/schemas/datapack'
import storeHashes from '../hashes/storeHashes'

// TODO: since datapacks, systems, and themes are all of type Item. they could probably all use this
// single function if slightly modified.

export default async (pack: Item, version: VersionedResource) => {
  try {
    let pack_local_id = await generateLocalId()

    while (!await ensureUniqueness(pack_local_id)) {
      pack_local_id = await generateLocalId()
    }


    const { user } = authState.get()
    const user_id = (user) ? user.id : 'none'

    const packData = {
      ...pack,
      local_id: pack_local_id,
      user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    }

    const parsedResult = itemSchema.safeParse(packData);
    if (!parsedResult.success) {
      console.log('Invalid pack data:', parsedResult.error.format());
      return;
    }

    await db.datapacks.add(packData);

    let version_local_id = await generateLocalId()

    while (!await ensureUniqueness(version_local_id)) {
      version_local_id = await generateLocalId()
    }

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

    await db.versions.add(versData);

    storeHashes(versData.local_id, versData.data.types)

    let subscription_local_id = await generateLocalId()

    while (!await ensureUniqueness(subscription_local_id)) {
      subscription_local_id = await generateLocalId()
    }

    // now we need to create a subscription for it.
    await db.subscriptions.add({
      local_id: subscription_local_id,
    
      user_id: user_id,
    
      resource_type: 'datapack',
      resource_id: pack_local_id,
      version_id: version_local_id,
      auto_update: false,
    
      subscribed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    })
  } catch (e) {
    console.log('Error importing system or version or creating subscription:', e);
  }
}
