import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'
import { openModal } from '@state/modals'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const data = processor.getParam(node.id, 'data')
    const system = processor.getSystem()

    openModal({
      title: node.data.title as string,
      type: node.data.type as string,
      types: system?.types || [],
      data,
      onSave: (data) => {
        processor.setParam(node.id, 'newdata', data)
        processor.processNodes(processor.getConnectingNodeForHandle(node, 'save', 'output'))
      },
      onDelete: () => {
        processor.processNodes(processor.getConnectingNodeForHandle(node, 'delete', 'output'))
      }
    })
  }
}
