import { produce } from 'immer';
import { SystemData, TypeData } from '@storage/schemas/system';

export default async (data: SystemData, pageType: 'character' | 'builder' | 'modal', pageName: string, oldName: string, state: { name: string, type: TypeData, value: any }) => {
  return produce(data, draft => {
    const pages = (pageType === 'character') ? draft.pages : (pageType === 'builder') ? draft.creator : draft.modals

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]

      if (page.name !== pageName) continue

      const index = page.state.findIndex((s => s.name === oldName))

      if (index === -1) return

      if (oldName !== state.name) {
        page.state.splice(index, 1)
        page.state.push(state)
      } else {
        page.state[index] = state
      }
    }
  })
}
