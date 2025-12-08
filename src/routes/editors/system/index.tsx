import { useParams } from 'react-router'

import { editorState, setTab } from '@/state/editor'

import React, { useEffect, useMemo } from 'react'
import { useVersionResource } from '@/hooks/versions/useVersionResource'
import { useVersionEdits } from '@/hooks/versions/useVersionEdits'
import { useSystem } from '@/hooks/systems/useSystem'
import { SystemData } from '@/db/system/schema'
import Header from '@/components/n-header'
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

const System: React.FC = () => {
  const { id } = useParams<{ id: string; }>()

  const edits_id = useMemo(() => id ? `${id}|edits` : undefined, [id])

  const original = useVersionResource<SystemData>(id)
  const versionEdits = useVersionEdits<SystemData>(edits_id)
  const system = useSystem(versionEdits?.reference_id)

  const editor = editorState.useValue()

  useEffect(() => {
    if (!edits_id || (edits_id === editor.versionId)) return

    const defaultCharPage = versionEdits?.data.pages[0].name || ''
    const defaultBuilderPage = versionEdits?.data.creator[0].name || ''
    const defaultModal = versionEdits?.data.modals[0].name || ''

    editorState.set((prev) => ({ ...prev, versionId: edits_id, characterPage: defaultCharPage, creatorPage: defaultBuilderPage, modalsPage: defaultModal }))
  }, [edits_id, editor, versionEdits])

  useEffect(() => {
    let changed = false
    let newPages = {
      characterPage: editor.characterPage,
      creatorPage: editor.creatorPage,
      modalsPage: editor.modalsPage
    }

    if (!versionEdits?.data.pages.find(p => p.name === editor.characterPage)) {
      newPages.characterPage = versionEdits?.data.pages[0]?.name || ''
      changed = true
    }

    if (!versionEdits?.data.creator.find(p => p.name === editor.creatorPage)) {
      newPages.creatorPage = versionEdits?.data.creator[0]?.name || ''
      changed = true
    }

    if (!versionEdits?.data.modals.find(p => p.name === editor.modalsPage)) {
      newPages.modalsPage = versionEdits?.data.modals[0]?.name || ''
      changed = true
    }

    if (!changed) return

    editorState.set(prev => ({ ...prev, ...newPages }))
  }, [editor, versionEdits])


  if (!edits_id) return <>id not defined...</>
  if (!original) return <>Loading Original...</>
  if (!versionEdits) return <>Loading Edits...</>
  if (!system) return <>Loading System...</>

  return (
    <div className='flex flex-col h-full overflow-y-scroll'>
      <Header
        title={system.name}
        subtitle={`Version: ${getVisualTextFromVersionID(original.local_id)}`}
        hasSidebar
      >
        <Button size='icon' variant='outline' onClick={() =>
          openModal('save-new-version', ({ id }) => (
            <SaveNewVersion id={id} original={original} edits={versionEdits} edits_id={edits_id} />
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
            <CharacterSchema editsId={edits_id} versionedResource={versionEdits} />
          ) : (editor.tab === 'data') ? (
            <SystemDataEditor editsId={edits_id} versionedResource={versionEdits} />
          ) : (editor.tab === 'types') ? (
            <SystemTypes editsId={edits_id} versionedResource={versionEdits} />
          ) : (editor.tab === 'functions') ? (
            <Functions versionedResource={versionEdits} />
          ) : (editor.tab === 'editor') ? (
            <Editor versionedResource={versionEdits} />
          ) : (editor.tab === 'creator') ? (
            <ComingSoon />
          ) : (editor.tab === 'modals') ? (
            <ComingSoon />
          ) : (editor.tab === 'actions') && (
            <QuickActions editsId={edits_id} versionedResource={versionEdits}  />
          )
        }
      </PageContent>
    </div>
  )
}

export default System