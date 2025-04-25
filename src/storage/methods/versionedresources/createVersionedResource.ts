import VersionedResourceSchema from '../../schemas/versionedResource'
import { db } from '../../index'

import { v4 as uuidv4 } from 'uuid'

type Types = 'system' | 'character' | 'module' | 'plugin'

export default async (reference_type: Types, reference_id: string, version: string, data: any) => {
  try {
    const device_id = localStorage.getItem('deviceId') || 'none'

    // validate character format.
    const versionData = {
      local_id: `${device_id}-${uuidv4()}`,
    
      version,
      data,
      reference_id,
      reference_type,
    
      deleted_at: null,
    }

    // if (process.env.VITE_PUBLIC_VALIDATE_SCHEMA === 'true') {
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