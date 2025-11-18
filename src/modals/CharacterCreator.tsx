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
import { type PageData } from '@storage/schemas/system'

import { usePostHog } from 'posthog-js/react'
import { VersionedResource } from '@storage/schemas/versionedResource'
import getVisualTextFromVersionID from '@utils/getVisualTextFromVersionID'
import { db, Item } from '@storage/index'
import { closeModal } from '@state/modals'
import MultiSelect from '@components/MultiSelect'
import useSubscriptionsWithData, { Grouped } from '@hooks/useSubscriptionsWithData'

interface Props {
  id: number;
}

function CharacterCreatorModal({ id }: Props) {
  const { characters } = useCharacters()

  const { subscriptions, isLoading } = useSubscriptionsWithData(['theme'])

  const systems = useMemo(() => (subscriptions || []).filter(sub => sub.type === 'system'), [subscriptions])

  const posthog = usePostHog()

  const [slug, setSlug] = useState('')
  const [system, setSystem] = useState<Grouped | undefined>()
  const [version, setVersion] = useState<VersionedResource | undefined>()
  const [activePacks, setActivePacks] = useState<VersionedResource[]>([])

  const datapacks = useMemo(() => (subscriptions || []).filter(sub => {
    const isDataPack = (sub.type === 'datapack')

    if (!isDataPack || !system || !version) return false

    return true
  }).map(pack => ({ label: pack.item.name, value: pack.versions.filter(v => {
    if (!system || !version) return false
    
    const sysHashTypes = system.hashes[version.local_id]

    const hashTypes = pack.hashes[v.local_id]

    for (let h = 0; h < hashTypes.length; h++) {
      const hashType = hashTypes[h]
      const sysHash = sysHashTypes.find(h => h.name === hashType.name)

      if (!sysHash) return false

      if (hashType.hash !== sysHash.hash) return false
    }

    return true
  })[0] })), [subscriptions, system])

  const [tab, setTab] = useState(0)

  const [characterData, setCharacterData] = useState<Character>({
    local_id: '',
    user_id: 'none',
  
    name: '',
    data: version?.data.defaultCharacterData ?? {},

    system: { local_id: '', version_id: '' },

    datapacks: [],
  
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

    if (!sys || sys.item_id === system?.item_id) return
    setSystem(sys)

    let vers = sys.versions[0];

    if (!vers || vers.local_id === version?.local_id) return

    setVersion(vers)
    setCharacterData({ ...characterData, data: structuredClone(vers.data.defaultCharacterData), system: { local_id: sys.item_id, version_id: vers.local_id }, datapacks: [] })
  }, [systems])

  const requestClose = useCallback(() => closeModal(id), [id])

  if (!system) return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title='Error grabbing system' onClose={requestClose} />

      <ModalBody>
        <h3>There was an error grabbing a default system, please subscribe to a system from the marketplace or import something!</h3>
      </ModalBody>

      <ModalFooter>
        <Button color='primary' onClick={requestClose}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )

  return (
    <Modal isOpen onClose={requestClose}>
      <ModalHeader title='Create Character' onClose={requestClose} />

      <ModalBody>
        {tab === 0 && (
          <>
            <TextInput id='character-name' label='Character Name' placeholder='Aliza Cartwight' value={characterData.name} onChange={(name) => setCharacterData({ ...characterData, name })} isValid={(!characters.find(c => c.name === characterData.name))} errorMessage='Names must be unique' />
              <TextInput id='slug' label='Character Motto' placeholder="They will all pay." value={slug} onChange={(slug) => setSlug(slug)} isValid errorMessage='' />

            <Select id='character-system' label='Tabletop System' value={system.item_id} onChange={(local_id) => {
              const sys = systems.find(s => s.item_id === local_id)
              if (!sys) return

              const vers = sys.versions[0]
          
              if (!vers) return
          
              setSystem(sys)
              setVersion(vers)
              setCharacterData({ ...characterData, data: structuredClone(vers.data.defaultCharacterData), system: { local_id: sys.item_id, version_id: vers.local_id } })
            }}>
              {systems.map((sys) => <option key={sys.item_id} value={sys.item_id}>{sys.item.name}</option>)}
            </Select>

            <Select id='character-system-version' label='System Version' value={version?.local_id ?? ''} onChange={(local_id) => {
              const vers = system.versions.find(v => v.local_id === local_id)
              if (!vers) return

              setVersion(vers)
              setCharacterData({ ...characterData, data: structuredClone(vers.data.defaultCharacterData), system: { local_id: system.item_id, version_id: vers.local_id } })
            }}>
              {system.versions.map((ver) => <option key={ver.local_id} value={ver.local_id}>{getVisualTextFromVersionID(ver.local_id)}</option>)}
            </Select>

            <p>Datapacks</p>
            <MultiSelect options={datapacks} value={activePacks} onChange={vals => setActivePacks(vals)} />
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
              <p className='inline-flex items-center text-sm font-medium text-fantasy-text-muted hover:text-fantasy-text'>
                <svg className='w-3 h-3 me-2.5' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z'/>
                </svg>
                Basics
              </p>
            </li>
            {version?.data.creator.map((page: PageData, i: number) => {
              if (tab < (i + 1)) return <></>

              return (
                <li key={i} className='cursor-pointer' onClick={() => setTab(i + 1)}>
                  <div className='flex items-center'>
                    <svg className='rtl:rotate-180 w-3 h-3 text-fantasy-text-muted mx-1' aria-hidden='true' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 6 10'>
                      <path stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='m1 9 4-4-4-4'/>
                    </svg>
                    <p className='ms-1 text-sm font-medium text-fantasy-text-muted hover:bg-fantasy-text'>{page.name}</p>
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

        <Button id='create-character-button' color='primary' disabled={characterData.name.length === 0} onClick={async () => {
          await createCharacter(characterData.name, slug, characterData.data, characterData.system, activePacks.map(pack => ({ pack_id: pack.reference_id, version_id: pack.local_id })))
          setSystem(systems[0])
          requestClose()
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
