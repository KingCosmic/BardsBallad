import { getDefaultNodes } from '../blueprints/utils'

const data = [
  {
    name: 'D&D 5th Edition (SRD)',
  
    creator: [],
    modals: [],
    pages: [
      {
        name: 'Info',
        blueprint: {
          nodes: getDefaultNodes(),
          edges: [],
        },
        lexical: JSON.stringify({"ROOT":{"type":{"resolvedName":"Container"},"isCanvas":true,"props":{"padding":"20px","background":"#1E1E1E"},"displayName":"Container","custom":{},"hidden":false,"nodes":["2cmbg5ubmT"],"linkedNodes":{}},"g9jph2bgOk":{"type":{"resolvedName":"Text"},"isCanvas":false,"props":{"text":"Hello World","fontSize":32},"displayName":"Text","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}},"2cmbg5ubmT":{"type":{"resolvedName":"Searchbar"},"isCanvas":false,"props":{"placeholder":"Search...","blueprint":{"nodes":[{"id":"1","type":"entry","data":{"params":[{"name":"searchText","type":"string","isArray":false}]},"position":{"x":100,"y":100}}],"edges":[]}},"displayName":"Searchbar","custom":{},"parent":"ROOT","hidden":false,"nodes":[],"linkedNodes":{}}}),
        state: []
      }
    ],
  
    version: '0.1.0',

    data: [
      {
        name: 'level data',
        typeData: {
          type: 'LevelConstant',
          isArray: true,
          useTextArea: false
        },
        data: [
          {
            name: 'First Level',
            level: 1,
            proficiencyBonus: 2,
            requiredExpierence: 0
          },
          {
            name: 'Second Level',
            level: 2,
            proficiencyBonus: 2,
            requiredExpierence: 300
          },
          {
            name: 'Third Level',
            level: 3,
            proficiencyBonus: 2,
            requiredExpierence: 900
          },
          {
            name: 'Fourth Level',
            level: 4,
            proficiencyBonus: 2,
            requiredExpierence: 2700
          },
          {
            name: 'Fifth Level',
            level: 5,
            proficiencyBonus: 3,
            requiredExpierence: 6500
          },
          {
            name: 'Sixth Level',
            level: 6,
            proficiencyBonus: 3,
            requiredExpierence: 14000
          },
          {
            name: 'Seventh Level',
            level: 7,
            proficiencyBonus: 3,
            requiredExpierence: 23000
          },
          {
            name: 'Eighth Level',
            level: 8,
            proficiencyBonus: 3,
            requiredExpierence: 34000
          },
          {
            name: 'Nineth Level',
            level: 9,
            proficiencyBonus: 4,
            requiredExpierence: 48000
          },
          {
            name: 'Tenth Level',
            level: 10,
            proficiencyBonus: 4,
            requiredExpierence: 64000
          },
          {
            name: 'Eleventh Level',
            level: 11,
            proficiencyBonus: 4,
            requiredExpierence: 85000
          },
          {
            name: 'Twelfth Level',
            level: 12,
            proficiencyBonus: 4,
            requiredExpierence: 100000
          },
          {
            name: 'Thirteenth Level',
            level: 13,
            proficiencyBonus: 5,
            requiredExpierence: 120000
          },
          {
            name: 'Fourteenth Level',
            level: 14,
            proficiencyBonus: 5,
            requiredExpierence: 140000
          },
          {
            name: 'Fithteenth Level',
            level: 15,
            proficiencyBonus: 5,
            requiredExpierence: 165000
          },
          {
            name: 'Sixthteenth Level',
            level: 16,
            proficiencyBonus: 5,
            requiredExpierence: 195000
          },
          {
            name: 'Seventeenth Level',
            level: 17,
            proficiencyBonus: 6,
            requiredExpierence: 225000
          },
          {
            name: 'Eighteenth Level',
            level: 18,
            proficiencyBonus: 6,
            requiredExpierence: 265000
          },
          {
            name: 'Nineteenth Level',
            level: 19,
            proficiencyBonus: 6,
            requiredExpierence: 305000
          },
          {
            name: 'Twentyth Level',
            level: 20,
            proficiencyBonus: 6,
            requiredExpierence: 355000
          },
        ]
      }
    ],

    defaultCharacterData: {
      _type: {
        name: 'CharacterData',
        properties: [
          {
            key: 'info',
            typeData: {
              type: 'Info',
              isArray: true
            }
          },
          {
            key: 'exp',
            typeData: {
              type: 'number'
            }
          },
          {
            key: 'health',
            typeData: {
              type: 'HitPoints'
            }
          },
          {
            key: 'initiative',
            typeData: {
              type: 'Initiative'
            }
          },
          {
            key: 'spellCastings',
            typeData: {
              type: 'SpellCasting',
              isArray: true
            }
          },
          {
            key: 'equipment',
            typeData: {
              type: 'Equipment',
              isArray: true
            }
          },
          {
            key: 'stats',
            typeData: {
              type: 'Stat',
              isArray: true
            }
          },
          {
            key: 'skills',
            typeData: {
              type: 'Skill',
              isArray: true
            }
          }
        ]
      },

      exp: 0,
      level: 1, // TODO: This will be used once I get a levelup screen with the character creator update.
      
      health: {
        _type: {
          name: 'HitPoints',
          properties: [
            {
              key: 'max',
              typeData: {
                type: 'number'
              }
            },
            {
              key: 'current',
              typeData: {
                type: 'number'
              }
            },
            {
              key: 'temp',
              typeData: {
                type: 'number'
              }
            }
          ]
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
        _type: {
          name: 'ProficiencyBonus',
          properties: [
            {
              key: 'value',
              typeData: {
                type: 'number'
              }
            },
            {
              key: 'useCalculation',
              typeData: {
                type: 'boolean'
              }
            },
            {
              key: 'calculation',
              typeData: {
                type: 'Calculation'
              }
            }
          ]
        },
        value: 2,
        useCalculation: false,
        calculation: {
          _type: {
            name: 'Calculation',
            properties: [
              {
                key: 'formula',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'requiredValues',
                typeData: {
                  type: 'RequiredValue',
                  isArray: true
                }
              }
            ]
          },
          formula: '*{${spd} + ${dexMod}}',
          requiredValues: [
            {
              _type: {
                name: 'RequiredValue',
                properties: [
                  {
                    key: 'name',
                    typeData: {
                      type: 'string'
                    }
                  },
                  {
                    key: 'path',
                    typeData: {
                      type: 'string'
                    }
                  }
                ]
              },
              name: 'dexMod',
              path: 'data/stats/Dexterity/modifier/value'
            },
            {
              _type: {
                name: 'RequiredValue',
                properties: [
                  {
                    key: 'name',
                    typeData: {
                      type: 'string'
                    }
                  },
                  {
                    key: 'path',
                    typeData: {
                      type: 'string'
                    }
                  }
                ]
              },
              name: 'spd',
              path: 'data/speed'
            }
          ]
        }
      }, // TODO: convert this to an overridable calculated value.

      armorClass: {
        _type: {
          name: 'ArmorClass',
          properties: [
            {
              key: 'value',
              typeData: {
                type: 'number'
              }
            },
            {
              key: 'useCalculation',
              typeData: {
                type: 'boolean'
              }
            },
            {
              key: 'calculation',
              typeData: {
                type: 'Calculation'
              }
            }
          ]
        },
        value: 10,
        useCalculation: false,
        calculation: {
          _type: {
            name: 'Calculation',
            properties: [
              {
                _type: {
                  name: 'RequiredValue',
                  properties: [
                    {
                      key: 'name',
                      typeData: {
                        type: 'string'
                      }
                    },
                    {
                      key: 'path',
                      typeData: {
                        type: 'string'
                      }
                    }
                  ]
                },
                key: 'formula',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'requiredValues',
                typeData: {
                  type: 'RequiredValue',
                  isArray: true
                }
              }
            ]
          },
          formula: '*{${spd} + ${dexMod}}',
          requiredValues: [
            {
              _type: {
                name: 'RequiredValue',
                properties: [
                  {
                    key: 'name',
                    typeData: {
                      type: 'string'
                    }
                  },
                  {
                    key: 'path',
                    typeData: {
                      type: 'string'
                    }
                  }
                ]
              },
              name: 'dexMod',
              path: 'data/stats/Dexterity/modifier/value'
            },
            {
              _type: {
                name: 'RequiredValue',
                properties: [
                  {
                    key: 'name',
                    typeData: {
                      type: 'string'
                    }
                  },
                  {
                    key: 'path',
                    typeData: {
                      type: 'string'
                    }
                  }
                ]
              },
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
        _type: {
          name: 'Initiative',
          properties: [
            {
              key: 'value',
              typeData: {
                type: 'number'
              }
            },
            {
              key: 'useCalculation',
              typeData: {
                type: 'boolean'
              }
            },
            {
              key: 'calculation',
              typeData: {
                type: 'Calculation'
              }
            },
          ]
        },
        value: 0,
        useCalculation: false,
        calculation: {
          _type: {
            name: 'Calculation',
            properties: [
              {
                _type: {
                  name: 'RequiredValue',
                  properties: [
                    {
                      key: 'name',
                      typeData: {
                        type: 'string'
                      }
                    },
                    {
                      key: 'path',
                      typeData: {
                        type: 'string'
                      }
                    }
                  ]
                },
                key: 'formula',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'requiredValues',
                typeData: {
                  type: 'RequiredValue',
                  isArray: true
                }
              }
            ]
          },
          formula: '*{${spd} + ${dexMod}}',
          requiredValues: [
            {
              _type: {
                name: 'RequiredValue',
                properties: [
                  {
                    key: 'name',
                    typeData: {
                      type: 'string'
                    }
                  },
                  {
                    key: 'path',
                    typeData: {
                      type: 'string'
                    }
                  }
                ]
              },
              name: 'dexMod',
              path: 'data/stats/Dexterity/modifier/value'
            },
            {
              _type: {
                name: 'RequiredValue',
                properties: [
                  {
                    key: 'name',
                    typeData: {
                      type: 'string'
                    }
                  },
                  {
                    key: 'path',
                    typeData: {
                      type: 'string'
                    }
                  }
                ]
              },
              name: 'spd',
              path: 'data/speed'
            }
          ]
        }
      },

      info: [
        {
          _type: {
            name: 'Info',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'description',
                typeData: {
                  type: 'string',
                  useTextarea: true
                }
              }
            ]
          },
          name: 'Race',
          description: 'Half-Elf'
        }
      ],
      notes: [],
      stats: [
        {
          _type: {
            name: 'Stat',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'description',
                typeData: {
                  type: 'string',
                  useTextarea: true
                }
              },
              {
                key: 'score',
                typeData: {
                  type: 'number'
                }
              },
              {
                key: 'saveProficient',
                typeData: {
                  type: 'boolean'
                }
              }
            ]
          },
          name: 'Strength',
          description: 'Measuring physical power.',
          score: 10,
          saveProficient: false
        },
        {
          _type: {
            name: 'Stat',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'description',
                typeData: {
                  type: 'string',
                  useTextarea: true
                }
              },
              {
                key: 'score',
                typeData: {
                  type: 'number'
                }
              },
              {
                key: 'saveProficient',
                typeData: {
                  type: 'boolean'
                }
              }
            ]
          },
          name: 'Dexterity',
          description: 'Measuring agility',
          score: 10,
          saveProficient: false
        },
        {
          _type: {
            name: 'Stat',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'description',
                typeData: {
                  type: 'string',
                  useTextarea: true
                }
              },
              {
                key: 'score',
                typeData: {
                  type: 'number'
                }
              },
              {
                key: 'saveProficient',
                typeData: {
                  type: 'boolean'
                }
              }
            ]
          },
          name: 'Constitution',
          description: 'Measuring endurance',
          score: 10,
          saveProficient: false
        },
        {
          _type: {
            name: 'Stat',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'description',
                typeData: {
                  type: 'string',
                  useTextarea: true
                }
              },
              {
                key: 'score',
                typeData: {
                  type: 'number'
                }
              },
              {
                key: 'saveProficient',
                typeData: {
                  type: 'boolean'
                }
              }
            ]
          },
          name: 'Intelligence',
          description: 'Measuring reasoning and memory',
          score: 10,
          saveProficient: false
        },
        {
          _type: {
            name: 'Stat',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'description',
                typeData: {
                  type: 'string',
                  useTextarea: true
                }
              },
              {
                key: 'score',
                typeData: {
                  type: 'number'
                }
              },
              {
                key: 'saveProficient',
                typeData: {
                  type: 'boolean'
                }
              }
            ]
          },
          name: 'Wisdom',
          description: 'Measuring perception and insight',
          score: 10,
          saveProficient: false
        },
        {
          _type: {
            name: 'Stat',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'description',
                typeData: {
                  type: 'string',
                  useTextarea: true
                }
              },
              {
                key: 'score',
                typeData: {
                  type: 'number'
                }
              },
              {
                key: 'saveProficient',
                typeData: {
                  type: 'boolean'
                }
              }
            ]
          },
          name: 'Charisma',
          description: 'Measuring force of personality',
          score: 10,
          saveProficient: false
        }
      ],
      skills: [
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Athletics',
          stat: 'Strength',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Acrobatics',
          stat: 'Dexterity',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Sleight of Hand',
          stat: 'Dexterity',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Stealth',
          stat: 'Dexterity',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Arcana',
          stat: 'Intelligence',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'History',
          stat: 'Intelligence',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Investigation',
          stat: 'Intelligence',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Nature',
          stat: 'Intelligence',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Religion',
          stat: 'Intelligence',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Animal Handling',
          stat: 'Wisdom',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Insight',
          stat: 'Wisdom',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Medicine',
          stat: 'Wisdom',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Perception',
          stat: 'Wisdom',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Survival',
          stat: 'Wisdom',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Deception',
          stat: 'Charisma',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Intimidation',
          stat: 'Charisma',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Performance',
          stat: 'Charisma',
          proficiency: 'none'
        },
        {
          _type: {
            name: 'Skill',
            properties: [
              {
                key: 'name',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'stat',
                typeData: {
                  type: 'string'
                }
              },
              {
                key: 'proficiency',
                typeData: {
                  type: 'enum',
                  options: [
                    'none',
                    'half',
                    'full',
                    'expertise'
                  ]
                }
              },
            ]
          },
          name: 'Persuasion',
          stat: 'Charisma',
          proficiency: 'none'
        },
      ]
    },
  
    types: [
      {
        name: 'LevelConstant',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'level',
            typeData: {
              type: 'number'
            }
          },
          {
            key: 'proficiencyBonus',
            typeData: {
              type: 'number'
            }
          },
          {
            key: 'requiredExpierence',
            typeData: {
              type: 'number'
            }
          },
        ]
      },
      {
        name: 'Info',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'description',
            typeData: {
              type: 'textarea'
            }
          },
        ]
      },
      {
        name: 'Note',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'description',
            typeData: {
              type: 'textarea'
            }
          },
        ]
      },
      {
        name: 'HitDie',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'value',
            typeData: {
              type: 'string'
            }
          }
        ]
      },
      {
        name: 'Speed',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'value',
            typeData: {
              type: 'string'
            }
          }
        ]
      },
      {
        name: 'Proficiency',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          }
        ]
      },
      {
        name: 'Feature',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'description',
            typeData: {
              type: 'textarea'
            }
          }
        ]
      },
      {
        name: 'HitPoints',
        properties: [
          {
            key: 'max',
            typeData: {
              type: 'number'
            }
          },
          {
            key: 'current',
            typeData: {
              type: 'number'
            }
          },
          {
            key: 'temp',
            typeData: {
              type: 'number'
            }
          }
        ]
      },
      {
        name: 'Initiative',
        properties: [
          {
            key: 'value',
            typeData: {
              type: 'number'
            }
          },
          {
            key: 'calculation',
            typeData: {
              type: 'Calculation'
            }
          }
        ]
      },
      {
        name: 'Stat',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'description',
            typeData: {
              type: 'textarea'
            }
          },
          {
            key: 'scrore',
            typeData: {
              type: 'number'
            }
          },
          {
            key: 'isSaveProficient',
            typeData: {
              type: 'boolean'
            }
          }
        ]
      },
      {
        name: 'Skill',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'stat',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'proficiency',
            typeData: {
              type: 'enum',
              options: [
                'none',
                'half',
                'full',
                'expertise'
              ]
            }
          }
        ]
      },
      {
        name: 'SpellCasting',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'ability',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'save',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'attackBonus',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'spellSlots',
            typeData: {
              type: 'SpellSlot',
              isArray: true
            }
          },
          {
            key: 'spells',
            typeData: {
              type: 'Spell',
              isArray: true
            }
          }
        ]
      },
      {
        name: 'SpellSlot',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'available',
            typeData: {
              type: 'number'
            }
          },
          {
            key: 'maximum',
            typeData: {
              type: 'number'
            }
          }
        ]
      },
      {
        name: 'Spell',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'description',
            typeData: {
              type: 'string',
              useTextArea: true
            }
          },
          {
            key: 'type',
            typeData: {
              type: 'enum',
              options: [
                'Custom'
              ]
            }
          },
          {
            key: 'school',
            typeData: {
              type: 'enum',
              options: [
                'Custom'
              ]
            }
          },
          {
            key: 'timeToCast',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'range',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'duration',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'components',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'level',
            typeData: {
              type: 'string'
            }
          }
        ]
      },
      {
        name: 'Equipment',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'description',
            typeData: {
              type: 'string',
              useTextArea: true
            }
          },
          {
            key: 'type',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'rarity',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'weight',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'weaponCategory',
            typeData: {
              type: 'enum',
              options: [
                'none', 'simple', 'martial'
              ]
            }
          },
          {
            key: 'properties',
            typeData: {
              type: 'string',
              isArray: true
            }
          },
          {
            key: 'range',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'damage',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'isFirearm',
            typeData: {
              type: 'boolean'
            }
          },
          {
            key: 'isWeapon',
            typeData: {
              type: 'boolean'
            }
          },
          {
            key: 'armorClass',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'ammoType',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'quantity',
            typeData: {
              type: 'number'
            }
          },
          {
            key: 'value',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'isEquipped',
            typeData: {
              type: 'boolean'
            }
          },
          {
            key: 'conditions',
            typeData: {
              type: 'Condition',
              isArray: true
            }
          },
          {
            key: 'actions',
            typeData: {
              type: 'Action',
              isArray: true
            }
          },
          {
            key: 'bonusActions',
            typeData: {
              type: 'BonusAction',
              isArray: true
            }
          },
          {
            key: 'reactions',
            typeData: {
              type: 'Reaction',
              isArray: true
            }
          },
          {
            key: 'modifiers',
            typeData: {
              type: 'Modifier',
              isArray: true
            }
          },
        ]
      },
      {
        name: 'Condition',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'description',
            typeData: {
              type: 'string',
              useTextArea: true
            }
          }
        ]
      },
      {
        name: 'Action',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'description',
            typeData: {
              type: 'string',
              useTextArea: true
            }
          }
        ]
      },
      {
        name: 'BonusAction',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'description',
            typeData: {
              type: 'string',
              useTextArea: true
            }
          }
        ]
      },
      {
        name: 'Reaction',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'description',
            typeData: {
              type: 'string',
              useTextArea: true
            }
          }
        ]
      },
      {
        name: 'Modifier',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'type',
            typeData: {
              type: 'enum',
              options: [
                'add',
                'override'
              ]
            }
          },
          {
            key: 'target',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'value',
            typeData: {
              type: 'BasedOffTargetAndType'
            }
          }
        ]
      },
      {
        name: 'RequiredValue',
        properties: [
          {
            key: 'name',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'path',
            typeData: {
              type: 'string'
            }
          }
        ]
      },
      {
        name: 'Calculation',
        properties: [
          {
            key: 'formula',
            typeData: {
              type: 'string'
            }
          },
          {
            key: 'requiredValues',
            typeData: {
              type: 'RequiredValue',
              isArray: true
            }
          }
        ]
      }
    ]
  }
]