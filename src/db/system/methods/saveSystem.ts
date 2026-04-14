import { db } from '@/db'
import { Item } from '@/db/shared/schema';
import z from 'zod';

export default async (sys: Item): Promise<Item | null> => {
  try {
    if (await db.docs.get(sys.local_id)) {
      return sys
    }

    await db.docs.add(sys);
    return sys
  } catch (e) {
    console.log('Error saving system:', e);
    return null;
  }
}
