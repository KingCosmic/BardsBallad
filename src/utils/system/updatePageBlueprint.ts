import { produce } from 'immer';
import { SystemData } from '@storage/schemas/system';
import { BlueprintData } from '@/types/blueprint';

export default async (data: SystemData, pageType: 'character' | 'builder' | 'modal', page: string, blueprint: BlueprintData) => {
  return produce(data, draft => {
    const pages = (pageType === 'character') ? draft.pages : (pageType === 'builder') ? draft.creator : draft.modals

    const index = pages.findIndex(data => data.name === page)

    if (index === -1) return

    pages[index].blueprint = blueprint
  })
}
