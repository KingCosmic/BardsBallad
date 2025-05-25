import SystemSchema, { type System } from '@storage/schemas/system'
import { db } from '@/storage'
import generateLocalId from '@utils/generateLocalId'
import { authState } from '@state/auth'
import versionedResourceSchema, { VersionedResource } from '@storage/schemas/versionedResource'
import ensureUniqueness from '@utils/db/ensureIdUniqueness'

// TODO: check if local_id includes 'none' if so we need to update it if we're logged in.
// TODO:(Cosmic) Give this a once over to make sure we aren't doing stupid stuff.
// (like we override the local_id if one doesn't exist but don't touch id or user_id)
export default async (sys: System, version: VersionedResource) => {
  try {
    let system_local_id = await generateLocalId()

    while (!await ensureUniqueness(system_local_id)) {
      system_local_id = await generateLocalId()
    }


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

    let version_local_id = await generateLocalId()

    while (!await ensureUniqueness(version_local_id)) {
      version_local_id = await generateLocalId()
    }

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
