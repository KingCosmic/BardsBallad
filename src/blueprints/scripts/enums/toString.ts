import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const input = processor.getParam(node.id, 'enum') as string

    processor.setParam(node.id, 'output', input)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}
