import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const number = processor.getParam(node.id, 'input') as number

    processor.setParam(node.id, 'output', number.toString())

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}
