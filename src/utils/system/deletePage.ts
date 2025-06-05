import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';

export default (data: SystemData, pageType: 'character' | 'builder' | 'modal', name: string) => {
  return produce(data, draft => {
    const pages = (pageType === 'character') ? draft.pages : (pageType === 'builder') ? draft.creator : draft.modals

    const index = pages.findIndex(data => data.name === name)
    
    if (index === -1) return

    pages.slice(index, 1)
  })
}
