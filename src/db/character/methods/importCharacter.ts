import { v4 as uuidv4 } from 'uuid'
import { db } from '@/db'
import characterSchema, { Character } from '@/db/character/schema'
import z from 'zod'
import generateUniqueID from '@/utils/db/generateUniqueID'

export default async (char: Character) => {
  try {
    let local_id = generateUniqueID()

    // check if we have the system this character uses.
    const system = await db.systems.get({ local_id: char.system.local_id })
    if (!system) {
      console.log('System not found in the database')
      return
    }

    const charData = {
      ...char,
      local_id,
      id: undefined,
      updated_at: new Date().toISOString()
    }

    const result = characterSchema.safeParse(charData);
    if (!result.success) {
      console.log('Invalid character data:', z.treeifyError(result.error));
      return;
    }

    return await db.characters.add(charData);
  } catch (e) {
    console.log('Error creating system:', e);
  }
}
