import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const param1 = processor.getParam(node.id, 'string1') as string
    const param2 = processor.getParam(node.id, 'string2') as string

    processor.setParam(node.id, 'output', param1 + param2)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}
