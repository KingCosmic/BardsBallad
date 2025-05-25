import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';

export default async (data: SystemData, type: 'character' | 'builder', oldName: string, newName: string) => {
  return produce(data, draft => {
    const pages = (type === 'character') ? draft.pages : draft.creator

    const index = pages.findIndex(data => data.name === oldName)

    if (index !== -1) return

    if (type === 'character') {
      draft.pages[index].name = newName
    } else if (type === 'builder') {
      draft.creator[index].name = newName
    }
  })
}
