import { database } from './index'
import dnd5eData from '../lib/backup-dnd5e.json'

export async function loadDefaultSystems() {
  // Check if we already have systems
  const systemCount = await database.systems.count().exec()
  
  if (systemCount > 0) {
    return // Systems already loaded
  }

  // Load default systems
  const defaultSystems = [
    {
      ...dnd5eData
    }
    // Add other default systems here
  ]

  try {
    // Insert all default systems
    await database.systems.bulkInsert(defaultSystems)
    console.log('Default systems loaded successfully')
  } catch (error) {
    console.error('Error loading default systems:', error)
  }
}