import { db } from '../../index'
import CharacterSchema from '../../schemas/character'

import { v4 as uuidv4 } from 'uuid'

export default async (name: string, data: any, system: { id: string, name: string, version: string }) => {
  try {
    // validate character format.
    const characterData = {
      local_id: uuidv4(),

      user_id: 'none', // TODO:(Cosmic) set this up to pull from our auth user id and default to "NONE" if not set

      name: name,
      data: data,
      system: system,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      isDeleted: false,
    }

    // if (process.env.VITE_PUBLIC_VALIDATE_SCHEMA === 'true') {
    if (true) {
      const result = CharacterSchema.safeParse(characterData);
      if (!result.success) {
        console.log('Invalid character data:', result.error.format());
        return;
      }
    }

    return await db.characters.add(characterData);
  } catch (e) {
    console.log('Error creating character:', e);
  }
}