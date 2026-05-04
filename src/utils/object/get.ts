export default function get(obj: any, path: string) {
  const keys = path.split(".")
  let current = obj

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]

    if (!(key in current)) {
      current[key] = {}
    }

    current = current[key]
  }

  return current[keys[keys.length - 1]]
}