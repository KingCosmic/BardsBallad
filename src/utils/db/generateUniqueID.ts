import ensureUniqueness from "./ensureUniqueID"
import generateLocalID from "./generateLocalID"

export default () => {
  let id = generateLocalID()
  while (!ensureUniqueness(id)) {
    id = generateLocalID()
  }

  return id
}