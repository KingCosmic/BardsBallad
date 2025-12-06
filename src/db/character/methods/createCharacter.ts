import { authState } from '@/state/auth'
import { db } from '@/db'
import CharacterSchema from '@/db/character/schema'
import generateUniqueID from '@/utils/db/generateUniqueID'

export default async (name: string, slug: string, data: any, system: { local_id: string, version_id: string }, datapacks: { pack_id: string, version_id: string }[]) => {
  try {
    const { user } = authState.get()

    const user_id = user?.id || 'none'

    const local_id = generateUniqueID()

    // validate character format.
    const characterData = {
      local_id,

      user_id,

      name,

      data: {
        ...data,
        _flavor: slug
      },

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

    return await db.characters.add(characterData);
  } catch (e) {
    console.log('Error creating character:', e);
  }
}