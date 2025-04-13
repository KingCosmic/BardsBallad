import { editorState } from '../../../state/editor';
import updateSystem from './updateSystem';

import lz from 'lzutf8';

export default async (local_id: string, tab: string, lexical: string) => {
  const editor = editorState.get()

  if (lexical === '{}') return
  
  const newLexical = lz.encodeBase64(lz.compress(lexical))

  await updateSystem(local_id, (draft) => {
    if (editor.tab === 'editor') {
      const index = draft.pages.findIndex((data => data.name === editor.characterPage))

      if (index === -1) return

      draft.pages[index].lexical = newLexical
    } else if (editor.tab === 'creator') {
      const index = draft.creator.findIndex((data => data.name === editor.creatorPage))

      if (index === -1) return

      draft.creator[index].lexical = newLexical
    }
  })
}