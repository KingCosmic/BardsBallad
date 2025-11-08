import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { data, useParams } from 'react-router'

import RenderEditorData from '@designer/RenderEditorData'

import Header from '@components/Header'

import Select from '@components/inputs/Select'
import { useCharacter } from '@hooks/useCharacter'

import lz from 'lzutf8'
import { BlueprintProcessorState } from '@utils/Blueprints/processBlueprint'
import { deepEqual } from 'fast-equals'
import { updateCharacterData } from '@storage/methods/characters'
import { Character } from '@storage/schemas/character'

import { DataType, type PageData, SystemData, SystemType } from '@storage/schemas/system'
import getVersionedResource from '@storage/methods/versionedresources/getVersionedResource'
import CharacterSidebar from '@sidebars/Character'
import { addToast } from '@state/toasts'
import { DataPack } from '@storage/schemas/datapack'

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

      const systemData = await getVersionedResource<SystemData>(character.system.version_id)

      if (!systemData) return addToast(`Error grabbing system, version: ${character.system.version_id}`, 'error')

      if (deepEqual(system, systemData.data)) return

      let datapacks: DataType[] = []

      for (let d = 0; d < character.datapacks.length; d++) {
        const pack = character.datapacks[d]

        const packData = await getVersionedResource<DataPack>(pack.version_id)

        if (!packData) return addToast(`Error grabbing datapack, version: ${pack.version_id}`, 'error')

        datapacks = [ ...datapacks, ...packData.data!.packData ]
      }

      const combined = systemData.data!.data.map(systemItem => {
        // Collect packData from all datapacks that match this system item's name
        const matchingPackData = datapacks
          .flat()
          .filter(dp => dp.name === systemItem.name)
          .flatMap(dp => dp.data);

        // TODO: stop crashing on system data that isn't arrays.
        
        return {
          ...systemItem,
          data: [...systemItem.data, ...matchingPackData]
        };
      });

      setSystem({ ...systemData.data!, data: combined })
    }

    loadSystem()
  }, [character])

  if (!character) return <p id='loading-text' className='text-center text-2xl'>loading character data...</p>
  if (!system) return <p id='loading-text' className='text-center text-2xl'>loading system data...</p>

  return (
    <div className='flex flex-col h-full w-full'>
      <p id='loading-text' className='hidden'>loading...</p>

      <Header title={character.name} subtitle='Chaotic / Neutral' hasSidebar />

      <div className='lg:mr-64 flex flex-col flex-grow overflow-hidden xl:grid grid-cols-2'>

        <div className='relative xl:p-4 w-full h-full flex flex-col flex-grow overflow-hidden'>
          <div className='overflow-y-scroll max-h-full'>
            <RenderTab className='first-tab-selector' system={system} character={character} updateState={updateState} />
          </div>
        </div>

        <div className='relative xl:p-4 hidden flex-col xl:flex flex-grow overflow-hidden'>
          <div className='overflow-y-scroll max-h-full'>
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
