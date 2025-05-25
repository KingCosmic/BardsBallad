import { SyncStorage } from '@lib/storage'
import { db } from '@/storage'

export default async (local_id: string, newName: string) => {
  try {
    let updatedChars = await SyncStorage.get<string[]>('updated_characters') || []
    if (!updatedChars.includes(local_id)) {
      await SyncStorage.set('updated_characters', [ ...updatedChars, local_id ])
    }

    return await db.characters.update(local_id, {
      name: newName,
      updated_at: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error renaming character:', e);
  }
}
