import { db, itemSchema } from '@/storage'
import generateLocalId from '@utils/generateLocalId'
import { authState } from '@state/auth'
import versionedResourceSchema from '@storage/schemas/versionedResource'
import ensureUniqueness from '@utils/db/ensureIdUniqueness'
import { addToast } from '@state/toasts'

export default async (name: string, type: 'system' | 'datapack', data: any) => {
  try {
    let pack_local_id = await generateLocalId()

    while (!await ensureUniqueness(pack_local_id)) {
      pack_local_id = await generateLocalId()
    }

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

    let version_local_id = await generateLocalId()

    while (!await ensureUniqueness(version_local_id)) {
      version_local_id = await generateLocalId()
    }

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
      console.log('Invalid Version data:', versionResult.error.format());
      return;
    }

    await db.versions.add(versData);

    let subscription_local_id = await generateLocalId()

    while (!await ensureUniqueness(subscription_local_id)) {
      subscription_local_id = await generateLocalId()
    }

    // now we need to create a subscription for it.
    await db.subscriptions.add({
      local_id: subscription_local_id,
    
      user_id: user_id,
    
      resource_type: type,
      resource_id: pack_local_id,
      version_id: version_local_id,
      auto_update: false,
    
      subscribed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    })
  } catch (e) {
    addToast('Error creating subscription data. If this continues please post a issue in our discord.', 'error')
    console.log('Error creating pack or version or creating subscription:', e);
  }
}
