import VersionSchema from '@/db/version/schema'
import { db } from '@/db'

import { authState } from '@/state/auth'
import generateUniqueID from '@/utils/db/generateUniqueID'
import z from 'zod'

type Types = 'system' | 'datapack'

export default async (reference_type: Types, reference_id: string, data: any) => {
  try {
    const local_id = generateUniqueID()

    const { user } = authState.get()
    
    const user_id = user?.id || 'none'


    const versionData = {
      local_id,
      user_id,

      data,
      reference_id,
      reference_type,
    
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    const result = VersionSchema.safeParse(versionData);
    if (!result.success) {
      console.log('Invalid subscription data:', z.treeifyError(result.error));
      return;
    }

    await db.versions.add(versionData);
    return versionData
  } catch (e) {
    console.log('Error creating subscription:', e);
  }
}
