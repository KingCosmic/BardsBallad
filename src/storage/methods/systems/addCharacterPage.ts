import { getDefaultNodes } from '../../../blueprints/utils';
import updateSystem from './updateSystem';

export default async (local_id: string) => {
  await updateSystem(local_id, (draft) => {
    const index = draft.pages.findIndex((data => data.name === 'New Page'))
    
    if (index !== -1) return

    draft.pages.push({
      name: 'New Page',
      blueprint: { nodes: getDefaultNodes(), edges: [] },
      lexical: '',
      state: []
    })
  })
}