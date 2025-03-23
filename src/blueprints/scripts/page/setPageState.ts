import { Node } from '@xyflow/react'
import BlueprintProcessor from '../../../utils/Blueprints/processBlueprint'
import { TypeData } from '../../../types/system'
import { produce } from 'immer'

export default {
  process: (processor: BlueprintProcessor, node: Node) => {
    const page = processor.getPage()

    const chosenState = node.data.chosenState as { name: string, type: TypeData } | null

    if (!chosenState) return

    const index = page.state.findIndex(d => d.name === chosenState.name)

    if (index === -1) return

    const data = processor.getParam(node.id, chosenState.name)

    const newPage = produce(page, (draft) => {
      draft.state[index] = { ...draft.state[index], value: data }

      return draft
    })
    
    processor.setPage(newPage)

    return processor.getConnectingNodeForHandle(node, 'next', 'output')
  }
}