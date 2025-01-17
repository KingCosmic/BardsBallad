import { Node } from '@xyflow/react'
import BlueprintProcessor from '../../utils/Blueprints/processBlueprint'
import setNestedProperty from '../../utils/setNestedProperty'
import { CharacterData, characterState } from '../../state/character'
import { characterEditorState } from '../../state/characterEditor'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const characterEditor = characterEditorState.get()!
    const characterData = characterState.get()!

    // @ts-ignore
    characterState.set(setNestedProperty(characterData, `pages/${characterEditor.page}/${node.data.chosenState.name}`, processor.getParam(node.id, 'input')) as CharacterData)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}