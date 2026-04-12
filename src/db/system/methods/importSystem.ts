import { db } from '@/db'
import { authState } from '@/state/auth'
import generateUniqueID from '@/utils/db/generateUniqueID'
import storeHashes from '@/db/typeHashes/methods/storeHashes'
import { Item, itemSchema } from '@/db/shared/schema'

import * as automerge from '@automerge/automerge'

export default async (sys: Item) => {
  try {
    const system_local_id = await generateUniqueID()

    const { user } = authState.get()
    const owner_id = (user) ? user.id : 'none'

    const sysData: Item = {
      ...sys,
      local_id: system_local_id,
      owner_id
    }

    // const systemResult = itemSchema.safeParse(sysData);
    // if (!systemResult.success) {
    //   console.log('Invalid system data:', systemResult.error.format());
    //   return;
    // }

    await db.docs.add(sysData);

    // @ts-ignore
    // storeHashes(versData.local_id, versData.data.types)

    const subscription_local_id = await generateUniqueID()

    // now we need to create a subscription for it.
    await db.docs.add({
      type: 'subscription',

      id: '',
      local_id: subscription_local_id,
    
      owner_id: owner_id,

      namespace: owner_id,

      lifecycle: 'crdt',

      doc: automerge.from({
        subscribed_at: new Date().toISOString(),
        resource_type: 'system',
        resource_id: system_local_id,
      }),
      snapshot: {},

      shadow: {
        resource_type: 'system',
        resource_id: system_local_id,
      },

      version: 0,
      updated_at: 0,
      deleted_at: 0,
      
      last_change_index: BigInt(0)
    })
  } catch (e) {
    console.log('Error importing system or version or creating subscription:', e);
  }
}