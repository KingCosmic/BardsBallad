import { produce } from 'immer';
import { editorState } from '@state/editor';

import lz from 'lzutf8';
import { SystemData } from '@storage/schemas/system';
import { VersionedResource } from '@storage/schemas/versionedResource';
import { db } from '@storage/index';

export default async (version_id: string, lexical: string) => {
  if (lexical === '{}') return
  
  const newLexical = lz.encodeBase64(lz.compress(lexical))

  const editor = editorState.get()

  const version = await db.versions.get(version_id) as Omit<VersionedResource, 'data'> & { data: SystemData }

  if (!version) return

  return produce(version.data, draft => {
    const pages = (editor.tab === 'editor') ? draft.pages : (editor.tab === 'creator') ? draft.creator : draft.modals
    const pageName = (editor.tab === 'editor') ? editor.characterPage : (editor.tab === 'creator') ? editor.creatorPage : editor.modalsPage

    const index = pages.findIndex(d => d.name === pageName)

    if (index === -1) return

    pages[index].lexical = newLexical
  })
}
