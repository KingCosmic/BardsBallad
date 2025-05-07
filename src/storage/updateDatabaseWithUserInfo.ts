import { db } from '.'
import { type Character } from './schemas/character'
import { System } from './schemas/system'
import { VersionedResource } from './schemas/versionedResource'

export async function updateDatabaseWithUserInfo(user_id: string, device_id: string) {
  // grab local documents.
  const characters = await db.characters.toArray()
  const systems = await db.systems.toArray()
  const subscriptions = await db.subscriptions.toArray()
  const versions = await db.versions.toArray()
  
  // These are updated docs (user_id, and local_id are updated. to reflect the user authentication.)
  let updatedChars: Character[] = []
  characters.forEach((char) => {
    const [char_device_id, ...old_uuid] = char.local_id.split('-')

    if (char.user_id !== 'none' || char_device_id !== 'none') {
      return
    }

    updatedChars.push({
      ...char,
      user_id: user_id,
      local_id: `${device_id}-${old_uuid.join('-')}`,
    })
  })

  // remove old characters.
  await db.characters.clear()
  // update characters.
  await db.characters.bulkPut(updatedChars)

  // These are updated docs (user_id, and local_id are updated. to reflect the user authentication.)
  let updatedSystems: System[] = []
  systems.forEach((sys) => {
    const [char_device_id, ...old_uuid] = sys.local_id.split('-')

    // if a system lacks a userid it was made locally (or possibly imported from another not signed in account)
    // but we consider that the same thing here.
    const lacksUserId = (sys.user_id === 'none')
    const subscribedTo = (subscriptions.find(sub => sub.resource_id === sys.local_id))

    if (!lacksUserId && !subscribedTo) {
      return
    }

    updatedSystems.push({
      ...sys,
      user_id: user_id,
      local_id: `${device_id}-${old_uuid.join('-')}`,
    })
  })


  await db.systems.clear()
  await db.systems.bulkPut(updatedSystems)

  /* Versions */

  // These are updated docs (user_id, and local_id are updated. to reflect the user authentication.)
  let updatedVersions: VersionedResource[] = []
  versions.forEach((vers) => {
    const [vers_device_id, ...old_uuid] = vers.local_id.split('-')

    // if a system lacks a userid it was made locally (or possibly imported from another not signed in account)
    // but we consider that the same thing here.
    const lacksUserId = (vers.user_id === 'none')
    const subscribedTo = (subscriptions.find(sub => sub.version_id === vers.local_id))

    // these are versions that shouldn't be on this system anyways.
    if (!lacksUserId && !subscribedTo) {
      return
    }

    updatedVersions.push({
      ...vers,
      user_id: user_id,
      local_id: `${device_id}-${old_uuid.join('-')}`,
    })
  })

  await db.versions.clear()
  await db.versions.bulkPut(updatedVersions)
}