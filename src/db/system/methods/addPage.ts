import { PageData, SystemData } from '../schema';
import { change } from '@automerge/automerge';

export default async (data: SystemData, pageType: 'character' | 'builder' | 'modal') => {
  return change(data, (draft) => {
    const pages = (pageType === 'character') ? draft.pages : (pageType === 'builder') ? draft.creator : draft.modals

    const index = pages.findIndex((data => data.name === 'New Page'))

    if (index !== -1) return

    let data: PageData = {
      name: 'New Page',
      script: '',
      lexical: '',
      state: []
    }

    pages.push(data)
  })
}
