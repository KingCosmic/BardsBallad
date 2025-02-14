import { Node } from '@xyflow/react'
import BlueprintProcessor from '../../../utils/Blueprints/processBlueprint'
import setNestedProperty from '../../../utils/setNestedProperty'

import { CharacterData } from '../../../state/character'
import { produce } from 'immer'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const characterData = processor.getCharacter()

    const data = processor.getParam(node.id, 'input')

    const newCharacter = produce(characterData, (draft) => setNestedProperty(draft, `data/${node.data.path}`, data) as CharacterData)

    processor.setCharacter(newCharacter)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}