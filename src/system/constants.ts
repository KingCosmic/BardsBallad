import { Spell, Item, Feat } from '../types'

export const spellDefaults: Spell = {
  id: '',
  name: 'Custom Spell',
  level: 0,
  school: 'A',
  ritual: false,
  casttime: '',
  range: '',
  duration: '',
  concentration: false,
  verbal: false,
  somatic: false,
  material: '',
  description: '',
  higherlevels: '',
  source: ''
}

export const itemDefaults: Item = {
  id: '',
  name: 'Custom Item',
  rarity: 'none',
  type: 'G',
  range: '',
  properties: [],
  weight: 0,
  quantity: 1,
  value: 0,
  description: '',
  source: 'CUS'
}

export const featDefaults: Feat = {
  id: '',
  name: 'Custom Feature',
  source: 'CUS',
  uses: 0,
  description: ''
}

export const boolOptions = [
  { value: 'false', label: 'False' },
  { value: 'true', label: 'True' },
]

export const sizes = {
  T: 'Tiny',
  S: 'Small',
  M: 'Medium',
  L: 'Large',
  H: 'Huge',
  G: 'Gargantuan',
}

export const spellLevels = [
  { value: '0', label: 'Cantrip' },
  { value: '1', label: 'First' },
  { value: '2', label: 'Second' },
  { value: '3', label: 'Third' },
  { value: '4', label: 'Fourth' },
  { value: '5', label: 'Fifth' },
  { value: '6', label: 'Sixth' },
  { value: '7', label: 'Seventh' },
  { value: '8', label: 'Eigth' },
  { value: '9', label: 'Nineth' },
]

export const schoolTypes: { [key: string]: string } = {
  ALL: 'All',
  A: 'Abjuration',
  C: 'Conjuration',
  D: 'Divinitation',
  E: 'Enchantment',
  V: 'Evocation',
  I: 'Illusion',
  N: 'Necromancy',
  T: 'Transmutation',
}

export const schoolFilters = Object.keys(schoolTypes).map(key => ({
  value: key,
  label: schoolTypes[key],
}))

export const schoolOptions = schoolFilters.filter((key, index) => index !== 0)

export const statTypes: { [key: string]: string } = {
  AUTO: 'Automatic',
  STR: 'Strength',
  DEX: 'Dexterity',
  CON: 'Constitution',
  INT: 'Intelligence',
  WIS: 'Wisdom',
  CHA: 'Charisma',
}

export const statOptions = Object.keys(statTypes).map(key => ({
  value: key,
  label: statTypes[key],
}))

export const rarityTypes: { [key: string]: string } = {
  none: 'None',
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  'very rare': 'Very Rare',
  legendary: 'Legendary',
  artifact: 'Artifact',
  unknown: 'Unknown',
  'unknown (magic)': 'Unknown (Magic)',
  varies: 'Varies',
}

export const rarityOptions = Object.keys(rarityTypes).map(key => ({
  value: key,
  label: rarityTypes[key],
}))

export const itemTypes: { [key: string]: string } = {
  ALL: 'All',
  G: 'Adventuring Gear',
  LA: 'Light Armor',
  MA: 'Medium Armor',
  HA: 'Heavy Armor',
  S: 'Shield',
  M: 'Melee Weapon',
  R: 'Ranged Weapon',
  A: 'Ammunition',
  RD: 'Rod',
  T: 'Tools',
  ST: 'Staff',
  WD: 'Wand',
  RG: 'Ring',
  P: 'Potion',
  SC: 'Scroll',
  W: 'Wondrous Item',
  "$": 'Wealth',
  SCF: 'Spellcasting Focus',
  AT: 'Artison Tools',
  INS: 'Musical Instrument',
}

export const typeFilters = Object.keys(itemTypes).map(key => ({
  value: key,
  label: itemTypes[key],
}))

export const typeOptions = typeFilters.filter((key, index) => index !== 0)

export const damageTypes: { [key: string]: string } = {
  AUTO: 'Automatic',
  A: 'Acid',
  B: 'Bludgeoning',
  C: 'Cold',
  F: 'Fire',
  FO: 'Force',
  L: 'Lightning',
  N: 'Necrotic',
  P: 'Piercing',
  PO: 'Poison',
  PS: 'Psychic',
  R: 'Radiant',
  S: 'Slashing',
  T: 'Thunder',
}

export const damageOptions = Object.keys(damageTypes).map(key => ({
  value: key,
  label: damageTypes[key],
}))

export const propertyTypes: { [key: string]: string } = {
  LD: 'loading',
  L: 'light',
  F: 'finesse',
  T: 'thrown',
  H: 'heavy',
  R: 'reach',
  '2H': 'two-handed',
  V: 'versatile',
  S: 'special',
  RLD: 'reload',
  BF: 'Burst Fire',
  M: 'Martial',
  A: 'Ammunition',
}

export const propOptions = Object.keys(propertyTypes).map(key => ({
  value: key,
  label: propertyTypes[key],
}))
