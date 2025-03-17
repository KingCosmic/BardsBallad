import { memo, useCallback, useEffect, useMemo, useState } from 'react'

import { useParams } from 'react-router'

import { PageData, SystemData } from '../types/system'
import RenderEditorData from '../designer/RenderEditorData'

import Header from '../components/Header'

import Select from '../components/inputs/Select'
import { useCharacter } from '../hooks/useCharacter'

import lz from 'lzutf8'
import { BlueprintProcessorState } from '../utils/Blueprints/processBlueprint'
import { deepEqual } from 'fast-equals'
import { useSystems } from '../hooks/useSystems'
import { updateCharacterData } from '../storage/utils/characters'

import { CharacterData } from '../types/character'

const Character: React.FC = () => {
  const { id } = useParams<{ id: string; }>()

  const { systems } = useSystems()

  const character = useCharacter(id)

  const [system, setSystem] = useState<SystemData | null>(null)

  const updateState = useCallback((state: BlueprintProcessorState) => {
    if (!character || !system) return

    const index = state.system.pages.findIndex(c => c.name === state.page.name)

    if (
      deepEqual(character, state.character) &&
      deepEqual(system, state.system) &&
      deepEqual(state.system.pages[index], state.page)
    ) return

    updateCharacterData(character.id, state.character)
    setSystem({ ...state.system, pages: state.system.pages.map(c => c.name === state.page.name ? state.page : c )})
  }, [character, system])

  useEffect(() => {
    if (!systems) return

    const newSystem = systems.find(s => s.id === character?.system.id)
    if (!newSystem) return

    if (deepEqual(system, newSystem)) return

    setSystem(newSystem)
  }, [systems])

  if (!character || !system) return <p id='loading-text' className='text-center text-2xl'>loading...</p>

  return (
    <div className='flex flex-col h-full w-full'>
      <p id='loading-text' className='hidden'>loading...</p>
      <Header title={character.name} />

      <div className='flex flex-row flex-grow overflow-hidden'>

        <div className='relative w-full lg:w-1/2 max-h-full flex flex-col'>
          <div className='overflow-y-scroll p-4'>
            <RenderTab className='first-tab-selector' system={system} character={character} updateState={updateState} />
          </div>
        </div>

        <div className='relative w-1/2 hidden flex-col lg:flex max-h-full'>
          <div className='overflow-y-scroll p-4'>
            <RenderTab className='second-tab-selector' system={system} character={character} updateState={updateState} />
          </div>
        </div>
      </div>
    </div>
  )
}

const RenderTab = ({ system, character, updateState, className }: { system: SystemData, character: CharacterData, updateState(state: BlueprintProcessorState): void, className: string }) => {
  const [tab, setTab] = useState(system.pages[0].name)

  return (
    <>
      <Select className={className} id='tab-selector' label='' value={tab} onChange={setTab}>
        {
          system.pages.map(page => <option key={page.name} value={page.name}>{page.name}</option>)
        }
      </Select>

      {
        system.pages.map(page => <RenderPage key={page.name} character={character} system={system} page={page} currentTab={tab} updateState={updateState} />)
      }
    </>
  )
}

function RenderPage({ page, character, system, currentTab, updateState }: { page: PageData, character: CharacterData, system: SystemData, currentTab: string, updateState(state: BlueprintProcessorState): void }) {
  const data = useMemo(() => {
    if (!page.lexical) return {}

    return JSON.parse(lz.decompress(lz.decodeBase64(page.lexical)))
  }, [page.lexical])

  if ((currentTab !== page.name)) return <></>

  return (
    <RenderEditorData data={data} state={{ character, system, page }} updateState={updateState} />
  )
}

export default Character;
