import { produce } from 'immer';
import { SystemData } from '../schema';

export default async (data: SystemData, oldName: string, newName: string) => {
  return produce(data, draft => {
    if (!draft.actions) draft.actions = []

    const index = draft.actions.findIndex(a => a.name === oldName)

    if (index === -1) return

    draft.actions[index].name = newName
  })
}
