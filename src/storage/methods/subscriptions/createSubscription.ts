import SubcriptionSchema from '../../schemas/userSubscription'
import { db } from '../../index'

import { v4 as uuidv4 } from 'uuid'
import { authState } from '../../../state/auth'

type Types = 'system' | 'character' | 'module' | 'plugin'

export default async (type: Types, resource_id: string, version_id: string, autoUpdate: boolean) => {
  try {
    const { user } = authState.get()
    
    const user_id = user?.id || 'none'
    const device_id = localStorage.getItem('deviceId') || 'none'

    // validate character format.
    const subscriptionData = {
      local_id: `${device_id}-${uuidv4()}`,
    
      user_id: user_id,
    
      resource_type: type,
      resource_id: resource_id,
      subscribedAt: new Date().toISOString(),
      version_id: version_id,
      autoUpdate: autoUpdate,
      pinned: false,
    
      deleted_at: null,
    }

    // if (process.env.VITE_PUBLIC_VALIDATE_SCHEMA === 'true') {
    if (true) {
      const result = SubcriptionSchema.safeParse(subscriptionData);
      if (!result.success) {
        console.log('Invalid subscription data:', result.error.format());
        return;
      }
    }

    await db.subscriptions.add(subscriptionData);
    return subscriptionData
  } catch (e) {
    console.log('Error creating subscription:', e);
  }
}