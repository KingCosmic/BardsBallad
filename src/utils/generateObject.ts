import { SystemType } from '../state/systems'
import getRandomDataFromType from './getRandomDataFromType'

export default function generateObject(typeDef: SystemType | string) {
  if (typeof typeDef === 'string') return getRandomDataFromType({ type: typeDef })

  let exampleData: { [key:string]: any } = {
    _type: {
      ...typeDef
    }
  }

  for (let i = 0; i < typeDef.properties.length; i++) {
    const prop = typeDef.properties[i]

    let options = prop.typeData

    exampleData[prop.key] = getRandomDataFromType(options)
  }

  return exampleData
}