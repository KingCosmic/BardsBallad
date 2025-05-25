import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const param = processor.getParam(node.id, 'input') as boolean

    if (param) return processor.getConnectingNodeForHandle(node, 'true', 'output')

    return processor.getConnectingNodeForHandle(node, 'false', 'output')
  }
}
