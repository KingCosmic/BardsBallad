import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';

export default async (data: SystemData, name: string) => {
  return produce(data, draft => {
    if (!draft.actions) draft.actions = []

    const index = draft.actions.findIndex(a => a.name === name)

    if (index === -1) return

    draft.actions.splice(index, 1)
  })
}
