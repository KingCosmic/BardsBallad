import { newRidgeState } from 'react-ridge-state'

import { produce } from 'immer'

type TypeData = {
  type: string;
  isArray?: boolean;
  options?: string[];
  gen?: any;
}

type SystemData = {
  id: string;
  name: string;

  creator: any[];
  tabs: any[];
  modals: any[];
  screens: any[];

  version: string;

  types: { name: string; properties: { [key:string]: TypeData } }[];
}


export const systemState = newRidgeState<SystemData>({
  id: '',
  name: 'DnD5E',

  creator: [],
  tabs: [],
  modals: [],
  screens: [],

  version: '0.1.0',

  types: [
    {
      name: 'Info',
      properties: {
        name: {
          type: 'string'
        },
        description: {
          type: 'textarea'
        }
      }
    },
    {
      name: 'Stat',
      properties: {
        name: {
          type: 'string',
        },
        description: {
          type: 'textarea'
        },
        value: {
          type: 'number'
        }
      }
    },
    {
      name: 'SavingThrow',
      properties: {
        name: {
          type: 'string',
        },
        isProficient: {
          type: 'boolean'
        }
      }
    },
    {
      name: 'Skill',
      properties: {
        name: {
          type: 'string',
        },
        stat: {
          type: 'string',
        },
        proficiency: {
          type: 'enum',
          options: [
            'none',
            'half',
            'full',
            'expertise'
          ]
        }
      }
    },
    {
      name: 'Equipment',
      properties: {
        name: {
          type: 'string'
        },
        modifiers: {
          type: 'Modifier',
          isArray: true
        }
      }
    },
    {
      name: 'Modifier',
      properties: {
        name: {
          type: 'string',
          gen: {
            min: 0,
            max: 14,
            genType: 'lorem'
          }
        },
        type: {
          type: 'enum',
          options: [
            'add',
            'override'
          ]
        },
        target: {
          type: 'string'
        },
        value: {
          type: 'BasedOffTargetAndType'
        }
      }
    }
  ]
})