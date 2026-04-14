import { useParams } from 'react-router'

import { editorState, setTab } from '@/state/editor'

import React, { useEffect, useMemo } from 'react'
import Header from '@/components/header'
import getVisualTextFromVersionID from '@/utils/misc/getVisualTextFromVersionID'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CharacterSchema from './character-schema'
import SystemDataEditor from './system-data'
import SystemTypes from './system-types'
import Functions from './functions'
import Editor from './editor'
import { Button } from '@/components/ui/button'
import { IconDeviceFloppy } from '@tabler/icons-react'
import { openModal } from '@/state/modals'
import SaveNewVersion from '@/modals/editor/save-new-version'
import PageContent from '@/components/page-content'
import ComingSoon from './coming-soon'
import QuickActions from './quick-actions'
import { useSystem } from '@/db/system/hooks/useSystem'
import { useDoc } from '@/db/shared/hooks/useDoc'
import { useAutomergeDoc } from '@/lib/automerge/useAutomergeDoc'
import { SystemData } from '@/db/system/schema'

const System: React.FC = () => {
  const { id } = useParams<{ id: string; }>()

  const edits_id = useMemo(() => id ? `${id}|edits` : '', [id])

  const original = useDoc(id!)
  const edit_item = useDoc(edits_id)
  const { doc, change, save } = useAutomergeDoc<SystemData>(edit_item?.doc)

  const editor = editorState.useValue()

  useEffect(() => {
    if (!edits_id || (edits_id === editor.versionId)) return

    const defaultCharPage = doc?.pages[0].name || ''
    const defaultBuilderPage = doc?.creator[0].name || ''
    const defaultModal = doc?.modals[0].name || ''

    editorState.set((prev) => ({ ...prev, versionId: edits_id, characterPage: defaultCharPage, creatorPage: defaultBuilderPage, modalsPage: defaultModal }))
  }, [edits_id, editor, doc])

  useEffect(() => {
    let changed = false
    let newPages = {
      characterPage: editor.characterPage,
      creatorPage: editor.creatorPage,
      modalsPage: editor.modalsPage
    }

    if (!doc?.pages.find(p => p.name === editor.characterPage)) {
      newPages.characterPage = doc?.pages[0]?.name || ''
      changed = true
    }

    if (!doc?.creator.find(p => p.name === editor.creatorPage)) {
      newPages.creatorPage = doc?.creator[0]?.name || ''
      changed = true
    }

    if (!doc?.modals.find(p => p.name === editor.modalsPage)) {
      newPages.modalsPage = doc?.modals[0]?.name || ''
      changed = true
    }

    if (!changed) return

    editorState.set(prev => ({ ...prev, ...newPages }))
  }, [editor, doc])

  if (!edits_id) return <>id not defined...</>
  if (!original) return <>Loading Original...</>
  if (!doc) return <>Loading Edits...</>

  return (
    <div className='flex flex-col h-full overflow-y-scroll'>
      <Header
        title={doc.name}
        subtitle={`Version: ${getVisualTextFromVersionID(original.local_id)}`}
        hasSidebar
      >
        <Button size='icon' variant='outline' onClick={() =>
          openModal('save-new-version', ({ id }) => (
            <SaveNewVersion id={id} original={original} edits={edit_item!} edits_id={edits_id} doc={doc} />
          ))
        }>
          <IconDeviceFloppy />
        </Button>
      </Header>

      <PageContent>
        <Select value={editor.tab} onValueChange={setTab}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Select Tab' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='character'>Character Schema</SelectItem>
            <SelectItem value='data'>System Data</SelectItem>
            <SelectItem value='types'>Data Types</SelectItem>
            <SelectItem value='functions'>Blueprints</SelectItem>
            <SelectItem value='editor'>Editor UI</SelectItem>
            <SelectItem value='creator'>Builder UI</SelectItem>
            <SelectItem value='modals'>Modals</SelectItem>
            <SelectItem value='actions'>Quick Actions</SelectItem>
          </SelectContent>
        </Select>

        {
          (editor.tab === 'character') ? (
            <CharacterSchema editsId={edits_id} doc={doc} />
          ) : (editor.tab === 'data') ? (
            <SystemDataEditor editsId={edits_id} doc={doc} />
          ) : (editor.tab === 'types') ? (
            <SystemTypes editsId={edits_id} doc={doc} />
          ) : (editor.tab === 'functions') ? (
            <Functions editsId={edits_id} doc={doc} />
          ) : (editor.tab === 'editor') ? (
            <Editor editsId={edits_id} doc={doc} />
          ) : (editor.tab === 'creator') ? (
            <ComingSoon />
          ) : (editor.tab === 'modals') ? (
            <ComingSoon />
          ) : (editor.tab === 'actions') && (
            <QuickActions editsId={edits_id} doc={doc}  />
          )
        }
      </PageContent>
    </div>
  )
}

export default System