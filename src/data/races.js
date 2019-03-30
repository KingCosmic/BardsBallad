import { sizes } from './constants';

const { small, medium } = sizes;

// our SRD races data formatted to make automation
// a working feature. (even if properties aren't in use
// they're here in the best format we believe will work.)
const races = [
  {
    id: 'vllpcwelpmspanzhztkcsdvw',
    name: 'Dragonborn',
    size: medium,
    speed: 30,
    languages: ['common', 'draconic'],
    abs: [
      { ability: 'strength', amount: 2 },
      { ability: 'charisma', amount: 1 }
    ],
  },
  {
    id: 'esfkmeagmajtxnqetxmpugaz',
    name: 'Dwarf',
    size: medium,
    speed: 25,
    languages: ['common', 'dwarvish'],
    abs: [
      { ability: 'constitution', amount: 2 }
    ],
    feats: [
      {
        name: 'Stonecunning', uses: 0, id: 'wyahcvclkqdjvrtffaultbbq',
        description: 'Whenever you make an intelligence (History check related to the oriigin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.'
      },
      {
        name: 'Darkvision', uses: 0, id: 'qghnngmxvuhxgtslmjvfqgqu',
        description: 'Accustomed to life underground, you have superior vision in the dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darknes, only shades of grey'
      }
    ],
    proficiencies: [
      'battleaxe', 'handaxe', 'light hammer', 'warhammer',
      { type: 'choice', options: ['smith\'s tools', 'brewer\'s supplies', 'mason\'s tools'] }
    ]
  },
  // TODO: Hill Dwarf
  {
    id: '',
    name: 'Elf',
    size: medium,
    speed: 30,
    languages: ['common', 'elvish'],
    abs: [
      { ability: 'dexterity', amount: 2 }
    ],
    feats: [
      {
        name: 'Darvision', uses: 0, id: '',
        description: 'Accustomed to twilight forests and the night sky, you have superior vision in the dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.'
      },
      {
        name: 'Trance', uses: 0, id: '',
        description: 'Elves don\'t need to sleep. Instead, they meditate deeply, remaining semiconscious, for 4 hours a day. (The common word for such meditation is "trance".) While meditating, you can dream after a fashion; such dreams are actually mental exercises that have become reflexive through years of practice. After resting in this way, you gain the same benefit that a human does from 8 hours of sleep.'
      }
    ],
    proficiencies: [
      { type: 'skill', value: 'perception' }
    ]
  },
  // TODO: High Elf
  {
    id: '',
    name: 'Gnome',
    size: small,
    speed: 25,
    languages: ['common', 'gnomish'],
    abs: [
      { ability: 'intelligence', amount: 2 }
    ],
    feats: [
      {
        name: 'Gnome Cunning', uses: 0, id: '',
        description: 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.'
      }
    ],
  },
  // TODO: Rock Gnome
  {
    id: '',
    name: 'Half-Elf',
    size: medium,
    speed: 30,
    languages: ['common', 'elvish', { type: 'choice', options: [] }],
    abs: [
      { ability: 'charisma', amount: 2 },
      { ability: 'choice', amount: 1 },
      { ability: 'choice', amount: 1 }
    ],
    feats: [
      {
        name: 'Darkvision', uses: 0, id: '',
        description: 'Thanks to your elf blood, you have superior vision in dark and dim conditions. You can see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.'
      },
      {
        name: 'Fey Ancestry', uses: 0, id: '',
        description: 'You have advantage on saving throws against being charmed, and magic can\'t put you to sleep.'
      }
    ],
    proficiencies: [
      { type: 'choice', options: 'skills' },
      { type: 'choice', options: 'skills' }
    ]
  },

  {
    id: '',
    name: 'Half-Orc',
    size: medium,
    speed: 30,
    languages: ['common', 'orc'],
    abs: [
      { ability: 'strength', amount: 2 },
      { ability: 'constitution', amount: 1 }
    ],
    feats: [
      {
        name: 'Darkvision', uses: 0, id: '',
        description: 'Thanks to your orc blood, you have superior vision in dark and dim conditions. You cam see in dim light within 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray.'
      },
      {
        name: 'Relentless Endurance', uses: 1, id: '',
        description: 'When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead, You can\'t use this feature again until you finish a long rest.'
      },
      {
        name: 'Savage Attacks', uses: 0, id: '',
        description: 'When you score a critical hit with a melle weapon attack, you can roll one of the weapons damage dice one additional time and add it to the extra damage of the critical hit.'
      }
    ],
    proficiencies: [
      { type: 'skill', value: 'intimidation' }
    ]
  },

  {
    id: '',
    name: 'Halfling',
    size: small,
    speed: 25,
    languages: ['common', 'halfling'],
    abs: [
      { ability: 'dexterity', amount: 2 }
    ],
    feats: [
      {
        name: 'Lucky', uses: 0, id: '',
        description: 'When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.'
      },
      {
        name: 'Brave', uses: 0, id: '',
        description: 'You have advantage on saving throws agaisnt being frightened.'
      },
      {
        name: 'Halfling Nimbleness', uses: 0, id: '',
        description: 'You can move through the space of any creature that is of a size larger than yours.'
      }
    ]
  },
  // TODO: Add lightfoot halfing

  {
    id: '',
    name: 'Human',
    size: medium,
    speed: 30,
    languages: ['common', { type: 'choice', options: 'all' }],
    abs: [
      { ability: 'strength', amount: 1 },
      { ability: 'dexterity', amount: 1 },
      { ability: 'constitution', amount: 1 },
      { ability: 'intelligence', amount: 1 },
      { ability: 'wisdom', amount: 1 },
      { ability: 'charisma', amount: 1 }
    ]
  },

  {
    id: '',
    name: 'Tiefling',
    size: medium,
    speed: 30,
    languages: ['common', 'infernal'],
    abs: [
      { ability: 'intelligence', amount: 1 },
      { ability: 'charisma', amount: 2 }
    ],
    feats: [
      {
        name: 'Darkvision', uses: 0, id: '',
        description: 'Thanks to your infernal heritage, you have a superior vision in dark and dim conditions. You can see in dim light withing 60 feet of you as if it were bright light, and in darkness as if it were dim light. You can\'t discern color in darkness, only shades of gray'
      },
      {
        name: 'Hellish Resistance', uses: 0, id: '',
        description: 'You have resistance to fire damage'
      },
      {
        name: 'Infernal Legacy', uses: 0, id: '',
        description: 'You know the Thaumaturgy cantrip. When you reach 3rd level, you can cast the hellish rebuke spell as a 2nd-level spell once with this trait and regain the ability to do so when you finish a long rest. When you reach 5th level, you can cast the darkness spell once with this trait and regain the ability to do so when you finish a long rest. Charisma is your spellcasting ability for these spells.'
      }
    ]
  }
]

export default races;