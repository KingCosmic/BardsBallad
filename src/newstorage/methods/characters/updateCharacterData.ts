import { db } from '../../index'

export default async (local_id: string, newData: { [key: string]: any }) => {
  try {
    return await db.characters.update(local_id, {
      data: newData,
      updatedAt: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error updating character data:', e);
  }
}