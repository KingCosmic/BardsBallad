import { produce } from 'immer';
import { SystemData } from '../schema';

export default async (data: SystemData, oldName: string, newName: string) => {
  return produce(data, draft => {
    const index = draft.types.findIndex((type => type.name === oldName))

    if (index === -1) return

    draft.types[index].name = newName
  })
}
