import VersionedResourceSchema from '@storage/schemas/versionedResource'
import { db } from '@/storage'

import { v4 as uuidv4 } from 'uuid'
import { AuthStorage } from '@lib/storage'
import { authState } from '@state/auth'
import ensureUniqueness from '@utils/db/ensureIdUniqueness'
import generateLocalId from '@utils/generateLocalId'

type Types = 'system' | 'character'

export default async (reference_type: Types, reference_id: string, data: any) => {
  try {
    let local_id = await generateLocalId()

    while (!await ensureUniqueness(local_id)) {
      local_id = await generateLocalId()
    }

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

    const result = VersionedResourceSchema.safeParse(versionData);
    if (!result.success) {
      console.log('Invalid subscription data:', result.error.format());
      return;
    }

    await db.versions.add(versionData);
    return versionData
  } catch (e) {
    console.log('Error creating subscription:', e);
  }
}
