import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';

export default async (data: SystemData, newData: { [key: string]: any }) => {
  return produce(data, draft => {
    draft.defaultCharacterData = newData
  })
}
