import { produce } from 'immer';
import { SystemData } from '../schema';

export default async (data: SystemData, name: string) => {
  return produce(data, draft => {
    const index = draft.types.findIndex((type => type.name === name)) 

    if (index === -1) return

    draft.types.splice(index, 1)
  })
}
