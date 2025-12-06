import SystemSchema from '@/db/system/schema'
import { db, Item } from '@/db'
import generateUniqueID from '@/utils/db/generateUniqueID'
import { authState } from '@/state/auth'
import z from 'zod'

export default async (sys: Item) => {
  try {
    const local_id = generateUniqueID()

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

    const result = SystemSchema.safeParse(sysData);
    if (!result.success) {
      console.log('Invalid character data:', z.treeifyError(result.error));
      return;
    }

    await db.systems.add(sysData);
    return sysData
  } catch (e) {
    console.log('Error creating system:', e);
  }
}
