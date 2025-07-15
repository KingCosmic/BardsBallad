import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';

export default async (data: SystemData, pageType: 'character' | 'builder' | 'modal', oldName: string, newName: string) => {
  return produce(data, draft => {
    const pages = (pageType === 'character') ? draft.pages : (pageType === 'builder') ? draft.creator : draft.modals

    const page = pages.find(data => data.name === oldName)

    if (!page) return

    page.name = newName
  })
}
