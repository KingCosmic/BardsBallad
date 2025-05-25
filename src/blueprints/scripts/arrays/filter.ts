import { Node } from '@xyflow/react'
import BlueprintProcessor from '@utils/Blueprints/processBlueprint'

export default {
  init: (processor: BlueprintProcessor, node: Node) => {
    const state = processor.nodeState.get(node.id)!

    state.set('currentIndex', 0)
    state.set('maxIndex', processor.getParam(node.id, 'input').length - 1)
    state.set('newArray', [])
    processor.setParam(node.id, 'filterd', [])
  },
  process: (processor: BlueprintProcessor, node: Node) => {
    const state = processor.nodeState.get(node.id)!

    const currentIndex = state.get('currentIndex')
    const inputArray = processor.getParam(node.id, 'input')

    if (currentIndex !== 0) {
      const filtered = processor.getParam(node.id, 'filtered?')

      if (filtered) {
        const newArray = [ ...state.get('newArray'), inputArray[currentIndex - 1] ]
        state.set('newArray', newArray)
        processor.setParam(node.id, 'filterd', newArray)
      }
    }

    if (currentIndex > state.get('maxIndex')) {
      return processor.getConnectingNodeForHandle(node, 'completed', 'output')
    }

    processor.setParam(node.id, 'output', inputArray[currentIndex])

    state.set('currentIndex', currentIndex + 1)

    return processor.getConnectingNodeForHandle(node, 'loop', 'output')
  }
}
