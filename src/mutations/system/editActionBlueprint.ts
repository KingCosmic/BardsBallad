import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';
import { BlueprintData } from '@/types/blueprint';

export default async (data: SystemData, name: string, blueprint: BlueprintData) => {
  return produce(data, draft => {
    if (!draft.actions) draft.actions = []

    const index = draft.actions.findIndex(a => a.name === name)

    if (index === -1) return

    draft.actions[index].blueprint = blueprint
  })
}
