import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useParams } from 'react-router'

import RenderEditorData from '@designer/RenderEditorData'

import Header from '@components/Header'

import Select from '@components/inputs/Select'
import { useCharacter } from '@hooks/useCharacter'

import lz from 'lzutf8'
import { BlueprintProcessorState } from '@utils/Blueprints/processBlueprint'
import { deepEqual } from 'fast-equals'
import { updateCharacterData } from '@storage/methods/characters'
import { Character } from '@storage/schemas/character'

import { type PageData, SystemData } from '@storage/schemas/system'
import getVersionedResource from '@storage/methods/versionedresources/getVersionedResource'
import CharacterSidebar from '@sidebars/Character'

const CharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string; }>()

  const character = useCharacter(id)

  const [system, setSystem] = useState<SystemData | null>(null)

  const updateState = useCallback((state: BlueprintProcessorState) => {
    if (!character || !system) return

    const index = state.system.pages.findIndex((c: any) => c.name === state.page.name)

    if (
      deepEqual(character, state.character) &&
      deepEqual(system, state.system) &&
      deepEqual(state.system.pages[index], state.page)
    ) return

    updateCharacterData(character.local_id, state.character.data)
    setSystem({ ...state.system, pages: state.system.pages.map((c: any) => c.name === state.page.name ? state.page : c )})
  }, [character, system])

  useEffect(() => {
    const loadSystem = async () => {
      if (!character) return

      const systemData = await getVersionedResource(character.system.version_id)

      if (!systemData) return

      if (deepEqual(system, systemData.data)) return

      setSystem(systemData.data)
    }

    loadSystem()
  }, [character])

  if (!character) return <p id='loading-text' className='text-center text-2xl'>loading character data...</p>
  if (!system) return <p id='loading-text' className='text-center text-2xl'>loading system data...</p>

  return (
    <div className='flex flex-col h-full w-full'>
      <p id='loading-text' className='hidden'>loading...</p>
      <Header title={character.name} hasSidebar />

      <div className='p-4 sm:mr-64 relative flex flex-col flex-grow overflow-hidden lg:grid grid-cols-2'>

        <div className='relative w-full max-h-full flex flex-col'>
          <div className='overflow-y-scroll p-4'>
            <RenderTab className='first-tab-selector' system={system} character={character} updateState={updateState} />
          </div>
        </div>

        <div className='relative hidden flex-col lg:flex max-h-full'>
          <div className='overflow-y-scroll p-4'>
            <RenderTab className='second-tab-selector' system={system} character={character} updateState={updateState} />
          </div>
        </div>
      </div>

      <CharacterSidebar actions={system.actions} system={system} character={character} updateState={updateState} />
    </div>
  )
}

const RenderTab = ({ system, character, updateState, className }: { system: SystemData, character: Character, updateState(state: BlueprintProcessorState): void, className: string }) => {
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

function RenderPage({ page, character, system, currentTab, updateState }: { page: PageData, character: Character, system: SystemData, currentTab: string, updateState(state: BlueprintProcessorState): void }) {
  const data = useMemo(() => {
    if (!page.lexical) return {}

    return JSON.parse(lz.decompress(lz.decodeBase64(page.lexical)))
  }, [page.lexical])

  if ((currentTab !== page.name)) return <></>

  return (
    <RenderEditorData data={data} state={{ character, system, page }} updateState={updateState} />
  )
}

export default CharacterPage;
