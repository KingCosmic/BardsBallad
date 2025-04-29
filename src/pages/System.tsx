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
import { useEffect } from 'react'
import { useVersionResource } from '../hooks/useVersionResource'
import storeMutation from '../storage/methods/versionedresources/storeMutation'

const System: React.FC = () => {
  const { id } = useParams<{ id: string; }>()

  const versionedResource = useVersionResource<any>(id)
  const system = useSystem(versionedResource?.reference_id)

  const editor = editorState.useValue()

  useEffect(() => {
    editorState.set((prev) => ({ ...prev, versionId: id ?? '' }))
  }, [id])

  if (!id || !versionedResource || !system) return <>loading...</>

  return (
    <EditorContext resolver={{ Container, Text, Select: EditorSelect, TextInput, FAB, Searchbar, DesignerDivider }} onNodesChange={(query) => storeMutation(versionedResource.local_id, updateLexical(versionedResource.data, query.serialize()))}>
      <div className='flex flex-col h-full'>
        <Header title={system.name} />

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
              <Character system={system} versionedResource={versionedResource} />
            ) : (editor.tab === 'data') ? (
              <Data system={system} versionedResource={versionedResource} />
            ) : (editor.tab === 'types') ? (
              <Types system={system} versionedResource={versionedResource} />
            ) : (editor.tab === 'functions') ? (
              <Functions system={system} versionedResource={versionedResource} />
            ) : (editor.tab === 'editor') ? (
              <Editor system={system} versionedResource={versionedResource} />
            ) : (editor.tab === 'creator') && (
              <Creator system={system} versionedResource={versionedResource} />
            )
          }
        </div>

        <SystemMenu />
      </div>
    </EditorContext>
  )
}

export default System
