import { newRidgeState } from 'react-ridge-state'

type TypeData = {
  type: string;
  isArray?: boolean;
  options?: string[];
  gen?: any;
}

export type SystemData = {
  name: string;

  creator: any[];
  tabs: any[];
  modals: any[];
  screens: any[];

  version: string;

  customData: { [key:string]: any };

  defaultCharacterData: { [key:string]: any };

  types: { name: string; properties: { [key:string]: TypeData } }[];
}


export const systemsState = newRidgeState<SystemData[]>([
  {
    name: 'D&D 5th Edition (SRD)',
  
    creator: [],
    tabs: [],
    modals: [],
    screens: [],
  
    version: '0.1.0',

    customData: {
      exp: {
        0: {
          level: 1,
          profBonus: 2
        },
        300: {
          level: 2,
          profBonus: 2
        },
        900: {
          level: 3,
          profBonus: 2
        },
        2700: {
          level: 4,
          profBonus: 2
        },
        6500: {
          level: 5,
          profBonus: 3
        },
        14000: {
          level: 6,
          profBonus: 3
        },
        23000: {
          level: 7,
          profBonus: 3
        },
        34000: {
          level: 8,
          profBonus: 3
        },
        48000: {
          level: 9,
          profBonus: 4
        },
        64000: {
          level: 10,
          profBonus: 4
        },
        85000: {
          level: 11,
          profBonus: 4
        },
        100000: {
          level: 12,
          profBonus: 4
        },
        120000: {
          level: 13,
          profBonus: 5
        },
        140000: {
          level: 14,
          profBonus: 5
        },
        165000: {
          level: 15,
          profBonus: 5
        },
        195000: {
          level: 16,
          profBonus: 5
        },
        225000: {
          level: 17,
          profBonus: 6
        },
        265000: {
          level: 18,
          profBonus: 6
        },
        305000: {
          level: 19,
          profBonus: 6
        },
        355000: {
          level: 20,
          profBonus: 6
        },
      }
    },

    defaultCharacterData: {
      _def: {
        info: {
          type: 'Info',
          isArray: true
        },
        health: {
          type: 'HitPoints'
        },
        initiative: {
          type: 'Initiative'
        },
        spellCastings: {
          type: 'SpellCasting',
          isArray: true
        },
        equipment: {
          type: 'Equipment',
          isArray: true
        },
        stats: {
          type: 'Stat',
          isArray: true
        },
        skills: {
          type: 'Skill',
          isArray: true
        },
      },

      exp: 0,
      level: 1, // TODO: This will be used once I get a levelup screen with the character creator update.
      
      health: {
        _def: {
          max: 'number',
          current: 'number',
          temp: 'number'
        },
        max: 10,
        current: 10,
        temp: 10
      },

      spellCastings: [],

      hitdice: [],

      speeds: [],

      proficiencies: [],

      senses: [], // TODO: Will come soon.

      resources: [], // TODO: This can wait for a combat focused update, I want custom resources, plus items that can be used as a resource to show up on the combat screen (arrows, potions, rage charges etc.)

      deathSaves: { // TODO: Will wait on this.
        success: 0,
        failed: 0
      },

      proficiencyBonus: {
        _def: {
          value: 'number',
          useCalculation: 'boolean',
          calculation: 'Calculation'
        },
        value: 2,
        useCalculation: false,
        calculation: {
          formula: '*{${spd} + ${dexMod}}',
          requiredValues: [
            {
              name: 'dexMod',
              path: 'data/stats/Dexterity/modifier/value'
            },
            {
              name: 'spd',
              path: 'data/speed'
            }
          ]
        }
      }, // TODO: convert this to an overridable calculated value.

      armorClass: {
        _def: {
          value: 'number',
          useCalculation: 'boolean',
          calculation: 'Calculation'
        },
        value: 10,
        useCalculation: false,
        calculation: {
          formula: '*{${spd} + ${dexMod}}',
          requiredValues: [
            {
              name: 'dexMod',
              path: 'data/stats/Dexterity/modifier/value'
            },
            {
              name: 'spd',
              path: 'data/speed'
            }
          ]
        }
      },

      spells: [],
      equipment: [],
      features: [],

      conditions: [],
      actions: [],
      bonusActions: [],
      reactions: [],
      modifiers: [],

      initiative: {
        _def: {
          value: 'number',
          calculation: 'Calculation'
        },
        value: 0,
        calculation: {
          formula: '*{${spd} + ${dexMod}}',
          requiredValues: [
            {
              name: 'dexMod',
              path: 'data/stats/Dexterity/modifier/value'
            },
            {
              name: 'spd',
              path: 'data/speed'
            }
          ]
        }
      },

      info: [
        {
          _def: {
            name: 'string',
            description: 'textarea'
          },
          name: 'Race',
          description: 'Half-Elf'
        }
      ],
      notes: [],
      stats: [
        {
          _def: {
            name: 'string',
            description: 'textarea',
            score: 'number',
            saveProficient: 'boolean'
          },
          name: 'Strength',
          description: 'Measuring physical power.',
          score: 10,
          saveProficient: false
        },
        {
          _def: {
            name: 'string',
            description: 'textarea',
            score: 'number',
            saveProficient: 'boolean'
          },
          name: 'Dexterity',
          description: 'Measuring agility',
          score: 10,
          saveProficient: false
        },
        {
          _def: {
            name: 'string',
            description: 'textarea',
            score: 'number',
            saveProficient: 'boolean'
          },
          name: 'Constitution',
          description: 'Measuring endurance',
          score: 10,
          saveProficient: false
        },
        {
          _def: {
            name: 'string',
            description: 'textarea',
            score: 'number',
            saveProficient: 'boolean'
          },
          name: 'Intelligence',
          description: 'Measuring reasoning and memory',
          score: 10,
          saveProficient: false
        },
        {
          _def: {
            name: 'string',
            description: 'textarea',
            score: 'number',
            saveProficient: 'boolean'
          },
          name: 'Wisdom',
          description: 'Measuring perception and insight',
          score: 10,
          saveProficient: false
        },
        {
          _def: {
            name: 'string',
            description: 'textarea',
            score: 'number',
            saveProficient: 'boolean'
          },
          name: 'Charisma',
          description: 'Measuring force of personality',
          score: 10,
          saveProficient: false
        }
      ],
      skills: [
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Athletics',
          stat: 'Strength',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Acrobatics',
          stat: 'Dexterity',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Sleight of Hand',
          stat: 'Dexterity',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Stealth',
          stat: 'Dexterity',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Arcana',
          stat: 'Intelligence',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'History',
          stat: 'Intelligence',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Investigation',
          stat: 'Intelligence',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Nature',
          stat: 'Intelligence',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Religion',
          stat: 'Intelligence',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Animal Handling',
          stat: 'Wisdom',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Insight',
          stat: 'Wisdom',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Medicine',
          stat: 'Wisdom',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Perception',
          stat: 'Wisdom',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Survival',
          stat: 'Wisdom',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Deception',
          stat: 'Charisma',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Intimidation',
          stat: 'Charisma',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Performance',
          stat: 'Charisma',
          proficiency: 'none'
        },
        {
          _def: {
            name: 'string',
            stat: 'string',
            proficiency: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          },
          name: 'Persuasion',
          stat: 'Charisma',
          proficiency: 'none'
        },
      ]
    },
  
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
        name: 'Note',
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
        name: 'HitDie',
        properties: {
          name: {
            type: 'string'
          },
          value: {
            type: 'string'
          }
        }
      },
      {
        name: 'Speed',
        properties: {
          name: {
            type: 'string'
          },
          value: {
            type: 'string'
          }
        }
      },
      {
        name: 'Proficiency',
        properties: {
          name: {
            type: 'string'
          }
        }
      },
      {
        name: 'Feature',
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
        name: 'HitPoints',
        properties: {
          max: {
            type: 'number'
          },
          current: {
            type: 'number'
          },
          temp: {
            type: 'number'
          }
        }
      },
      {
        name: 'Initiative',
        properties: {
          value: {
            type: 'number'
          },
          calculation: {
            type: 'Calculation'
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
          score: {
            type: 'number'
          },
          saveProficient: {
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
        name: 'SpellCasting',
        properties: {
          name: {
            type: 'string'
          },
          ability: {
            type: 'string'
          },
          save: {
            type: 'string'
          },
          attackBonus: {
            type: 'number'
          },
          spellSlots: {
            type: 'SpellSlot',
            isArray: true
          },
          spells: {
            type: 'Spell',
            isArray: true
          }
        }
      },
      {
        name: 'SpellSlot',
        properties: {
          name: {
            type: 'string',
          },
          current: {
            type: 'number'
          },
          max: {
            type: 'number'
          }
        }
      },
      {
        name: 'Spell',
        properties: {
          name: {
            type: 'string'
          },
          description: {
            type: 'textarea'
          },
          type: {
            type: 'string'
          },
          school: {
            type: 'string'
          },
          timeToCast: {
            type: 'string'
          },
          range: {
            type: 'string'
          },
          duration: {
            type: 'string'
          },
          components: {
            type: 'string'
          },
          level: {
            type: 'string'
          }
        }
      },
      {
        name: 'Equipment',
        properties: {
          name: {
            type: 'string'
          },
          description: {
            type: 'textarea'
          },
          type: {
            type: 'string',
          },
          rarity: {
            type: 'string'
          },
          weight: {
            type: 'string'
          },
          weaponCategory: {
            type: 'enum',
            options: [
              'none',
              'simple',
              'martial'
            ]
          },
          properties: {
            type: 'string',
            isArray: true
          },
          range: {
            type: 'string',
          },
          damage: {
            type: 'string',
          },
          isFirearm: {
            type: 'boolean',
          },
          isWeapon: {
            type: 'boolean'
          },
          armorClass: {
            type: 'string',
          },
          ammoType: {
            type: 'string'
          },
          quantity: {
            type: 'number'
          },
          value: {
            type: 'string',
          },
          isEquipped: {
            type: 'boolean'
          },
          conditions: {
            type: 'Condition',
            isArray: true
          },
          actions: {
            type: 'Action',
            isArray: true
          },
          bonusActions: {
            type: 'BonusAction',
            isArray: true
          },
          reactions: {
            type: 'Reaction',
            isArray: true
          },
          modifiers: {
            type: 'Modifier',
            isArray: true
          },
        }
      },
      {
        name: 'Condition',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'textarea'
          }
        }
      },
      {
        name: 'Action',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'textarea'
          }
        }
      },
      {
        name: 'BonusAction',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'textarea'
          }
        }
      },
      {
        name: 'Reaction',
        properties: {
          name: {
            type: 'string',
          },
          description: {
            type: 'textarea'
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
      },
      {
        name: 'RequiredValue',
        properties: {
          name: {
            type: 'string',
          },
          path: {
            type: 'string'
          }
        }
      },
      {
        name: 'Calculation',
        properties: {
          formula: {
            type: 'string'
          },
          requiredValues: {
            type: 'RequiredValue',
            isArray: true
          }
        }
      }
    ]
  }
])