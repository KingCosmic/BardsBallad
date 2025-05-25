import { produce } from 'immer';
import { editorState } from '@state/editor';

import lz from 'lzutf8';
import { SystemData } from '@storage/schemas/system';

export default async (data: SystemData, lexical: string) => {
  if (lexical === '{}') return
  
  const newLexical = lz.encodeBase64(lz.compress(lexical))

  const editor = editorState.get()

  return produce(data, draft => {
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
