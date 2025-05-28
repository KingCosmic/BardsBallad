import SubscriptionSchema from '@/storage/schemas/userSubscription'
import { db } from '@/storage'

import { v4 as uuidv4 } from 'uuid'
import { authState } from '@state/auth'
import { AuthStorage } from '@lib/storage'
import generateLocalId from '@utils/generateLocalId'
import ensureUniqueness from '@utils/db/ensureIdUniqueness'

type Types = 'system' | 'theme' | 'datapack'

export default async (type: Types, resource_id: string, version_id: string, auto_update: boolean) => {
  try {
    const { user } = authState.get()
    
    const user_id = user?.id || 'none'
    
    let local_id = await generateLocalId()

    while (!await ensureUniqueness(local_id)) {
      local_id = await generateLocalId()
    }

    // validate character format.
    const subscriptionData = {
      local_id,
    
      user_id: user_id,
    
      resource_type: type,
      resource_id: resource_id,
      version_id: version_id,
      auto_update: auto_update,
    
      subscribed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    const result = SubscriptionSchema.safeParse(subscriptionData);
    if (!result.success) {
      console.log('Invalid subscription data:', result.error.format());
      return;
    }

    await db.subscriptions.add(subscriptionData);
    return subscriptionData
  } catch (e) {
    console.log('Error creating subscription:', e);
  }
}
