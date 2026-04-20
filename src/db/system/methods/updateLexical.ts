import { db } from '@/db';
import { editorState } from '@/state/editor';
import { produce } from 'immer';
import * as automerge from '@automerge/automerge'

import lz from 'lzutf8';
import { SystemData } from '../schema';

export default (doc: automerge.next.Doc<SystemData>, lexical: string) => {
  if (lexical === '{}') return doc
  
  const newLexical = lz.encodeBase64(lz.compress(lexical))

  const editor = editorState.get()

  console.log(doc)

  return automerge.change(doc, draft => {
    const pages = (editor.tab === 'editor') ? draft.pages : (editor.tab === 'creator') ? draft.creator : draft.modals
    const pageName = (editor.tab === 'editor') ? editor.characterPage : (editor.tab === 'creator') ? editor.creatorPage : editor.modalsPage

    const index = pages.findIndex(d => d.name === pageName)


    console.log(pageName)

    if (index === -1) return

    pages[index].lexical = newLexical
  })
}
