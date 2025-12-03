import SubscriptionSchema from '@/db/subscription/schema'
import { db } from '@/db'

import { authState } from '@/state/auth'
import generateUniqueID from '@/utils/db/generateUniqueID'
import z from 'zod'

type Types = 'system' | 'theme' | 'datapack'

export default async (type: Types, resource_id: string, version_id: string, auto_update: boolean) => {
  try {
    const { user } = authState.get()
    
    const user_id = user?.id || 'none'
    
    const local_id = generateUniqueID()

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
      console.log('Invalid subscription data:', z.treeifyError(result.error));
      return;
    }

    await db.subscriptions.add(subscriptionData);
    return subscriptionData
  } catch (e) {
    console.log('Error creating subscription:', e);
  }
}
