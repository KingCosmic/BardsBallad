import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'
import { SystemData, type TypeData } from '@storage/schemas/system'
import getRandomDataFromType from '@utils/getRandomDataFromType'
import { VersionedResource } from '@storage/schemas/versionedResource'

function generateDefaultData(system: SystemData, typeDef: TypeData) {

  const isBaseType = ['string', 'number', ].includes(typeDef.type)

  if (isBaseType) return getRandomDataFromType(system.types, typeDef)

  if (typeDef.isArray) return []

  const type = system.types.find(t => t.name === typeDef.type)

  if (!type) return undefined

  let exampleData: { [key:string]: any } = {
    _type: {
      ...type
    }
  }

  for (let i = 0; i < type.properties.length; i++) {
    const prop = type.properties[i]

    let options = prop.typeData

    exampleData[prop.key] = getRandomDataFromType(system.types, options)
  }

  return exampleData
}

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const page = processor.getPage()

    const state = page.state.find((d: any) => d.name === (node.data.chosenState as any).name)

    if (!state) return

    const value = state.value ?? generateDefaultData(processor.getSystem(), state.type)

    processor.setParam(node.id, (node.data.chosenState as any).name,  value)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}
