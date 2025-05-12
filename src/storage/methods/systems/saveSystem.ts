import SystemChema, { type System } from '../../schemas/system'
import { db } from '../../index'

export default async (sys: System): Promise<System | null> => {
  try {
    if (await db.systems.get(sys.local_id)) {
      return null
    }

    const result = SystemChema.safeParse(sys);
    if (!result.success) {
      console.log('Invalid system data:', result.error.format());
      return null
    }

    await db.systems.add(sys);
    return sys
  } catch (e) {
    console.log('Error saving system:', e);
    return null;
  }
}