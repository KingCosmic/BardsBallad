import { Edge, Node } from '@xyflow/react';
import { produce } from 'immer';
import { newRidgeState } from 'react-ridge-state'
import { getDefaultNodes } from '../blueprints/utils';
import { SystemStorage } from '../lib/storage'

import DND5EBackup from '../lib/backup-dnd5e.json'

export type TypeData = {
  type: string;
  useTextArea: boolean;
  isArray: boolean;
  options: string[];
  gen?: any;
}

export type SystemType = {
  name: string;
  properties: { key: string; typeData: TypeData }[]
}

export type DataType = {
  name: string;
  typeData: TypeData;
  data: any;
}

export type BlueprintData = {
  nodes: Node[];
  edges: Edge[];
}

export type PageData = {
  name: string;
  blueprint: BlueprintData;
  lexical: string;
  state: { name: string, type: TypeData }[];
}

export type SystemData = {
  name: string;

  creator: PageData[];
  modals: PageData[];
  pages: PageData[];

  version: string;

  data: DataType[];

  defaultCharacterData: { [key: string]: any };

  types: SystemType[];
}


export const systemsState = newRidgeState<SystemData[]>([])

export async function loadSystems() {
  try {
    let systems: SystemData[] = []

    const names = await SystemStorage.keys()

    for (let n = 0; n < names.length; n++) {
      const sys = await SystemStorage.get(names[n])

      systems.push(sys)
    }

    if (systems.length === 0) {
      systems.push(DND5EBackup)
    }

    systemsState.set(systems)
  } catch(e) {
    // TODO: show error message to user.
    systemsState.set([])
  }
}

loadSystems()

export function getDefaultSystemData(): SystemData {
  return {
    name: 'New System',

    creator: [],
    modals: [],
    pages: [
      {
        name: 'Info',
        blueprint: { nodes: getDefaultNodes(), edges: [] },
        lexical: '',
        state: []
      }
    ],

    version: '0.0.1',

    data: [],

    defaultCharacterData: {
      _type: {
        name: 'DefaultCharacterData',
        properties: []
      }
    },

    types: []
  }
}

export function createSystem() {
  const systems = systemsState.get()

  const index = systems.findIndex(s => s.name === 'New System')

  if (index !== -1) return

  const newData = getDefaultSystemData()

  const newSystems = produce(systems, draft => {
    draft.push(newData)

    return draft
  })

  systemsState.set(newSystems)
  SystemStorage.set(newData.name, newData)
}

export function deleteSystem(name: string) {
  systemsState.set((prevState) => prevState.filter((sys) => sys.name !== name))
  SystemStorage.remove(name)
}