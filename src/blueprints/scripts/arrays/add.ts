import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const baseArray = processor.getParam(node.id, 'base') as any[]
    const newItem = processor.getParam(node.id, 'newItem') as any

    const index = baseArray.findIndex(i => i.name === newItem.name)

    const newArray = (index === -1) ? baseArray.concat([ newItem ]) : baseArray.concat([])

    processor.setParam(node.id, 'output', newArray)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}
