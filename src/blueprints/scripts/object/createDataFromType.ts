import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'
import { type SystemType } from '@storage/schemas/system'
import getRandomDataFromType from '@utils/getRandomDataFromType'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const type = node.data.spreadType as SystemType

    let data: { [key:string]: any } = { _type: type }

    for (let p = 0; p < type.properties.length; p++) {
      const prop = type.properties[p]

      let propData = processor.getParam(node.id, prop.key)

      if (propData === undefined) propData = getRandomDataFromType(processor.getSystem().types, prop.typeData)

      data[prop.key] = propData
    }

    processor.setParam(node.id, 'output', data)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}
