import z from 'zod'
import generateUniqueID from '@/utils/db/generateUniqueID'
import characterSchema, { Character } from '../schema'
import { db } from '@/db'
import { Item } from '@/db/shared/schema'
import { characterShadow } from '@/newsync/shadows'

export default async (char: Character) => {
  try {
    let local_id = await generateUniqueID()

    // check if we have the system this character uses.
    const system = await db.docs.get({ local_id: char.system })
    if (!system) {
      console.log('System not found in the database')
      return
    }

    const charData: Item = {
      ...char,
      owner_id: '', shadow: characterShadow(char), namespace: 'test', type: 'character',
      lifecycle: 'crdt', doc: {}, snapshot: undefined, version: 0,
      updated_at: 0, deleted_at: 0, last_change_index: BigInt(0),
      local_id,
      id: '',
    }

    const result = characterSchema.safeParse(charData);
    if (!result.success) {
      console.log('Invalid character data:', z.treeifyError(result.error));
      return;
    }

    return await db.docs.add(charData);
  } catch (e) {
    console.log('Error creating system:', e);
  }
}
