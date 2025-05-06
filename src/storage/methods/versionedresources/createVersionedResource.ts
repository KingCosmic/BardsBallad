import VersionedResourceSchema from '../../schemas/versionedResource'
import { db } from '../../index'

import { v4 as uuidv4 } from 'uuid'
import { AuthStorage } from '../../../lib/storage'

type Types = 'system' | 'character' | 'module' | 'plugin'

export default async (reference_type: Types, reference_id: string, version: string, data: any) => {
  try {
    const device_id = await AuthStorage.get('deviceId') || 'none'

    // validate character format.
    const versionData = {
      local_id: `${device_id}-${uuidv4()}`,
    
      version,
      data,
      reference_id,
      reference_type,
    
      updated_at: new Date().toISOString(),
      deleted_at: null,
    }

    if (true) {
      const result = VersionedResourceSchema.safeParse(versionData);
      if (!result.success) {
        console.log('Invalid subscription data:', result.error.format());
        return;
      }
    }

    await db.versions.add(versionData);
    return versionData
  } catch (e) {
    console.log('Error creating subscription:', e);
  }
}