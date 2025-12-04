import { produce } from 'immer';
import { SystemData } from '../schema';

export default async (data: SystemData, pageType: 'character' | 'builder' | 'modal', page: string, script: string) => {
  return produce(data, draft => {
    const pages = (pageType === 'character') ? draft.pages : (pageType === 'builder') ? draft.creator : draft.modals

    const index = pages.findIndex(data => data.name === page)

    if (index === -1) return

    pages[index].script = script
  })
}
