import { useNavigate, useParams } from 'react-router'

import { editorState, setTab } from '@state/editor'

import Character from '@tabs/System/Character'
import Data from '@tabs/System/Data'
import Types from '@tabs/System/Types'
import Editor from '@tabs/System/Editor'
import Functions from '@tabs/System/Functions'
import Header from '@components/Header'
import Select from '@components/inputs/Select'
import SystemMenu from '@components/SystemMenu'

import { Editor as EditorContext } from '@craftjs/core'

import Container from '@designer/components/Container/Editor'
import Text from '@designer/components/Text/Editor'
import FAB from '@designer/FloatingActionButton'
import DesignerDivider from '@designer/components/Divider'
import Searchbar from '@designer/Searchbar'
import Creator from '@tabs/System/Creator'
import EditorSelect from '@designer/components/Select/Editor'
import TextInput from '@designer/components/Input/Editor'
import { useSystem } from '@hooks/useSystem'
import { updateLexical } from '@utils/system'
import React, { useCallback, useEffect, useMemo } from 'react'
import storeMutation from '@storage/methods/versionedresources/storeMutation'
import { SystemData } from '@storage/schemas/system'
import { useVersionEdits } from '@hooks/useVersionEdits'
import { openModal } from '@state/modals'
import duplicateVersionedResource from '@storage/methods/versionedresources/duplicateVersionedResource'
import createSubscription from '@storage/methods/subscriptions/createSubscription'
import { useVersionResource } from '@hooks/useVersionResource'
import Modals from '@tabs/System/Modals'
import ActionsModal from '@tabs/System/Actions'
import SaveNewVersion from '@modals/SaveNewVersion'

const System: React.FC = () => {
  const { id } = useParams<{ id: string; }>()
  let navigate = useNavigate();

  const edits_id = useMemo(() => id ? `${id}|edits` : undefined, [id])

  const original = useVersionResource<SystemData>(id)
  const versionEdits = useVersionEdits<SystemData>(edits_id)
  const system = useSystem(versionEdits?.reference_id)

  const editor = editorState.useValue()

  useEffect(() => {
    if (!edits_id || (edits_id === editor.versionId)) return

    editorState.set((prev) => ({ ...prev, versionId: edits_id }))
  }, [edits_id, editor])

  const resolver = useMemo(() => ({
    Container, Text, Select: EditorSelect, TextInput, FAB, Searchbar, DesignerDivider
  }), [Container, Text, EditorSelect, TextInput, FAB, Searchbar, DesignerDivider])

  const handleNodeChange = (query: any) => {
    if (!versionEdits) return

    storeMutation(versionEdits.local_id, updateLexical(versionEdits.local_id, query.serialize()))
  }

  if (!edits_id) return <>id not defined...</>
  if (!versionEdits) return <>Loading Edits...</>
  if (!system) return <>Loading System...</>

  return (
    <EditorContext resolver={resolver} onNodesChange={handleNodeChange}>
      <div className='flex flex-col h-full'>
        <Header title={system.name} options={[{
          onClick: () =>
            openModal('save-new-version', ({ id }) => (
              <SaveNewVersion id={id} onSave={async () => {
                const newVersion = await duplicateVersionedResource(versionEdits)

                if (!newVersion) return // TODO:(Cosmic) Show error.

                const newSub = await createSubscription('system', newVersion.reference_id, newVersion.local_id, false)

                if (!newSub) return // TODO:(Cosmic) Show error. and remove new version.

                // I'm not entirely sure how this would happen?
                // possibly a user unsubs from the original but then the ui *shouldn't* allow a user to get into this editing scenario.
                // TODO:(Cosmic) Make sure we clear up edits when unsubbing from a resourec :)
                if (!original) return

                // TODO:(Cosmic) if we want to we could reset the edits back inline with the original (to allow for some versioning incase they wanted to
                // make edits off this version again.) will need to update duplicate function to not care of new_id is taken. and make sure that doesn't collide
                // elsewhere
                // await duplicateVersionedResource(original, edits_id)

                // TODO: show confirmation

                navigate('/library')
              }} />
            )),
          Content: () => <p className='block cursor-pointer py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500'>Save Version</p>
        }]} hasSidebar />

        <div className='p-4 sm:mr-64 relative flex flex-col flex-grow'>
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

        <SystemMenu />
      </div>
    </EditorContext>
  )
}

export default System
