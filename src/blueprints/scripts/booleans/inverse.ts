import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const param = processor.getParam(node.id, 'input') as boolean

    processor.setParam(node.id, 'output', !param)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}
