import get from './get'
import set from './set'

export function ensureArrayAtPath(obj: any, path: string): any[] {
  let arr = get(obj, path)

  if (!Array.isArray(arr)) {
    arr = []
    set(obj, path, arr)
  }

  return arr
}