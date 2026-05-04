import get from '@/utils/object/get'
import set from '@/utils/object/set'
import { ensureArrayAtPath } from '@/utils/object/ensureArrayAtPath'
import { Effect } from '@/db/character/schema'

export default (target: any, effect: Effect) => {
  const { type, target: path, value } = effect

  switch (type) {
    case "set": {
      set(target, path, value)
      break
    }

    case "add": {
      const current = get(target, path)

      const next = (typeof current === "number" ? current : 0) + value
      set(target, path, next)
      break
    }

    case "push": {
      const arr = ensureArrayAtPath(target, path)
      arr.push(value)
      break
    }

    case "push_unique": {
      const arr = ensureArrayAtPath(target, path)

      // assume objects with id, fallback to primitive compare
      const exists = arr.some((item: any) => {
        if (item && value && item.id && value.id) {
          return item.id === value.id
        }
        return item === value
      })

      if (!exists) {
        arr.push(value)
      }

      break
    }

    default:
      console.warn("Unknown effect type:", type)
  }
}