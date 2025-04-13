import { TypeData } from '../../../types/system';
import updateSystem from './updateSystem';

export default async (local_id: string, pageName: string, oldName: string, state: { name: string, type: TypeData, value: any }) => {
  await updateSystem(local_id, (draft) => {
    for (let i = 0; i < draft.creator.length; i++) {
      const page = draft.creator[i]

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