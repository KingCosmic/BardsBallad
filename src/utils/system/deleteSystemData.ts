import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';

export default async (data: SystemData, name: string) => {
  return produce(data, draft => {
    const index = draft.data.findIndex(data => data.name === name)

    if (index === -1) return

    draft.data.splice(index, 1)
  })
}
