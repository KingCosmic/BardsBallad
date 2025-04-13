import { db } from '../../index'

export default async (local_id: string, newData: { [key: string]: any }) => {
  try {
    return await db.systems.update(local_id, {
      defaultCharacterData: newData,
      updatedAt: new Date().toISOString(),
    })
  } catch (e) {
    console.log('Error updating system default character data:', e);
  }
}