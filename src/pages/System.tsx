import { useParams } from 'react-router'

import { editorState, setTab } from '../state/editor'

import Character from '../tabs/System/Character'
import Data from '../tabs/System/Data'
import Types from '../tabs/System/Types'
import Editor from '../tabs/System/Editor'
import Functions from '../tabs/System/Functions'
import Header from '../components/Header'
import Select from '../components/inputs/Select'
import SystemMenu from '../components/SystemMenu'

import { Editor as EditorContext } from '@craftjs/core'

import Container from '../designer/components/Container/Editor'
import Text from '../designer/components/Text/Editor'
import FAB from '../designer/FloatingActionButton'
import DesignerDivider from '../designer/components/Divider'
import Searchbar from '../designer/Searchbar'
import Creator from '../tabs/System/Creator'
import EditorSelect from '../designer/components/Select/Editor'
import TextInput from '../designer/components/Input/Editor'
import { useSystem } from '../hooks/useSystem'
import { updateLexical } from '../utils/system'
import { useCallback, useEffect, useMemo } from 'react'
import storeMutation from '../storage/methods/versionedresources/storeMutation'
import { SystemData } from '../storage/schemas/system'
import { useVersionEdits } from '../hooks/useVersionEdits'

const System: React.FC = () => {
  const { id } = useParams<{ id: string; }>()

  const edits_id = useMemo(() => id ? `${id}|edits` : undefined, [id])

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

  const handleNodeChange = useCallback((query: any) => {
    if (!versionEdits) return

    storeMutation(versionEdits.local_id, updateLexical(versionEdits.data, query.serialize()))
  }, [versionEdits, storeMutation, updateLexical])

  if (!edits_id) return <>id not defined...</>
  if (!versionEdits) return <>Loading Edits...</>
  if (!system) return <>Loading System...</>

  return (
    <EditorContext resolver={resolver} onNodesChange={handleNodeChange}>
      <div className='flex flex-col h-full'>
        <Header title={system.name} options={[{
          onClick: () => true,
          Content: () => <a href='#' className='block py-2 px-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500' aria-current='page'>Home</a>
        }]} />

        <div className='p-4 sm:mr-64 relative flex flex-col flex-grow'>
          <Select id='tab-selector' label='' value={editor.tab} onChange={setTab}>
            <option value='character'>Character</option>
            <option value='data'>Data</option>
            <option value='types'>Types</option>
            <option value='functions'>Functions</option>
            <option value='editor'>Editor</option>
            <option value='creator'>Creator</option>
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
            ) : (editor.tab === 'creator') && (
              <Creator versionedResource={versionEdits} />
            )
          }
        </div>

        <SystemMenu />
      </div>
    </EditorContext>
  )
}

export default System
