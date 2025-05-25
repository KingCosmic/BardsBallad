import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const { value } = node.data

    processor.setParam(node.id, 'output', value)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}
