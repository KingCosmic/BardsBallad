import { Node } from '@xyflow/react'
import BlueprintProcessor from '../../../utils/Blueprints/processBlueprint'
import setNestedProperty from '../../../utils/setNestedProperty'
import { characterState, setCurrentCharacter } from '../../../state/character'

import { CharacterData } from '../../../state/character'
import { produce } from 'immer'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const characterData = characterState.get()!

    const data = processor.getParam(node.id, 'input')

    const newCharacter = produce(characterData, (draft) => setNestedProperty(draft, `data/${node.data.path}`, data) as CharacterData)

    setCurrentCharacter(newCharacter)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}