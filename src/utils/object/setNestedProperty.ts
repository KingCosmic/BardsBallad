export default function setNestedProperty(obj: { [key:string]: any }, path: string, value: any): { [key:string]: any } {
  // split our property string
  const parts = path.split('/')

  // if we were given an invalid path string just return.
  if (!parts.length) return obj

  // get the last property we're targeting.
  const targetProperty = parts.pop() as string

  // reduce into our target object.
  const target = parts.reduce((o, p) => {
    // if our object is undefined, just return nothing.
    if (!o) return undefined

    // if we're not an array, just return the property in the path.
    if (!Array.isArray(o)) return o[p]

    // we're in an array, so it's not as simple as just object[property].

    o = o.find(item => item.name === p)

    return o ? o : undefined
  }, obj)

  if (!target) return obj

  if (Array.isArray(target)) {
    const index = target.findIndex(v => v.name === targetProperty)

    if (index === -1) return obj

    target[index] = value
  } else {
    target[targetProperty] = value;
  }

  return obj
}