import { SyncStorage } from '../../../lib/storage'
import { db } from '../../index'

export default async (local_id: string, newData: { [key: string]: any }) => {
  try {
    let updatedChars = await SyncStorage.get('updated_characters') || []
    if (!updatedChars.includes(local_id)) {
      await SyncStorage.set('updated_characters', [ ...updatedChars, local_id ])
    }

    return await db.characters.update(local_id, {
      data: newData,
      updatedAt: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error updating character data:', e);
  }
}