import { type TypeData } from '../../../newstorage/schemas/system'
import updateSystem from './updateSystem';

export default async (local_id: string, pageName: string, key: string, type: TypeData) => {
  await updateSystem(local_id, (draft) => {
    const index = draft.pages.findIndex((data => data.name === pageName))

    if (index === -1) return

    if (draft.pages[index].state.find(state => state.name === key)) return

    draft.pages[index].state.push({
      name: key,
      type,
      value: undefined
    })
  })
}