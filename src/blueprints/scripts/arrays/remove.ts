import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const baseArray = processor.getParam(node.id, 'base') as any[]
    const name = processor.getParam(node.id, 'name') as string

    const index = baseArray.findIndex(i => i.name === name)

    let newArray = baseArray.concat()

    if (index !== -1) {
      newArray.splice(index, 1)
    }

    processor.setParam(node.id, 'output', newArray)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}

