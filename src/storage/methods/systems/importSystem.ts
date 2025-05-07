import SystemChema, { type System } from '../../schemas/system'
import { db } from '../../index'
import generateLocalId from '../../../utils/generateLocalId'
import { authState } from '../../../state/auth'
import versionedResourceSchema, { VersionedResource } from '../../schemas/versionedResource'

// TODO: check if local_id includes 'none' if so we need to update it if we're logged in.
// TODO:(Cosmic) Give this a once over to make sure we aren't doing stupid stuff.
// (like we override the local_id if one doesn't exist but don't touch id or user_id)
export default async (sys: System, version: VersionedResource) => {
  try {
    let system_local_id = await generateLocalId()
    while (await db.systems.get({ local_id: system_local_id })) {
      // Generate a new id until we find one that doesn't exist in the database
      system_local_id = await generateLocalId()
    }

    const { user } = authState.get()
    const user_id = (user) ? user.id : 'none'

    const sysData = {
      ...sys,
      local_id: system_local_id,
      user_id,
    }

    console.log(sysData)
    const systemResult = SystemChema.safeParse(sysData);
    if (!systemResult.success) {
      console.log('Invalid system data:', systemResult.error.format());
      return;
    }

    await db.systems.add(sysData);

    let version_local_id = await generateLocalId()

    while (await db.versions.get({ local_id: version_local_id })) {
      // Generate a new id until we find one that doesn't exist in the database
      version_local_id = await generateLocalId()
    }

    const versData = {
      ...version,
      local_id: version_local_id,
      reference_id: system_local_id,
      user_id
    }

    const versionResult = versionedResourceSchema.safeParse(versData);
    if (!versionResult.success) {
      console.log('Invalid Version data:', versionResult.error.format());
      return;
    }

    await db.versions.add(versData);

    let subscription_local_id = await generateLocalId()

    while (await db.subscriptions.get({ local_id: subscription_local_id })) {
      // Generate a new id until we find one that doesn't exist in the database
      subscription_local_id = await generateLocalId()
    }

    // now we need to create a subscription for it.
    await db.subscriptions.add({
      local_id: subscription_local_id,
    
      user_id: user_id,
    
      resource_type: 'system',
      resource_id: system_local_id,
      subscribed_at: new Date().toISOString(),
      version_id: version_local_id,
      autoUpdate: false,
      pinned: false,
    
      deleted_at: null,
    })
  } catch (e) {
    console.log('Error importing system or version or creating subscription:', e);
  }
}