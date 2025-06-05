import { produce } from 'immer';
import { getDefaultNodes } from '@blueprints/utils';
import { PageData, SystemData } from '@storage/schemas/system';

export default async (data: SystemData, pageType: 'character' | 'builder' | 'modal') => {
  return produce(data, (draft) => {
    const pages = (pageType === 'character') ? draft.pages : (pageType === 'builder') ? draft.creator : draft.modals

    const index = pages.findIndex((data => data.name === 'New Page'))

    if (index !== -1) return

    let data: PageData = {
      name: 'New Page',
      blueprint: { nodes: getDefaultNodes(), edges: [] },
      lexical: '',
      state: []
    }

    pages.push(data)
  })
}
