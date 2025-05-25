import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const input = processor.input

    for (let key in input) {
      const val = input[key]

      processor.setParam(node.id, key, val)
    }

    return processor.getConnectingNodeForHandle(node, 'start', 'output')
  }
}
