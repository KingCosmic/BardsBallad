import { Node } from '@xyflow/react'
import BlueprintProcessor from '../../../utils/Blueprints/processBlueprint'
import getNestedProperty from '../../../utils/getNestedProperty'
import { characterState } from '../../../state/character'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const characterData = characterState.get()!
    const val = getNestedProperty(characterData, `data/${(node.data.path as string)}`)
    
    processor.setParam(node.id, 'output',  val)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}