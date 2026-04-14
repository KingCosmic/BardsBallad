import ensureUniqueness from "./ensureUniqueID"
import generateLocalID from "./generateLocalID"

export default async () => {
  let id = generateLocalID()
  while (!await ensureUniqueness(id)) {
    id = generateLocalID()
  }

  return id
}