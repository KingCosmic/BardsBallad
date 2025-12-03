

export default function getTypeFromProperty(obj: { [key:string]: any } | null, path: string) {
  if (!obj) return 'unknown'
  if (!path) return 'unknown'

  const segments = path.split('/')
  const property = segments.pop()

  if (!property) return 'unknown'

  const parentProperty = segments.reduce((o: { [key:string]: any }, p: string) => {
    // if our object is undefined just return nothing.
    if (!o) return undefined

    // if we're not an array just return the next property in the path
    if (!Array.isArray(o)) return o[p]

    // we're in an array so it's not as simple as just object[property].

    o = o.find(item => item.name === p)

    return o ? o : undefined
  }, obj)

  if (!parentProperty) return undefined

  // check if property is an object with a _type property.
  // if not then we need to check parentProperty for the _type property and get the key that matches our property to get it's type.

  const def = (parentProperty._type?.properties.find((p: any) => p.key === property))
  if (parentProperty._type && def && def.typeData.type) {
    if (def.typeData.isArray) return `${def.typeData.type}(Array)`

    return def.typeData.type
  }

  return 'unknown'
}