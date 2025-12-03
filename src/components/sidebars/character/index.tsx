import { useScriptRunner } from '@/components/providers/script-runner'
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import updateCharacterData from '@/db/character/methods/updateCharacterData'
import { DataPack } from '@/db/datapack/schema'
import { DataType, SystemData } from '@/db/system/schema'
import getVersionedResource from '@/db/version/methods/getVersionedResource'
import { useCharacter } from '@/hooks/characters/useCharacter'
import unwrapProxy from '@/utils/object/unwrapProxy'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router'


export function CharacterSidebar() {
  const { runScript } = useScriptRunner()

  const { id } = useParams<{ id: string; }>()

  const character = useCharacter(id)

  const [system, setSystem] = useState<SystemData | null>(null)

  const state = useMemo(() => {
    let sys: Record<string, any> = {}

    if (!system || !character) return

    system.data.forEach(d => sys[d.name] = d.data)

    return JSON.parse(JSON.stringify({ character: character.data, system: sys }))
  }, [character, system])

  const updateState = useCallback(async (state: any) => {
    if (!character || !system) return

    if (JSON.stringify(character.data) !== JSON.stringify(state.character)) {
      await updateCharacterData(character.local_id, unwrapProxy(state.character))
    }
  }, [character, system])

  useEffect(() => {
    const loadSystem = async () => {
      if (!character) return

      const systemData = await getVersionedResource<SystemData>(character.system.version_id)
      
      if (!systemData) return

      if (JSON.stringify(system) === JSON.stringify(systemData.data)) return

      let datapacks: DataType[] = []

      for (let d = 0; d < character.datapacks.length; d++) {
        const pack = character.datapacks[d]

        const packData = await getVersionedResource<DataPack>(pack.version_id)

        if (!packData) return

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

  if (!character || !system) return <></>

  return (
    <Sidebar side='right' collapsible="offcanvas">
      <SidebarHeader>
        <span className="text-base font-semibold">Quick Actions</span>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              {system.actions.map(a => (
                <SidebarMenuItem key={a.name}>
                  <SidebarMenuButton tooltip={a.description} onClick={() => {
                    runScript(undefined, a.script.compiled, state, updateState)
                  }}>
                    <p className='text-neutral-100'>{a.name}</p>
                  <p className='text-sm text-neutral-300'>{a.description}</p>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}

export default CharacterSidebar