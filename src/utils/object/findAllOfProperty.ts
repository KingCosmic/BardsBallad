export default function findAllOfProperty(object: { [key:string]: any }, property: string, path: string = '') {
  let mods: { path: string; val: any; }[] = []

  for (let key in object) {
    // ignore special keys.
    if (key.startsWith('_')) continue

    let val = object[key]

    let newPath = (!path) ? key : `${path}/${key}`

    // if this is a modifiers key add the mods to our internal list.
    if (key === property) mods = [ ...mods, ...val.map((v: any) => ({ path: newPath, val: v })) ]

    // otherwise check if it's an object we need to go deeper into.
    if (typeof val !== 'object') continue

    mods = [ ...mods, ...findAllOfProperty(val, property, newPath) ]
  }

  return mods
}