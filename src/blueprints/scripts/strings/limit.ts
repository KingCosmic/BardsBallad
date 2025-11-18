import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const input = processor.getParam(node.id, 'input') as string
    const length = node.data.limitLength as number

    processor.setParam(node.id, 'output', input.slice(0, length))

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}
