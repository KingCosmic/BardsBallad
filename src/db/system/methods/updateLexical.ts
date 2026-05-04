import { editorState } from '@/state/editor';
import * as automerge from '@automerge/automerge'

import { SystemData } from '../schema';

export default (doc: automerge.next.Doc<SystemData>, lexical: unknown) => {
  const editor = editorState.get()

  return automerge.change(doc, draft => {
    const pages = (editor.tab === 'editor') ? draft.pages : (editor.tab === 'creator') ? draft.creator : draft.modals
    const pageName = (editor.tab === 'editor') ? editor.characterPage : (editor.tab === 'creator') ? editor.creatorPage : editor.modalsPage

    const index = pages.findIndex(d => d.name === pageName)

    if (index === -1) return

    pages[index].lexical = lexical
  })
}
