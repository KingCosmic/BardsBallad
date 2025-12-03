import SystemSchema from '@/db/system/schema'
import { db, Item } from '@/db'
import z from 'zod';

export default async (sys: Item): Promise<Item | null> => {
  try {
    if (await db.systems.get(sys.local_id)) {
      return null
    }

    const result = SystemSchema.safeParse(sys);
    if (!result.success) {
      console.log('Invalid system data:', z.treeifyError(result.error));
      return null
    }

    await db.systems.add(sys);
    return sys
  } catch (e) {
    console.log('Error saving system:', e);
    return null;
  }
}
