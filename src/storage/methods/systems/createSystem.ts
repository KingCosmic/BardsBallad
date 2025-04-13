import SystemChema, { type System } from '../../schemas/system'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../../index'

export default async (sys: System) => {
  try {
    let local_id = `${'deviceId'}-${uuidv4()}`

    while (await db.characters.get(local_id) !== undefined) {
      // Generate a new id until we find one that doesn't exist in the database
      local_id = `${'deviceId'}-${uuidv4()}`
    }

    const sysData = {
      ...sys,
      local_id,

      user_id: 'none', // TODO:(Cosmic) set this up to pull from our auth user id and default to "NONE" if not set

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      isDeleted: false,
    }

    // if (process.env.VITE_PUBLIC_VALIDATE_SCHEMA === 'true') {
    if (true) {
      const result = SystemChema.safeParse(sysData);
      if (!result.success) {
        console.log('Invalid character data:', result.error.format());
        return;
      }
    }

    return await db.systems.add(sysData);
  } catch (e) {
    console.log('Error creating system:', e);
  }
}