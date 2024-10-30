import getRandomDataFromType from './getRandomDataFromType'

export default function generateObject(typeDef:{ [key:string]: any }) {
  let exampleData: { [key:string]: any } = {
    _def: {}
  }

  const keys = Object.keys(typeDef.properties)

  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]

    let options = typeDef.properties[key]

    if (typeof options === 'string') options = { type: options }

    exampleData._def[key] = options
    exampleData[key] = getRandomDataFromType(options)
  }

  return exampleData
}