import { editorState } from '../../../state/editor';
import { BlueprintData } from '../../../types/blueprint';
import updateSystem from './updateSystem';

export default async (local_id: string, blueprint: BlueprintData) => {
  const editor = editorState.get()

  await updateSystem(local_id, (draft) => {
    const index = draft.creator.findIndex((data => data.name === editor.creatorPage))

    if (index === -1) return
    
    draft.creator[index].blueprint = blueprint
  })
}