import { db, Item, itemSchema } from '@/db'
import { authState } from '@/state/auth'
import z from 'zod'
import generateUniqueID from '@/utils/db/generateUniqueID'

export default async (sys: Item) => {
  try {
    const local_id = generateUniqueID()

    const { user } = authState.get()
    const user_id = (user) ? user.id : 'none'

    const packData = {
      ...sys,
      local_id,

      user_id: user_id,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const result = itemSchema.safeParse(packData);
    if (!result.success) {
      console.log('Invalid datapack data:', z.treeifyError(result.error));
      return;
    }

    await db.datapacks.add(packData);
    return packData
  } catch (e) {
    console.log('Error creating datapack:', e);
  }
}
