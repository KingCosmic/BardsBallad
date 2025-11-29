

export default function getDefFromProperty(obj: { [key:string]: any }, path: string) {
  if (!path) return undefined;

  const segments = path.split('/')
  const property = segments.pop()

  if (!property) return undefined;

  const parentProperty = segments.reduce((o: { [key:string]: any }, p: string) => {
    // if our object is undefined, just return nothing.
    if (!o) return undefined

    // if we're not an array, just return the next property in the path
    if (!Array.isArray(o)) return o[p]

    // we're in an array, so it's not as simple as just object[property].

    o = o.find(item => item.name === p)

    return o ? o : undefined
  }, obj)

  if (!parentProperty) return undefined

  // check if a property is an object with a _def property.
  // if not, then we need to check parentProperty for the _def property and get the key that matches our property to get its type.

  if ((parentProperty[property] && parentProperty[property]._def)) {
    return parentProperty[property]._def
  } else {
    if (parentProperty._def) return parentProperty._def[property]

    return undefined
  }
}