import { nanoid } from 'nanoid'

import { authState } from '../state/auth'

import { Character } from '../types'

export { getLevel } from './level'

export * from './constants'

export * from './skills'

// TODO: Import auth and use user id in creation
export function createCharacter(sys: string): Character {
  const { user } = authState.get()

  return {
    _id: nanoid(),
    ownerID: user.id,
    system: sys,
    name: 'Aliza CartWight',
    race: 'Half-Elf',
    job: 'Sorcerer',
    age: 20,
    background: 'Farmhand',
    alignment: 'Neutral/Good',
    exp: 0,
    avatar: 'https://cdn.discordapp.com/avatars/643624686420492340/9178a7cb490db40ad12eac27f5b4a096.webp',

    languages: 'common',

    conditions: [],
    actions: [],
    creatures: [],

    castingClass: 'WIZARD',
    castingAbility: 'INT',
    spellSlots: [],
    castingDC: 15,
    castingBonus: 7,

    passivePerception: 10,

    initiative: 0,

    backstory: 'Aliza Cartwright is a female farmhand who, when clergymen of the church found and killed her father for adultery, was forced to return to her mother\'s hovel in Estermeyer, where she grew up. Aliza, discontent with her new life and seeking medicine for her now-ailing mother returned to the scene of the murder to find some old family artifacts, but instead found the house nearly immaculate with a small entity sitting inside. Mittsie, as the creature identified itself, is a shadow spirit \'in training\', sent by her master Alevie to find and torment the people responsible for the murders',

    ac: 10,

    inspiration: 0,

    hp: {
      current: 8,
      max: 8,
      temp: 0
    },

    speed: 30,

    items: [],

    feats: [],

    spells: [],

    armorProfs: [],
    weaponProfs: [],
    toolProfs: [],

    savingThrows: {
      charisma: false,
      constitution: false,
      dexterity: false,
      intelligence: false,
      strength: false,
      wisdom: false
    },

    skills: {
      acrobatics: 0,
      animalHandling: 0,
      arcana: 0,
      athletics: 0,
      deception: 0,
      history: 0,
      insight: 0,
      intimidation: 0,
      investigation: 0,
      medicine: 0,
      nature: 0,
      perception: 0,
      performance: 0,
      persuasion: 0,
      religion: 0,
      sleightOfHand: 0,
      stealth: 0,
      survival: 0,
    },

    stats: {
      charisma: 10,
      constitution: 10,
      dexterity: 10,
      intelligence: 10,
      strength: 10,
      wisdom: 10
    },

    hitdice: '1d8',

    deathsaves: {
      fails: 0,
      success: 0
    },

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
}

// determin the modifier from a stat.
export const determinMod = (val: number) => Math.floor((val - 10) / 2)

export const renderReq = (prereqs: { type: string, which: string, value: string }[] = []) => {
  if (prereqs.length === 0) return ''

  return prereqs.map(({ type, which, value }) => {
    switch (type) {
      case 'ability':
        return `${value} ${which.toLowerCase()}`
      case 'race':
        return value
      case 'subrace':
        return value
      case 'prof':
        return `${value} proficiency`
      case 'level':
        return `level ${value}`
      case 'special':
        return value
      default:
        return ''
    }
  }).join(', ')
}