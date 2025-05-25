import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';
import { BlueprintData } from '@/types/blueprint';

export default async (data: SystemData, pageType: 'character' | 'builder', page: string, blueprint: BlueprintData) => {
  return produce(data, draft => {
    const pages = (pageType === 'character') ? draft.pages : draft.creator

    const index = pages.findIndex(data => data.name === page)

    if (index === -1) return

    if (pageType === 'character') {
      draft.pages[index].blueprint = blueprint
    } else if (pageType === 'builder') {
      draft.creator[index].blueprint = blueprint
    }
  })
}
