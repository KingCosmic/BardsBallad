import { produce } from 'immer'
import { PageData, SystemData, type TypeData } from '@storage/schemas/system'

export default async (data: SystemData, pageType: 'character' | 'builder' | 'modal', pageName: string, key: string, type: TypeData) => {
  return produce(data, (draft) => {
    const pages = (pageType === 'character') ? draft.pages : (pageType === 'builder') ? draft.creator : draft.modals

    const index = pages.findIndex((data => data.name === pageName))

    if (index === -1) return

    if (pages[index].state.find(state => state.name === key)) return

    let newState = {
      name: key,
      type,
      value: undefined
    }

    pages[index].state.push(newState)
  })
}
