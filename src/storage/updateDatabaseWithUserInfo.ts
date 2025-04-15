import { db } from '.'
import { type Character } from './schemas/character'

export async function updateDatabaseWithUserInfo(user_id: string, device_id: string) {
  // grab local documents.
  const characters = await db.characters.toArray()
  const systems = await db.systems.toArray()
  
  // These are docs that are synced to a different userid somehow (idk how we would hit this, but here it is.)
  let charsToRemove: string[] = []
  // These are updated docs (user_id, and local_id are updated. to reflect the user authentication.)
  let updatedChars: Character[] = []
  characters.forEach((char) => {
    const [char_device_id, _snowflake] = char.local_id.split('-')

    if (char.user_id !== 'none' || char_device_id !== 'none') {
      return charsToRemove.push(char.local_id)
    }

    updatedChars.push({
      ...char,
      user_id: user_id,
      local_id: `${device_id}-${char.local_id}`,
    })
  })

  // remove old characters.
  await db.characters.bulkDelete(charsToRemove)
  // update characters.
  await db.characters.bulkPut(updatedChars)

  // TODO: do the same thing to systems. though idk how to check if they need to be deleted since user_id or device_id could be from a different user but
  // this user has subscribed to the system. so we need to check if the system is in the list of subscribed systems.
}