
import { SystemData } from '../schema';
import { change } from '@automerge/automerge';

export default async (data: SystemData, pageType: 'character' | 'builder' | 'modal', oldName: string, newName: string) => {
  return change(data, draft => {
    const pages = (pageType === 'character') ? draft.pages : (pageType === 'builder') ? draft.creator : draft.modals

    const page = pages.find(data => data.name === oldName)

    if (!page) return

    page.name = newName
  })
}
