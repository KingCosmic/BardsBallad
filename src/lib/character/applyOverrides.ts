import set from '@/utils/object/set'

export default function applyOverrides(obj: any, overrides: { [key:string]: any }) {
  if (!overrides) return obj

  for (const [path, value] of Object.entries(overrides)) {
    set(obj, path, value)
  }

  return obj
}