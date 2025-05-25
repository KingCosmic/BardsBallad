import { produce } from 'immer';
import { getDefaultNodes } from '@blueprints/utils';
import { PageData, SystemData } from '@storage/schemas/system';

export default async (data: SystemData, type: 'character' | 'builder') => {
  return produce(data, (draft) => {
    let pages: PageData[] = []

    if (type === 'builder') {
      pages = draft.creator
    } else if (type === 'character') {
      pages = draft.pages
    }

    const index = pages.findIndex((data => data.name === 'New Page'))

    if (index !== -1) return

    let data: PageData = {
      name: 'New Page',
      blueprint: { nodes: getDefaultNodes(), edges: [] },
      lexical: '',
      state: []
    }

    if (type === 'builder') {
      draft.creator.push(data)
    } else if (type === 'character') {
      draft.pages.push(data)
    }
  })
}
