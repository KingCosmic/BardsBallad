import { db } from '.'
import { type Character } from './schemas/character'
import { System } from './schemas/system'

export async function updateDatabaseWithUserInfo(user_id: string, device_id: string) {
  // grab local documents.
  const characters = await db.characters.toArray()
  const systems = await db.systems.toArray()
  const subscriptions = await db.subscriptions.toArray()
  
  // These are docs that are synced to a different userid somehow (idk how we would hit this, but here it is.)
  let charsToRemove: string[] = []
  // These are updated docs (user_id, and local_id are updated. to reflect the user authentication.)
  let updatedChars: Character[] = []
  characters.forEach((char) => {
    const [char_device_id, old_snowflake] = char.local_id.split('-')

    if (char.user_id !== 'none' || char_device_id !== 'none') {
      return charsToRemove.push(char.local_id)
    }

    updatedChars.push({
      ...char,
      user_id: user_id,
      local_id: `${device_id}-${old_snowflake}`,
    })
  })

  // remove old characters.
  await db.characters.bulkDelete(charsToRemove)
  // update characters.
  await db.characters.bulkPut(updatedChars)

  // These are docs that are synced to a different userid somehow (idk how we would hit this, but here it is.)
  let systemsToRemove: string[] = []
  // These are updated docs (user_id, and local_id are updated. to reflect the user authentication.)
  let updatedSystems: System[] = []
  systems.forEach((sys) => {
    const [char_device_id, old_snowflake] = sys.local_id.split('-')

    // if a system lacks a userid it was made locally (or possibly imported from another not signed in account)
    // but we consider that the same thing here.
    const lacksUserId = (sys.user_id === 'none')
    const subscribedTo = (subscriptions.find(sub => sub.resource_id === sys.local_id))

    if (!lacksUserId && !subscribedTo) {
      return systemsToRemove.push(sys.local_id)
    }

    updatedSystems.push({
      ...sys,
      user_id: user_id,
      local_id: `${device_id}-${old_snowflake}`,
    })
  })


  await db.systems.bulkDelete(systemsToRemove)
  await db.systems.bulkPut(updatedSystems)

  // TODO: do the same thing to systems. though idk how to check if they need to be deleted since user_id or device_id could be from a different user but
  // this user has subscribed to the system. so we need to check if the system is in the list of subscribed systems.
}