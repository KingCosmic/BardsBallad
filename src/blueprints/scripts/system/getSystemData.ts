import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const system = processor.getSystem()

    const value = system.data.find(d => d.name === node.data.path)
    
    processor.setParam(node.id, 'output',  value?.data)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}
