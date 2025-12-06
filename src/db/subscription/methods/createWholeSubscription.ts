import { db, itemSchema } from '@/db'
import generateUniqueID from '@/utils/db/generateUniqueID'
import { authState } from '@/state/auth'
import versionedResourceSchema from '@/db/version/schema'
import z from 'zod'

export default async (name: string, type: 'system' | 'datapack', data: any) => {
  try {
    const pack_local_id = generateUniqueID()

    const { user } = authState.get()
    const user_id = (user) ? user.id : 'none'

    const itemData = {
      name,
      local_id: pack_local_id,
      user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    }

    const systemResult = itemSchema.safeParse(itemData);
    if (!systemResult.success) {
      console.log('Invalid pack data:', systemResult.error.format());
      return;
    }

    switch (type) {
      case 'system':
        await db.systems.add(itemData)
        break;
      case 'datapack':
        await db.datapacks.add(itemData)
        break;
    }

    const version_local_id = generateUniqueID()

    const versData = {
      data,
      local_id: version_local_id,
      reference_id: pack_local_id,
      reference_type: type,
      user_id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null
    }

    const versionResult = versionedResourceSchema.safeParse(versData);
    if (!versionResult.success) {
      console.log('Invalid Version data:', z.treeifyError(versionResult.error));
      return;
    }

    await db.versions.add(versData);

    const subscription_local_id = generateUniqueID()

    const subData = {
      local_id: subscription_local_id,
    
      user_id: user_id,
    
      resource_type: type,
      resource_id: pack_local_id,
      version_id: version_local_id,
      auto_update: false,
    
      subscribed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    // now we need to create a subscription for it.
    await db.subscriptions.add(subData)

    return subData
  } catch (e) {
    console.log('Error creating pack or version or creating subscription:', e);
  }
}
