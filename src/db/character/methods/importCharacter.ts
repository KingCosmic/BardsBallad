import { v4 as uuidv4 } from 'uuid'
import { db } from '@/db'
import characterSchema, { Character } from '@/db/character/schema'
import z from 'zod'

export default async (char: Character) => {
  try {
    let local_id = char.local_id || `${'deviceId'}-${uuidv4()}`

    if (await db.characters.get({ id: char.id || '' }) !== undefined) {
      console.log('Character already exists in the database')
      return
    }

    let existingCharacter = await db.characters.get({ local_id })
    if (existingCharacter !== undefined) {
      console.log('Character already exists in the database')
      return
    }

    // check if we have the system this character uses.
    const system = await db.systems.get({ local_id: char.system.local_id })
    if (!system) {
      console.log('System not found in the database')
      return
    }

    const charData = {
      ...char,
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
