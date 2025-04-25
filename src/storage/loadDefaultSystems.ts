import dnd5eData from '../lib/backup-dnd5e.json'
import { db } from '.'

import { v4 as uuidv4 } from 'uuid'

import baseData from '../lib/newsystemschema/system.json'
import versionData from '../lib/newsystemschema/systemversion.json'

export async function loadDefaultSystems() {

  if ((await db.subscriptions.toArray()).length > 0) return

  try {
    // Insert all default systems
    await db.subscriptions.add({
      local_id: `none-${uuidv4()}`,
    
      user_id: 'none',
    
      resource_type: 'system',
      resource_id: baseData.local_id,
      subscribedAt: new Date().toISOString(),
      version_id: versionData.local_id,
      autoUpdate: true,
      pinned: false,
    
      deleted_at: null,
    })
    // @ts-ignore
    await db.systems.add(baseData)
    // @ts-ignore
    await db.versions.add(versionData)
    console.log('Default systems loaded successfully')
  } catch (error) {
    console.error('Error loading default systems:', error)
  }
}