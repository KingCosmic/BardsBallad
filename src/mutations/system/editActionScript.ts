import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';
import { Script } from '@/types/script';

export default async (data: SystemData, name: string, script: Script) => {
  return produce(data, draft => {
    if (!draft.actions) draft.actions = []

    const index = draft.actions.findIndex(a => a.name === name)

    if (index === -1) return

    draft.actions[index].script = script
  })
}
