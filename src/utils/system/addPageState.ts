import { produce } from 'immer'
import { PageData, SystemData, type TypeData } from '../../storage/schemas/system'

export default async (data: SystemData, pageType: 'character' | 'builder', pageName: string, key: string, type: TypeData) => {
  return produce(data, (draft) => {
    let pages: PageData[] = []
    
    if (pageType === 'builder') {
      pages = draft.creator
    } else if (pageType === 'character') {
      pages = draft.pages
    }

    const index = pages.findIndex((data => data.name === pageName))

    if (index === -1) return

    if (pages[index].state.find(state => state.name === key)) return

    let newState = {
      name: key,
      type,
      value: undefined
    }

    if (pageType === 'builder') {
      draft.creator[index].state.push(newState)
    } else if (pageType === 'character') {
      draft.pages[index].state.push(newState)
    }
  })
}