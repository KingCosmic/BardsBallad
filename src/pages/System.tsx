import { useEffect } from 'react'

import { useParams } from 'react-router'

import { systemsState } from '../state/systems'
import { setSystem, systemState, updatePageLexical } from '../state/system'

import { editorState, setPage, setTab } from '../state/editor'

import Character from '../tabs/System/Character'
import Data from '../tabs/System/Data'
import Types from '../tabs/System/Types'
import Editor from '../tabs/System/Editor'
import Functions from '../tabs/System/Functions'
import Header from '../components/Header'
import Select from '../components/inputs/Select'
import SystemMenu from '../components/SystemMenu'

import { Editor as EditorContext } from '@craftjs/core'

import Container from '../designer/components/Container'
import Text from '../designer/components/Text'
import FAB from '../designer/FloatingActionButton'
import DesignerDivider from '../designer/components/Divider'
import Searchbar from '../designer/Searchbar'

const System: React.FC = () => {
  const systems = systemsState.useValue()
  const system = systemState.useValue()

  const editor = editorState.useValue()

  const { name } = useParams<{ name: string; }>()

  useEffect(() => {
    const system = systems.find(s => s.name === name)
    setSystem(system)

    if (!system) return

    setPage(system.pages[0].name)
  }, [name, systems])

  if (!system) return <>loading...</>

  return (
    <EditorContext resolver={{ Container, Text, FAB, Searchbar, DesignerDivider }} onNodesChange={(query) => updatePageLexical(query.serialize())}>
      <div className='flex flex-col h-full'>
        <Header title={system.name} />

        <div className='p-4 sm:mr-64 relative flex flex-col flex-grow'>
          <Select id='tab-selector' label='' value={editor.tab} onChange={val => setTab(val)}>
            <option value='character'>Character</option>
            <option value='data'>Data</option>
            <option value='types'>Types</option>
            <option value='functions'>Functions</option>
            <option value='editor'>Editor</option>
          </Select>

          {
            (editor.tab === 'character') ? (
              <Character />
            ) : (editor.tab === 'data') ? (
              <Data />
            ) : (editor.tab === 'types') ? (
              <Types />
            ) : (editor.tab === 'functions') ? (
              <Functions />
            ) : (editor.tab === 'editor') && (
              <Editor />
            )
          }
        </div>

        <SystemMenu />
      </div>
    </EditorContext>
  )
}

export default System
