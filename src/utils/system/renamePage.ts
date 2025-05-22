import { produce } from 'immer';
import { SystemData } from '../../storage/schemas/system';

export default async (data: SystemData, pageType: 'character' | 'builder' | 'modal', oldName: string, newName: string) => {
  return produce(data, draft => {
    const pages = (pageType === 'character') ? draft.pages : (pageType === 'builder') ? draft.creator : draft.modals

    const index = pages.findIndex(data => data.name === oldName)

    if (index !== -1) return

    pages[index].name = newName
  })
}