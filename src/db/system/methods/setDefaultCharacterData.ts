import { produce } from 'immer';
import { SystemData } from '../schema';

export default async (data: SystemData, newData: { [key: string]: any }) => {
  return produce(data, draft => {
    draft.defaultCharacterData = newData
  })
}
