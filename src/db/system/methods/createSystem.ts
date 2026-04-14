import { db } from '@/db'
import generateUniqueID from '@/utils/db/generateUniqueID'
import { authState } from '@/state/auth'
import z from 'zod'
import { Item } from '@/db/shared/schema'

export default async (sys: Item) => {
  try {
    const local_id = await generateUniqueID()

    const { user } = authState.get()
    const user_id = (user) ? user.id : 'none'

    const sysData = {
      ...sys,
      local_id,

      user_id: user_id,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      deleted_at: null,
    }

    {/* @ts-expect-error */}
    await db.docs.add(sysData);
    return sysData
  } catch (e) {
    console.log('Error creating system:', e);
  }
}
