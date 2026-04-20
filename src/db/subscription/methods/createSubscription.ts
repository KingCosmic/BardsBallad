import SubscriptionSchema from '@/db/subscription/schema'
import { db } from '@/db'

import { authState } from '@/state/auth'
import generateUniqueID from '@/utils/db/generateUniqueID'
import z from 'zod'
import { Item } from '@/db/shared/schema'
import { from, save } from '@automerge/automerge'

export default async (type: string, resource_id: string, version_id: string, auto_update: boolean) => {
  try {
    const { user } = authState.get()
    
    const owner_id = user?.id || 'none'
    
    const local_id = await generateUniqueID()

    // validate a character format.
    const subscriptionData: Item = {
      id: '',
      local_id,
      owner_id,
    
      shadow: {
        resource_type: type,
        resource_id: resource_id
      },

      namespace: `${owner_id}/${local_id}`,
      type: 'subscription',
      lifecycle: 'crdt',
      doc: save(from({
        resource_type: type,
        resource_id: resource_id
      })),

      snapshot: undefined,
      
      version: 0, updated_at: 0, deleted_at: 0, last_change_index: BigInt(0)
    }

    await db.docs.add(subscriptionData);
    return subscriptionData
  } catch (e) {
    console.log('Error creating subscription:', e);
  }
}
