import dnd5eData from '../lib/backup-dnd5e.json'
import { db } from '.'

export async function loadDefaultSystems() {
  // Check if we already have systems
  const systemCount = await db.systems.count()
  
  if (systemCount > 0) {
    return // Systems already loaded
  }

  // Load default systems
  const defaultSystems = [
    {
      ...dnd5eData,

      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
    }
    // Add other default systems here
  ]

  try {
    // Insert all default systems
    await db.systems.bulkAdd(defaultSystems)
    console.log('Default systems loaded successfully')
  } catch (error) {
    console.error('Error loading default systems:', error)
  }
}