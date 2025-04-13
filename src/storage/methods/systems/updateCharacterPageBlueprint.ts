import { BlueprintData } from '../../../types/blueprint';
import updateSystem from './updateSystem';

export default async (local_id: string, page: string, blueprint: BlueprintData) => {
  await updateSystem(local_id, (draft) => {
    const index = draft.pages.findIndex((data => data.name === page))

    if (index === -1) return
    
    draft.pages[index].blueprint = blueprint
  })
}