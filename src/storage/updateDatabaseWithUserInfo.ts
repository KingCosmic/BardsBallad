import { db } from '.'
import { type Character } from './schemas/character'
import { System } from './schemas/system'
import { UserSubscription } from './schemas/userSubscription'
import { VersionedResource } from './schemas/versionedResource'

export async function updateDatabaseWithUserInfo(user_id: string, device_id: string) {
  // grab local documents.
  const characters = await db.characters.toArray()
  const systems = await db.systems.toArray()
  const subscriptions = await db.subscriptions.toArray()
  const versions = await db.versions.toArray()

  const charCache = new Map<string, string>()
  const subCache = new Map<string, string>()
  const versCache = new Map<string, string>()
  const sysCache = new Map<string, string>()
  
  // These are updated docs (user_id, and local_id are updated. to reflect the user authentication.)
  let updatedChars: Character[] = []
  characters.forEach((char) => {
    const [char_device_id, ...old_uuid] = char.local_id.split('-')

    if (char.user_id !== 'none' || char_device_id !== 'none') {
      return
    }

    const newId = `${device_id}-${old_uuid.join('-')}`

    charCache.set(char.local_id, newId)

    updatedChars.push({
      ...char,
      user_id: user_id,
      local_id: newId,
    })
  })

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

    const newId = `${device_id}-${old_uuid.join('-')}`

    sysCache.set(sys.local_id, newId)

    updatedSystems.push({
      ...sys,
      user_id: user_id,
      local_id: newId,
    })
  })

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

    const newId = `${device_id}-${old_uuid.join('-')}`

    versCache.set(vers.local_id, newId)

    updatedVersions.push({
      ...vers,
      user_id: user_id,
      local_id: newId,
    })
  })
  
  /* Subscriptions */

  // These are updated docs (user_id, and local_id are updated. to reflect the user authentication.)
  let updatedSubscriptions: UserSubscription[] = []
  subscriptions.forEach((sub) => {
    const [sub_device_id, ...old_uuid] = sub.local_id.split('-')

    // if a subscription lacks a userid it was made locally
    const lacksUserId = (sub.user_id === 'none')

    // these are versions that shouldn't be on this system anyways.
    if (!lacksUserId) {
      return
    }

    const newId = `${device_id}-${old_uuid.join('-')}`

    subCache.set(sub.local_id, newId)

    updatedSubscriptions.push({
      ...sub,
      user_id: user_id,
      local_id: newId,
    })
  })

  // TODO: loop over new data and update references...
  updatedChars = updatedChars.map(char => ({
    ...char,
    system: { local_id: sysCache.get(char.system.local_id)!, version_id: versCache.get(char.system.version_id)! }
  }))

  // Systems may need to be added at some point.

  // These TODOS may become useless once we make the client make sure id's are completely unique across tables (since versions may reference different tables.)
  // TODO: update this to grab new id based off resource_type.
  updatedSubscriptions = updatedSubscriptions.map(sub => ({
    ...sub,
    resource_id: sysCache.get(sub.resource_id)!,
    version_id: versCache.get(sub.version_id)!
  }))

  // TODO: update this to grab new id based off reference_type.
  updatedVersions = updatedVersions.map(ver => ({
    ...ver,
    reference_id: sysCache.get(ver.reference_id)!
  }))

  await db.subscriptions.clear()
  await db.versions.clear()
  await db.systems.clear()
  await db.characters.clear()

  await db.characters.bulkPut(updatedChars)
  await db.systems.bulkPut(updatedSystems)
  await db.versions.bulkPut(updatedVersions)
  await db.subscriptions.bulkPut(updatedSubscriptions)
}