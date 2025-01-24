import { useEditor, Element } from '@craftjs/core'

import React, { useState } from 'react'
import { getDefaultNodes } from '../../blueprints/utils'
import FAB from '../../designer/FloatingActionButton'
import Text from '../../designer/components/Text'
import Searchbar from '../../designer/Searchbar'
import EditPageStateModal from '../../modals/EditPageState'
import { editorState, setPage } from '../../state/editor'
import { systemState, addPageState, addPage, updatePageName, deletePage } from '../../state/system'
import { TypeData } from '../../state/systems'
import Divider from '../Divider'
import DesignerDivider from '../../designer/components/Divider'
import EditStringModal from '../../modals/EditString'
import Container from '../../designer/components/Container'
import Layers from '../../designer/Layers/Layers'
import Select from '../inputs/Select'
import Button from '../inputs/Button'


function DesignerMenu() {
  const system = systemState.useValue()
  const editor = editorState.useValue()

  const [tab, setTab] = useState('components')

  const [editingState, setEditingState] = useState<{ name: string, type: TypeData } | null>(null)

  const [editName, setEditName] = useState<any>(null)

  const { connectors } = useEditor()

  const { selected, actions } = useEditor((state, query) => {
    const [currentNodeId] = state.events.selected
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings: state.nodes[currentNodeId].related && state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable()
      }
    }

    return { selected }
  })

  if (!system) return <></>

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Select id='page' label='Page' value={editor.page} onChange={setPage}>
          {system.pages.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
        </Select>

        <button type='button' onClick={addPage} className='ml-2 text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500'>
          <svg
            className='w-5 h-5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 18 18'>
            <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 1v16M1 9h16' />
          </svg>
          <span className='sr-only'>Add Page</span>
        </button>
      </div>

      <Select id='designer-tab' label='' value={tab} onChange={setTab}>
        <option value='components'>Components</option>
        <option value='details'>Details</option>
        <option value='state'>Page Info</option>
      </Select>

      <p className='mb-3'>
        This Tooling is still under heavy development, Please post any bugs on github or discord.
      </p>

      {
        (tab === 'components') ? (
          <>
            <h4>Components</h4>
            <Divider />
            <div className='flex flex-wrap justify-center mx-auto lg:w-full md:w-5/6 xl:shadow-small-blue'>
              <div className='block w-1/2 py-5 text-center border' ref={ref => connectors.create(ref!, <Element is={Container} canvas />)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 block mx-auto" viewBox="0 0 512 512"><path d="M448 341.37V170.61A32 32 0 00432.11 143l-152-88.46a47.94 47.94 0 00-48.24 0L79.89 143A32 32 0 0064 170.61v170.76A32 32 0 0079.89 369l152 88.46a48 48 0 0048.24 0l152-88.46A32 32 0 00448 341.37z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M69 153.99l187 110 187-110M256 463.99v-200"/></svg>

                <p className='pt-2 text-sm font-medium capitalize font-body text-white lg:text-lg md:text-base md:pt-4'>
                  Container
                </p>
              </div>

              <div className='block w-1/2 py-5 text-center border' ref={ref => connectors.create(ref!, <Text text='Hi World' />)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 block mx-auto" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M32 415.5l120-320 120 320M230 303.5H74M326 239.5c12.19-28.69 41-48 74-48h0c46 0 80 32 80 80v144"/><path d="M320 358.5c0 36 26.86 58 60 58 54 0 100-27 100-106v-15c-20 0-58 1-92 5-32.77 3.86-68 19-68 58z" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32"/></svg>

                <p className='pt-2 text-sm font-medium capitalize font-body text-white lg:text-lg md:text-base md:pt-4'>
                  Text
                </p>
              </div>

              <div className='block w-1/2 py-5 text-center border' ref={ref => connectors.create(ref!, <Searchbar placeholder='Search...' blueprint={{ nodes: getDefaultNodes([
                    {
                      name: 'searchText',
                      type: 'string',
                      isArray: false
                    }
                  ]), edges: [] }} />)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 block mx-auto" viewBox="0 0 512 512"><path d="M221.09 64a157.09 157.09 0 10157.09 157.09A157.1 157.1 0 00221.09 64z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeMiterlimit="10" strokeWidth="32" d="M338.29 338.29L448 448"/></svg>

                <p className='pt-2 text-sm font-medium capitalize font-body text-white lg:text-lg md:text-base md:pt-4'>
                  Searchbar
                </p>
              </div>

              <div className='block w-1/2 py-5 text-center border' ref={ref => connectors.create(ref!, <DesignerDivider />)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 block mx-auto" viewBox="0 0 512 512"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M400 256H112"/></svg>

                <p className='pt-2 text-sm font-medium capitalize font-body text-white lg:text-lg md:text-base md:pt-4'>
                  Divider
                </p>
              </div>

              <div className='block w-1/2 py-5 text-center border' ref={ref => connectors.create(ref!, <FAB isList={false} buttons={[]} blueprint={{ nodes: getDefaultNodes(), edges: [] }} />)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 block mx-auto" viewBox="0 0 512 512"><path d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z" fill="none" stroke="currentColor" strokeMiterlimit="10" strokeWidth="32"/><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="32" d="M256 176v160M336 256H176"/></svg>

                <p className='pt-2 text-sm font-medium capitalize font-body text-white lg:text-lg md:text-base md:pt-4'>
                  FaB
                </p>
              </div>
            </div>
          </>
        ) : (tab === 'details' && selected) ? (
          <>
            {selected.settings && React.createElement(selected.settings)}

            {selected.isDeletable ? (
              <Button className='mt-4' color='danger' onClick={() => {
                actions.delete(selected.id)
              }}>
                Delete
              </Button>
            ) : null}
          </>
        ) : (tab === 'state') ? (
          <>
            <EditStringModal data={editName} isOpen={editName !== null}
              requestClose={() => setEditName(null)}
              onSave={(newName) => {
                updatePageName(editName, newName)
                setPage(newName)
              }}
            />

            <div className='inline-flex rounded-md shadow-sm my-2'>
              <Button color='danger' disabled={system.pages.length <= 1} onClick={() => {
                deletePage(editor.page)
              }}>
                Delete
              </Button>

              <Button color='primary' onClick={() => setEditName(editor.page)}>Rename</Button>
            </div>

            <div className='flex items-center justify-between my-2 px-2'>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <h5 style={{ marginRight: 5 }}>Page State</h5>
              </div>

              <button onClick={() => addPageState(editor.page, 'newState', { type: 'string', isArray: false, useTextArea: false, options: [] })}
                type='button'
                className='text-blue-700 border border-blue-700 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2.5 text-center inline-flex items-center me-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 dark:hover:bg-blue-500'
              >
                <svg
                  className='w-4 h-4' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 18 18'>
                  <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 1v16M1 9h16' />
                </svg>
                <span className='sr-only'>Add Page State</span>
              </button>
            </div>

            <Divider />

            <div>
              {system.pages.find(p => p.name === editor.page)?.state.map((state) => (
                <div key={state.name} onClick={() => setEditingState(state)}>
                  <p>{state.name} | {state.type.type}{state.type.isArray ? '[]': ''}</p>
                </div>
              ))}
            </div>

            <EditPageStateModal isOpen={editingState !== null} requestClose={() => setEditingState(null)} data={editingState} />
          </>
        ) : null
      }

      {(tab !== 'state') ? <Layers /> : null}
    </>
  )
}

export default DesignerMenu