import { db } from '@/db'
import generateUniqueID from '@/utils/db/generateUniqueID'
import { authState } from '@/state/auth'
import { Item, itemSchema } from '@/db/shared/schema'

import * as automerge from '@automerge/automerge'
import { characterShadow } from '@/newsync/shadows'

export default async (type: 'system' | 'datapack' | 'character', data: any) => {
  try {
    const char_local_id = await generateUniqueID()

    const { user } = authState.get()
    const owner_id = (user) ? user.id : 'none'

    console.log(data)

    const itemData: Item = {
      id: '',
      local_id: char_local_id,
      owner_id,

      namespace: `${owner_id}/${char_local_id}`,

      type: 'character',

      lifecycle: 'crdt',
      doc: automerge.save(automerge.from(data)),
      snapshot: {},
      shadow: characterShadow(data),

      version: 0,
      updated_at: 0,
      deleted_at: 0,
      last_change_index: BigInt(0)
    }

    // const systemResult = itemSchema.safeParse(itemData);
    // if (!systemResult.success) {
    //   console.log(`Invalid ${type} data:`, systemResult.error.format());
    //   return;
    // }

    await db.docs.add(itemData)

    const subscription_local_id = await generateUniqueID()

    const subData: Item = {
      id: '',
      local_id: subscription_local_id,
      owner_id,

      namespace: `${owner_id}/${subscription_local_id}`,

      type: 'subscription',

      lifecycle: 'crdt',
      doc: {},
      snapshot: {
        resource_type: type,
        resource_id: char_local_id,
      },
      shadow: {
        resource_type: type,
        resource_id: char_local_id,
      },

      version: 0,
      updated_at: 0,
      deleted_at: 0,
      last_change_index: BigInt(0)
    }

    // now we need to create a subscription for it.
    await db.docs.add(subData)

    return subData
  } catch (e) {
    console.log(`Error creating :`, e);
  }
}
