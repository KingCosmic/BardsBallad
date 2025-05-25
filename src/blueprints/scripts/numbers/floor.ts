import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const input = processor.getParam(node.id, 'input') as number

    processor.setParam(node.id, 'output', Math.floor(input))

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}
