import { SyncStorage } from '../../../lib/storage'
import { authState } from '../../../state/auth'
import { db } from '../../index'
import CharacterSchema from '../../schemas/character'

import { v4 as uuidv4 } from 'uuid'

export default async (name: string, data: any, system: { local_id: string, name: string, version: string }) => {
  try {
    const { user } = authState.get()

    const user_id = user?.id || 'none'
    const device_id = localStorage.getItem('deviceId') || 'none'

    // validate character format.
    const characterData = {
      local_id: `${device_id}-${uuidv4()}`,

      user_id: user_id,

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

    let updatedChars = await SyncStorage.get('updated_characters') || []
    if (!updatedChars.includes(characterData.local_id)) {
      await SyncStorage.set('updated_characters', [ ...updatedChars, characterData.local_id ])
    }

    return await db.characters.add(characterData);
  } catch (e) {
    console.log('Error creating character:', e);
  }
}