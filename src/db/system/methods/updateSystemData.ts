import { produce } from 'immer';
import { SystemData } from '../schema';

export default async (data: SystemData, oldName: string, newData: any) => {
  return produce(data, draft => {
    const index = draft.data.findIndex((data => data.name === oldName))

    if (index === -1) return

    if (oldName !== newData.name) {
      draft.data.splice(index, 1)
      draft.data.push(newData)
    } else {
      draft.data[index] = newData
    }
  })
}
