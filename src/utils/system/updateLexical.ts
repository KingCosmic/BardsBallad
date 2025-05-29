import { produce } from 'immer';
import { editorState } from '../../state/editor';

import lz from 'lzutf8';
import { SystemData } from '../../storage/schemas/system';

export default async (data: SystemData, lexical: string) => {
  if (lexical === '{}') return
  
  const newLexical = lz.encodeBase64(lz.compress(lexical))

  const editor = editorState.get()

  return produce(data, draft => {
    const pages = (editor.tab === 'editor') ? draft.pages : (editor.tab === 'creator') ? draft.creator : draft.modals
    const pageName = (editor.tab === 'editor') ? editor.characterPage : (editor.tab === 'creator') ? editor.creatorPage : editor.modalsPage

    const index = pages.findIndex(d => d.name === pageName)

    if (index === -1) return

    pages[index].lexical = newLexical
  })
}