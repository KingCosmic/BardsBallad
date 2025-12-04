import { useParams } from 'react-router'

import { editorState, setTab } from '@/state/editor'

import { Editor as EditorContext } from '@craftjs/core'

import React, { useEffect, useMemo } from 'react'
import { useVersionResource } from '@/hooks/versions/useVersionResource'
import { useVersionEdits } from '@/hooks/versions/useVersionEdits'
import { useSystem } from '@/hooks/systems/useSystem'
import { SystemData } from '@/db/system/schema'
import Container from '@/components/designer/components/Container/Editor'
import EditorSelect from '@/components/designer/components/Select/Editor'
import FAB from '@/components/designer/FloatingActionButton'
import Text from '@/components/designer/components/Text/Editor'
import Input from '@/components/designer/components/Input/Editor'
import Separator from '@/components/designer/components/Divider'
import storeMutation from '@/db/version/methods/storeMutation'
import Header from '@/components/header'
import getVisualTextFromVersionID from '@/utils/misc/getVisualTextFromVersionID'

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

  const resolver = useMemo(() => ({
    Container, Text, Select: EditorSelect, TextInput: Input, FAB, DesignerDivider: Separator
  }), [Container, Text, EditorSelect, Input, FAB, Separator])

  const handleNodeChange = (query: any) => {
    if (!versionEdits) return

    storeMutation(versionEdits.local_id, updateLexical(versionEdits.local_id, query.serialize()))
  }

  if (!edits_id) return <>id not defined...</>
  if (!original) return <>Loading Original...</>
  if (!versionEdits) return <>Loading Edits...</>
  if (!system) return <>Loading System...</>

  return (
    <EditorContext resolver={resolver} onNodesChange={handleNodeChange}>
      <div className='flex flex-col h-full overflow-y-scroll'>
        <Header title={system.name} subtitle={`Version: ${getVisualTextFromVersionID(original.local_id)}`}

          // options={[
          //   {
          //     onClick: () =>
          //       openModal('save-new-version', ({ id }) => (
          //         <SaveNewVersion id={id} original={original} edits={versionEdits} edits_id={edits_id} />
          //       )),
          //     Content: () => <p>Save Version</p>
          //   }
          // ]}

          hasSidebar
        />

        <div className='p-4 sm:mr-64 relative flex flex-col grow'>
          <Select id='tab-selector' label='' value={editor.tab} onChange={setTab}>
            <option value='character'>Character Schema</option>
            <option value='data'>System Data</option>
            <option value='types'>Data Types</option>
            <option value='functions'>Blueprints</option>
            <option value='editor'>Editor UI</option>
            <option value='creator'>Builder UI</option>
            <option value='modals'>Modals</option>
            <option value='actions'>Character Actions</option>
          </Select>

          {
            (editor.tab === 'character') ? (
              <Character editsId={edits_id} versionedResource={versionEdits} />
            ) : (editor.tab === 'data') ? (
              <Data editsId={edits_id} versionedResource={versionEdits} />
            ) : (editor.tab === 'types') ? (
              <Types editsId={edits_id} versionedResource={versionEdits} />
            ) : (editor.tab === 'functions') ? (
              <Functions versionedResource={versionEdits} />
            ) : (editor.tab === 'editor') ? (
              <Editor versionedResource={versionEdits} />
            ) : (editor.tab === 'creator') ? (
              <Creator versionedResource={versionEdits} />
            ) : (editor.tab === 'modals') ? (
              <Modals versionedResource={versionEdits} />
            ) : (editor.tab === 'actions') && (
              <ActionsModal editsId={edits_id} versionedResource={versionEdits}  />
            )
          }
        </div>
      </div>
    </EditorContext>
  )
}

export default System