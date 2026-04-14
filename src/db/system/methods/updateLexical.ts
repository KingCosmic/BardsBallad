import { db } from '@/db';
import { VersionedResource } from '@/db/version/schema';
import { editorState } from '@/state/editor';
import { produce } from 'immer';

import lz from 'lzutf8';
import { SystemData } from '../schema';

export default async (version_id: string, lexical: string) => {
  if (lexical === '{}') return
  
  const newLexical = lz.encodeBase64(lz.compress(lexical))

  const editor = editorState.get()

  {/* @ts-expect-error */}
  return produce(version.data, draft => {
    const pages = (editor.tab === 'editor') ? draft.pages : (editor.tab === 'creator') ? draft.creator : draft.modals
    const pageName = (editor.tab === 'editor') ? editor.characterPage : (editor.tab === 'creator') ? editor.creatorPage : editor.modalsPage

    {/* @ts-expect-error */}
    const index = pages.findIndex(d => d.name === pageName)

    if (index === -1) return

    pages[index].lexical = newLexical
  })
}
