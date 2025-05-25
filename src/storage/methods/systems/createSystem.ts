import SystemSchema, { type System } from '@storage/schemas/system'
import { db } from '@/storage'
import generateLocalId from '@utils/generateLocalId'
import { authState } from '@state/auth'
import ensureUniqueness from '@utils/db/ensureIdUniqueness'

export default async (sys: System) => {
  try {
    let local_id = await generateLocalId()

    while (!await ensureUniqueness(local_id)) {
      local_id = await generateLocalId()
    }

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
      console.log('Invalid character data:', result.error.format());
      return;
    }

    await db.systems.add(sysData);
    return sysData
  } catch (e) {
    console.log('Error creating system:', e);
  }
}
