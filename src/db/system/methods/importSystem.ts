import SystemSchema from '@/db/system/schema'
import { db, Item } from '@/db'
import { authState } from '@/state/auth'
import versionedResourceSchema, { VersionedResource } from '@/db/version/schema'
import z from 'zod'
import generateUniqueID from '@/utils/db/generateUniqueID'
import deleteItem from '@/db/shared/methods/deleteItem'
import storeHashes from '@/db/typeHashes/methods/storeHashes'

export default async (sys: Item, version: VersionedResource) => {
  try {
    const system_local_id = generateUniqueID()

    const { user } = authState.get()
    const user_id = (user) ? user.id : 'none'

    const sysData = {
      ...sys,
      local_id: system_local_id,
      user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    }

    const systemResult = SystemSchema.safeParse(sysData);
    if (!systemResult.success) {
      console.log('Invalid system data:', systemResult.error.format());
      return;
    }

    await db.systems.add(sysData);

    const version_local_id = generateUniqueID()

    const versData = {
      ...version,
      local_id: version_local_id,
      reference_id: system_local_id,
      user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    }

    const versionResult = versionedResourceSchema.safeParse(versData);
    if (!versionResult.success) {
      // since the version didn't pass, we should delete the system we created.
      deleteItem('system', system_local_id, true)
      console.log('Invalid Version data:', z.treeifyError(versionResult.error));
      return;
    }

    await db.versions.add(versData);

    // @ts-ignore
    storeHashes(versData.local_id, versData.data.types)

    const subscription_local_id = generateUniqueID()

    // now we need to create a subscription for it.
    await db.subscriptions.add({
      local_id: subscription_local_id,
    
      user_id: user_id,
    
      resource_type: 'system',
      resource_id: system_local_id,
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