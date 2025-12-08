import { produce } from 'immer';
import { Script } from '@/types/script';
import { SystemData } from '../schema';

export default async (data: SystemData, name: string, script: Script) => {
  return produce(data, draft => {
    if (!draft.actions) draft.actions = []

    const index = draft.actions.findIndex(a => a.name === name)

    if (index === -1) return

    draft.actions[index].script = script
  })
}
