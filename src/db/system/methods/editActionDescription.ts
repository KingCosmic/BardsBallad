import { produce } from 'immer';
import { SystemData } from '../schema';

export default async (data: SystemData, name: string, description: string) => {
  return produce(data, draft => {
    if (!draft.actions) draft.actions = []

    const index = draft.actions.findIndex(a => a.name === name)

    if (index === -1) return

    draft.actions[index].description = description
  })
}
