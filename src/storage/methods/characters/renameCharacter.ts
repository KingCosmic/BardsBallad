import { SyncStorage } from '../../../lib/storage'
import { db } from '../../index'

export default async (local_id: string, newName: string) => {
  try {
    let updatedChars = await SyncStorage.get('updated_characters') || []
    if (!updatedChars.includes(local_id)) {
      await SyncStorage.set('updated_characters', [ ...updatedChars, local_id ])
    }

    return await db.characters.update(local_id, {
      name: newName,
      updatedAt: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error renaming character:', e);
  }
}