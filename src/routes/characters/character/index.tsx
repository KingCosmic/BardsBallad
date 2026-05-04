import React, { useCallback, useEffect, useMemo, useState } from 'react'

import { useParams } from 'react-router'

import Header from '@/components/header'

import { DataType, SystemData } from '@/db/system/schema'
import { DataPack } from '@/db/datapack/schema'

import getVersionedResource from '@/db/version/methods/getVersionedResource'
import updateCharacterData from '@/db/character/methods/updateCharacterData'

import RenderTab from './render-tab'
import { Spinner } from '@/components/ui/spinner'
import { useScriptTypes } from '@/components/providers/script-types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useCharacter } from '@/db/character/hooks/useCharacter'
import { applyChangesToAutomerge, ChangesMap } from '@/utils/object/wrapWithTracking'
import getDoc from '@/db/shared/methods/getDoc'
import { parse, stringify } from '@/lib/bjson'
import resolveCharacter from '@/lib/character/resolveCharacter'
import { Character } from '@/db/character/schema'

import * as automerge from '@automerge/automerge'

const CharacterPage: React.FC = () => {
  const { id } = useParams<{ id: string; }>()

  const character = useCharacter(id ?? '')

  const [system, setSystem] = useState<SystemData | null>(null)

  const { setScriptTypes } = useScriptTypes()
  useEffect(() => {
    setScriptTypes([
      // character data
      system?.defaultCharacterData._type,
      // system data
      { name: 'SystemData', properties: system?.data.map(d => ({ key: d.name, typeData: d.typeData })) },
      // "page data",
      { name: 'PageData', properties: [] },
      // all custom types.
      ...(system?.types ?? [])
    ])

    return () => setScriptTypes([])
  }, [system?.defaultCharacterData._type, system?.data, system?.types])

  const state = useMemo(() => {
    if (!system || !character) return

    const cData = automerge.load<Character>(character.doc)

    return resolveCharacter(cData, system)
  }, [character, system])

  const updateState = useCallback(async (changes: ChangesMap) => {
    if (!character || !system || !id) return

    if (changes.has('character')) {
      await updateCharacterData(
        id,
        applyChangesToAutomerge(character, changes.get('character')!)
      )
    }
  }, [character, system])

  useEffect(() => {
    const loadSystem = async () => {
      if (!character) return

      const systemData = await getDoc<SystemData>(character.shadow.system)
      
      if (!systemData) return

      if (stringify(system) === stringify(systemData.snapshot)) return

      let datapacks: DataType[] = []

      for (let d = 0; d < character.shadow.datapacks.length; d++) {
        const pack = character.shadow.datapacks[d]

        const packData = await getDoc<DataPack>(pack.version_id)

        if (!packData) return

        datapacks = [ ...datapacks, ...packData.snapshot!.packData ]
      }

      const combined = systemData.snapshot.data.map((systemItem: any) => {
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

      setSystem({ ...systemData.snapshot!, data: combined })
    }

    loadSystem()
  }, [character])

  if (!character || !system) {
    return (
      <div className='flex gap-2'>
        <Spinner />
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className='flex flex-col h-full w-full @container'>
      <Header title={character.shadow.name} subtitle={character.shadow.slug} hasSidebar />

      <div className='flex flex-col grow overflow-hidden @xl:grid grid-cols-2 p-4 gap-4'>

        <ScrollArea className='relative w-full h-full flex-col'>
          <RenderTab system={system} state={state} updateState={updateState} />
        </ScrollArea>

        <ScrollArea className='relative hidden flex-col @xl:flex h-full'>
          <RenderTab system={system} state={state} updateState={updateState} />
        </ScrollArea>

        {/* <div className='relative w-full h-full flex flex-col grow overflow-hidden'>
          <div className='overflow-y-scroll max-h-full'>
            <RenderTab system={system} state={state} updateState={updateState} />
          </div>
        </div>

        <div className='relative hidden flex-col @xl:flex grow overflow-hidden'>
          <div className='overflow-y-scroll max-h-full'>
            <RenderTab system={system} state={state} updateState={updateState} />
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default CharacterPage;