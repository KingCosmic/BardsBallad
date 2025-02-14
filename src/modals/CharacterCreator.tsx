import { useCallback, useMemo, useState, useEffect } from 'react'

import { PageData, SystemData, systemsState } from '../state/systems'
import TextInput from '../components/inputs/TextInput'
import Select from '../components/inputs/Select'
import Modal from '../components/Modal'
import ModalHeader from '../components/Modal/Header'
import ModalBody from '../components/Modal/Body'
import ModalFooter from '../components/Modal/Footer'
import Button from '../components/inputs/Button'
import RenderEditorData from '../designer/RenderEditorData'

import lz from 'lzutf8'
import { CharacterData } from '../state/character'
import BlueprintProcessor, { BlueprintProcessorState } from '../utils/Blueprints/processBlueprint'

import { deepEqual } from 'fast-equals'

function CharacterCreatorModal(props: any) {
  const systems = systemsState.useValue()

  const [system, setSystem] = useState<SystemData | undefined>(systems[0])

  const [tab, setTab] = useState(0)

  const [characterData, setCharacterData] = useState<CharacterData>({
    id: '',
    ownerID: '',
  
    name: 'Aliza Cartwight',
    data: {},

    system: systems[0],
  
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  const updateState = useCallback((state: BlueprintProcessorState) => {
    const index = state.system.creator.findIndex(c => c.name === state.page.name)
    
    if (
      deepEqual(characterData, state.character) &&
      deepEqual(system, state.system) &&
      deepEqual(state.system.creator[index], state.page)
    ) return

    setCharacterData(state.character)
    setSystem({ ...state.system, creator: state.system.creator.map(c => c.name === state.page.name ? state.page : c )})
  }, [characterData, system, setSystem, setCharacterData])

  const checkIfCanMoveOn = useCallback(() => {
    if (!system) return false

    const creatorPage = system.creator[tab - 1]

    if (!creatorPage) return false

    const processor = new BlueprintProcessor(creatorPage.blueprint)

    const canMoveOn = processor.processBlueprint({}, { character: characterData, system, page: creatorPage }, () => {})

    return !canMoveOn
  }, [system, characterData, tab])

  useEffect(() => {
    setSystem(systems[0])
  }, [systems])

  if (!props.isOpen) return <></>

  if (!system) return (
    <Modal isOpen={props.isOpen} onClose={() => props.setIsOpen(false)}>
      <ModalHeader title='Error grabbing system' onClose={() => props.setIsOpen(false)} />

      <ModalBody>
        <h3>There was an error grabbing a default system, please refresh to load base data or make / import something!</h3>
      </ModalBody>

      <ModalFooter>
        <Button color='primary' onClick={() => props.setIsOpen(false)}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )

  return (
    <Modal isOpen={props.isOpen} onClose={() => props.setIsOpen(false)}>
      <ModalHeader title='Create Character' onClose={() => props.setIsOpen(false)} />

      <ModalBody>
        {tab === 0 && (
          <>
            <TextInput id='character-name' label='Character Name' placeholder='Aliza Cartwight' value={characterData.name} onChange={(name) => setCharacterData({ ...characterData, name })} isValid errorMessage='Names must be unique' />

            <Select id='character-system' label='Tabletop System' value={system.name} onChange={(name) => setSystem(systems.find(s => s.name === name))}>
              {systems.map((sys) => <option key={sys.name} value={sys.name}>{sys.name}</option>)}
            </Select>
          </>
        )}

        {
          system.creator.map((page, i) => <RenderTab key={page.name} page={page} hidden={(i + 1) !== tab} state={{ character: characterData, system, page }} updateState={updateState} />)
        }
      </ModalBody>

      <ModalFooter>
        <nav className='flex flex-grow mr-4' aria-label='Breadcrumb'>
          <ol className='inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse'>
            <li className='inline-flex items-center cursor-pointer' onClick={() => setTab(0)}>
              <p className='inline-flex items-center text-sm font-medium text-neutral-700 hover:text-brand-600 dark:text-neutral-400 dark:hover:text-white'>
                <svg className='w-3 h-3 me-2.5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z'/>
                </svg>
                Basics
              </p>
            </li>
            {system?.creator.map((page, i) => {
              if (tab < (i + 1)) return <></>

              return (
                <li className='cursor-pointer' onClick={() => setTab(i + 1)}>
                  <div className='flex items-center'>
                    <svg className='rtl:rotate-180 w-3 h-3 text-neutral-400 mx-1' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 6 10'>
                      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 9 4-4-4-4'/>
                    </svg>
                    <p className='ms-1 text-sm font-medium text-neutral-700 hover:text-brand-600 md:ms-2 dark:text-neutral-400 dark:hover:text-white'>{page.name}</p>
                  </div>
                </li>
              )
            })}
          </ol>
        </nav>
        
        {(tab > 0) && (
          <Button color='light' onClick={() => setTab(tab - 1)}>
            Back
          </Button>
        )}

        {(tab < (system?.creator.length ?? 0)) ? (
          <Button color='accent' onClick={() => setTab(tab + 1)} disabled={checkIfCanMoveOn()}>
            Next
          </Button>
        ) : (
          <Button color='primary' onClick={() => {
            // createCharacter(name, system)
            setSystem(systems[0])
            props.setIsOpen(false)
          }} disabled={checkIfCanMoveOn()}>
            Create
          </Button>
        )}
      </ModalFooter>
    </Modal>
  )
}

function RenderTab({ page, hidden, state, updateState }: { page: PageData, hidden: boolean, state: BlueprintProcessorState, updateState(state: BlueprintProcessorState): void }) {
  const data = useMemo(() => JSON.parse(lz.decompress(lz.decodeBase64(page.lexical))), [page.lexical])
  const display = useMemo(() => ({ display: hidden ? 'none' : 'block' }), [hidden])

  return (
    <RenderEditorData style={display} data={data} state={state} updateState={updateState} />
  )
}

export default CharacterCreatorModal