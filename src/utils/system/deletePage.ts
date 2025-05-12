import { produce } from 'immer';
import { SystemData } from '../../storage/schemas/system';

export default (data: SystemData, type: 'character' | 'builder', name: string) => {
  return produce(data, draft => {
    const pages = (type === 'character') ? draft.pages : draft.creator

    const index = pages.findIndex(data => data.name === name)
    
    if (index !== -1) return

    if (type === 'character') {
      draft.pages.splice(index, 1)
    } else if (type === 'builder') {
      draft.creator.splice(index, 1)
    }
  })
}