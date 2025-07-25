import { AuthStorage, SyncStorage } from '@lib/storage'
import { authState } from '@state/auth'
import ensureUniqueness from '@utils/db/ensureIdUniqueness'
import generateLocalId from '@utils/generateLocalId'
import { db } from '@/storage'
import CharacterSchema from '@storage/schemas/character'
import { addToast } from '@state/toasts'

export default async (name: string, data: any, system: { local_id: string, version_id: string }, datapacks: { pack_id: string, version_id: string }[]) => {
  try {
    const { user } = authState.get()

    const user_id = user?.id || 'none'

    let local_id = await generateLocalId()

    while (!await ensureUniqueness(local_id)) {
      local_id = await generateLocalId()
    }

    // validate character format.
    const characterData = {
      local_id,

      user_id,

      name,

      data,

      system,

      datapacks,
      
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const result = CharacterSchema.safeParse(characterData);
    if (!result.success) {
      console.log('Invalid character data:', result.error.format());
      return;
    }

    let updatedChars = await SyncStorage.get<string[]>('updated_characters') || []
    if (!updatedChars.includes(characterData.local_id)) {
      await SyncStorage.set('updated_characters', [ ...updatedChars, characterData.local_id ])
    }

    return await db.characters.add(characterData);
  } catch (e) {
    addToast('Error creating Character.', 'error')
    console.log('Error creating character:', e);
  }
}
