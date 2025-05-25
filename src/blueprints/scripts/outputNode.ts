import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'
import { Param } from '@blueprints/utils'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const { name } = node.data.param as Param

    const output = processor.getParam(node.id, name)

    processor.setOutput(output)
  }
}
