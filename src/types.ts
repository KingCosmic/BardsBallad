
export interface Feat {
  id?: string
  name: string
  uses?: number
  prerequisite?: { type: string, which: string, value: string }[]
  source: string
  description: string
  srd?: boolean
}

export interface Spell {
  level: number
  id: string
  name: string
  school: string
  source: string
  verbal: boolean
  somatic: boolean
  material: string
  casttime: string
  range: string
  duration: string
  concentration: boolean
  description: string
  higherlevels: string
  ritual: boolean
}

export interface Item {
  id?: string
  name: string
  // source is the name of the book it's from
  // usually PHB for srd items or for homebrew it's the id
  source: string
  type: string

  // one of [none | rare]
  rarity: string
  weight: number
  value: number

  description: string

  quantity?: number

  ac?: number

  dmg1?: string
  dmg2?: string
  dmgType?: string
  range?: string

  // total weight this container can hold
  containerCapacity?: number
  // is weightless?
  weightless?: boolean
  // items that this container holds
  items?: []

  tier?: string

  wondrous?: boolean

  // one of [simple | martial]
  weaponCategory?: string

  scfType?: string

  properties?: string[]
  // is this item srd? (used to show the disclaimer)
  srd?: boolean
}

export interface Slot {
  level: number
  current: number
  max: number
}

export interface Character {
  _id:string // id for the character.

  system: string // which system is this character for?
  ownerID: string // user id of the owner of this character

  name: string // name of this character
  race: string // race of this character
  age:number // age of this character
  job: string // what is this characters class (class is restricted so we use job instead)
  background: string // this characters background
  alignment: string // characters alignment
  exp: number // how much exp does this character have?

  avatar: string // the url of the characters avatar

  languages: string // characters languages

  conditions: []
  actions: []
  creatures: []

  castingClass: string
  castingAbility: string
  spellSlots: Slot[]
  castingDC: number
  castingBonus: number

  passivePerception: number

  initiative: number

  backstory: string

  ac: number

  inspiration: number

  hp: {
    current: number
    max: number
    temp: number
  },

  speed: number

  items: Item[],

  feats: Feat[],

  spells: Spell[],

  armorProfs: [],
  weaponProfs: [],
  toolProfs: [],

  savingThrows: {
    charisma: boolean,
    constitution: boolean,
    dexterity: boolean,
    intelligence: boolean,
    strength: boolean,
    wisdom: boolean
  },

  skills: {
    acrobatics: number,
    animalHandling: number,
    arcana: number,
    athletics: number,
    deception: number,
    history: number,
    insight: number,
    intimidation: number,
    investigation: number,
    medicine: number,
    nature: number,
    perception: number,
    performance: number,
    persuasion: number,
    religion: number,
    sleightOfHand: number,
    stealth: number,
    survival: number,
  },

  stats: {
    charisma: number,
    constitution: number,
    dexterity: number,
    intelligence: number,
    strength: number,
    wisdom: number
  },

  hitdice: string,

  deathsaves: {
    fails: number,
    success: number
  },

  createdAt:string,
  updatedAt:string
}

export interface InfoObject {
  name:string,
  job:string,
  background:string,
  race:string,
  alignment:string,
  age:number,
  backstory:string
}

export interface User {
  id:string,
  beta:boolean,
  email:string,
  iat:number,
  patreon:boolean
}
