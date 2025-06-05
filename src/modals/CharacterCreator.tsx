import { useCallback, useMemo, useState, useEffect } from 'react'

import TextInput from '@components/inputs/TextInput'
import Select from '@components/inputs/Select'
import Modal from '@components/Modal'
import ModalHeader from '@components/Modal/Header'
import ModalBody from '@components/Modal/Body'
import ModalFooter from '@components/Modal/Footer'
import Button from '@components/inputs/Button'
import RenderEditorData from '@designer/RenderEditorData'

import lz from 'lzutf8'
import { Character } from '@storage/schemas/character'
import BlueprintProcessor, { BlueprintProcessorState } from '@utils/Blueprints/processBlueprint'

import { useSystems } from '@hooks/useSystems'
import { useVersions } from '@hooks/useVersions'

import { deepEqual } from 'fast-equals'
import { useCharacters } from '@hooks/useCharacters'

import { createCharacter } from '@storage/methods/characters'
import { type System, type PageData } from '@storage/schemas/system'

import { usePostHog } from 'posthog-js/react'
import { VersionedResource } from '@storage/schemas/versionedResource'
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID'

function CharacterCreatorModal(props: any) {
  const { systems } = useSystems()
  const { versions } = useVersions()
  const { characters } = useCharacters()

  const posthog = usePostHog()

  const [system, setSystem] = useState<System | undefined>()
  const [version, setVersion] = useState<VersionedResource | undefined>()

  const [tab, setTab] = useState(0)

  const [characterData, setCharacterData] = useState<Character>({
    local_id: '',
    user_id: 'none',
  
    name: 'Aliza Cartwight',
    data: version?.data.defaultCharacterData ?? {},

    system: { local_id: '', version_id: '' },
  
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  })

  // const updateState = useCallback((state: BlueprintProcessorState) => {
  //   const index = state.system.creator.findIndex(c => c.name === state.page.name)
    
  //   if (
  //     deepEqual(characterData, state.character) &&
  //     deepEqual(system, state.system) &&
  //     deepEqual(state.system.creator[index], state.page)
  //   ) return

  //   setCharacterData(state.character)
  //   setSystem({ ...state.system, creator: state.system.creator.map(c => c.name === state.page.name ? state.page : c )})
  // }, [characterData, system, setSystem, setCharacterData])

  // const checkIfCanMoveOn = useCallback(() => {
  //   if (!system) return false

  //   const creatorPage = system.creator[tab - 1]

  //   if (!creatorPage) return false

  //   const processor = new BlueprintProcessor(creatorPage.blueprint)

  //   const canMoveOn = processor.processBlueprint({}, { character: characterData, system, page: creatorPage }, () => {})

  //   return !canMoveOn
  // }, [system, characterData, tab])

  useEffect(() => {
    const sys = systems[0]

    if (!sys || sys.local_id === system?.local_id) return
    setSystem(sys)

    let vers;

    const filteredVersions = versions.filter(ver => {
      const forSystem = (ver.reference_id === sys.local_id)
      
      return forSystem
    }).sort((a, b) => {
      if (!a || !b) return 0

      const aCreated = new Date(a.created_at)
      const bCreated = new Date(b.created_at)

      return (aCreated > bCreated) ? 1 : 0
    })

    vers = filteredVersions[0]

    if (!vers || vers.local_id === version?.local_id) return

    setVersion(vers)
    setCharacterData({ ...characterData, data: structuredClone(vers.data.defaultCharacterData), system: { local_id: sys.local_id, version_id: vers.local_id } })
  }, [systems, versions])

  if (!props.isOpen) return <></>

  if (!system) return (
    <Modal isOpen={props.isOpen} onClose={() => props.setIsOpen(false)}>
      <ModalHeader title='Error grabbing system' onClose={() => props.setIsOpen(false)} />

      <ModalBody>
        <h3>There was an error grabbing a default system, please subscribe to a system from the marketplace or import something!</h3>
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
            <TextInput id='character-name' label='Character Name' placeholder='Aliza Cartwight' value={characterData.name} onChange={(name) => setCharacterData({ ...characterData, name })} isValid={(!characters.find(c => c.name === characterData.name) && (characterData.name.length > 0))} errorMessage='Names must be unique and not empty.' />

            <Select id='character-system' label='Tabletop System' value={system.local_id} onChange={(local_id) => {
              const sys = systems.find(s => s.local_id === local_id)
              if (!sys) return

              const vers = versions.filter(ver => {
                const forSystem = (ver.reference_id === sys.local_id)
                
                return forSystem
              }).sort((a, b) => {
                const aCreated = new Date(a.created_at)
                const bCreated = new Date(b.created_at)
          
                return (aCreated > bCreated) ? 1 : 0
              })[0]
          
              if (!vers) return
          
              setSystem(sys)
              setVersion(vers)
              setCharacterData({ ...characterData, data: structuredClone(vers.data.defaultCharacterData), system: { local_id: sys.local_id, version_id: vers.local_id } })
            }}>
              {systems.map((sys) => <option key={sys.local_id} value={sys.local_id}>{sys.name}</option>)}
            </Select>

            <Select id='character-system-version' label='System Version' value={version?.local_id ?? ''} onChange={(local_id) => {
              const vers = versions.find(v => v.local_id === local_id)
              if (!vers) return

              setVersion(vers)
              setCharacterData({ ...characterData, data: structuredClone(vers.data.defaultCharacterData), system: { local_id: system.local_id, version_id: vers.local_id } })
            }}>
              {versions.map((ver) => <option key={ver.local_id} value={ver.local_id}>{getVisualTextFromVersionID(ver.local_id)}</option>)}
            </Select>
          </>
        )}

        {/* {
          system.creator.map((page, i) => <RenderTab key={page.name} page={page} hidden={(i + 1) !== tab} state={{ character: characterData, system, page }} updateState={updateState} />)
        } */}
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
            {version?.data.creator.map((page: PageData, i: number) => {
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
        
        {/* {(tab > 0) && (
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
        )} */}

        <Button id='create-character-button' color='primary' onClick={async () => {
          await createCharacter(characterData.name, characterData.data, characterData.system)
          setSystem(systems[0])
          props.setIsOpen(false)
          posthog.capture('character_created', { character_name: characterData.name })
        }}>
          Create
        </Button>
      </ModalFooter>
    </Modal>
  )
}

function RenderTab({ page, hidden, state, updateState }: { page: PageData, hidden: boolean, state: BlueprintProcessorState, updateState(state: BlueprintProcessorState): void }) {
  const data = useMemo(() => {
    if (!page.lexical) return {}

    return JSON.parse(lz.decompress(lz.decodeBase64(page.lexical)))
  }, [page.lexical])

  const display = useMemo(() => ({ display: hidden ? 'none' : 'block' }), [hidden])

  return (
    <RenderEditorData style={display} data={data} state={state} updateState={updateState} />
  )
}

export default CharacterCreatorModal
