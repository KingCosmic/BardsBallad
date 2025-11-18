import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';

export default async (data: SystemData, name: string) => {
  return produce(data, draft => {
    if (!draft.actions) draft.actions = []

    if (draft.actions.find(a => a.name === name)) return

    draft.actions.push({
      name,
      description: 'A new action!',
      script: {
        compiled: '',
        source: '',
        isCorrect: true,
        blueprint: { nodes: [], edges: [] }
      }
    })
  })
}
