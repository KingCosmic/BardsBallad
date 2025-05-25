import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';
import { getDefaultNodes } from '@blueprints/utils';

export default async (data: SystemData, name: string) => {
  return produce(data, draft => {
    if (!draft.actions) draft.actions = []

    if (draft.actions.find(a => a.name === name)) return

    draft.actions.push({
      name,
      description: 'A new action!',
      blueprint: {
        nodes: getDefaultNodes(),
        edges: []
      }
    })
  })
}
