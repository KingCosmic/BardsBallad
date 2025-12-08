import { SystemType } from '@/db/system/schema'
import getRandomDataFromType from './getRandomDataFromType'

export default function generateObject(types: SystemType[], typeDef: SystemType | string) {
  if (typeof typeDef === 'string') return getRandomDataFromType(types, { type: typeDef, useTextArea: false, isArray: false, options: [], isOutputAnArray: false, inputs: [], outputType: 'none', })

  let exampleData: { [key:string]: any } = {
    _type: typeDef.name
  }

  for (let i = 0; i < typeDef.properties.length; i++) {
    const prop = typeDef.properties[i]

    let options = prop.typeData

    exampleData[prop.key] = getRandomDataFromType(types, options)
  }

  return exampleData
}
