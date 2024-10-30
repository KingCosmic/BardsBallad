

export default function getNestedProperty(obj: { [key:string]: any }, path: string) {
  if (!path) return undefined;

  const segments = path.split('/')

  return segments.reduce((o: { [key:string]: any }, p: string) => {
    // if our object is undefined just return nothing.
    if (!o) return undefined

    // if we're not an array just return the next property in the path
    if (!Array.isArray(o)) return o[p]

    // we're in an array so it's not as simple as just object[property].

    o = o.find(item => item.name === p)

    return o ? o : undefined
  }, obj)
}