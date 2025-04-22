import SystemChema, { type System } from '../../schemas/system'
import { v4 as uuidv4 } from 'uuid'
import { db } from '../../index'

export default async (sys: System) => {
  try {
    let local_id = sys.local_id || `${'deviceId'}-${uuidv4()}`

    if (await db.systems.get({ id: sys.id || '' }) !== undefined) {
      console.log('System already exists in the database')
      return
    }

    let existingSystem = await db.systems.get({ local_id })

    while (existingSystem !== undefined) {
      // Generate a new id until we find one that doesn't exist in the database
      local_id = `${'deviceId'}-${uuidv4()}`
      existingSystem = await db.systems.get({ local_id })
    }

    const sysData = {
      ...sys,
      local_id,
      updatedAt: new Date().toISOString()
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