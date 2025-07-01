import { db, Item, itemSchema } from '@/storage'
import generateLocalId from '@utils/generateLocalId'
import { authState } from '@state/auth'
import ensureUniqueness from '@utils/db/ensureIdUniqueness'

export default async (sys: Item) => {
  try {
    let local_id = await generateLocalId()

    while (!await ensureUniqueness(local_id)) {
      local_id = await generateLocalId()
    }

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
      console.log('Invalid datapack data:', result.error.format());
      return;
    }

    await db.datapacks.add(packData);
    return packData
  } catch (e) {
    console.log('Error creating datapack:', e);
  }
}
