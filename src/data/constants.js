
export const spellDefaults = {
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
  higherlevels: ''
}

export const itemDefaults = {
  name: 'Custom Item',
  rarity: 'N',
  category: 'G',
  magic: false,
  attackStat: 'AUTO',
  attackBonus: '',
  damageStat: 'AUTO',
  additionalDamage: '',
  damage1: '2d6',
  damage2: '',
  range: '',
  longRange: '',
  properties: [],
  requirements: [],
  modifiers: [],
  weight: 0,
  quantity: 1,
  value: 0,
  desc: '',
  reqAttune: false,
  charges: '',
  sources: []
}

export const featDefaults = {
  name: 'Custom Feature',
  uses: 0,
  desc: ''
}

export const boolOptions = [{ value: false, label: 'False' }, { value: true, label: 'True' }]

export const sizes = {
  'T': 'Tiny', 'S': 'Small', 'M': 'Medium', 'L': 'Large', 'H': 'Huge', 'G': 'Gargantuan'
}

export const spellLevels = [
  { value: 0, label: 'Cantrip' }, { value: 1, label: 'First' }, { value: 2, label: 'Second' }, { value: 3, label: 'Third' }, { value: 4, label: 'Fourth' }, { value: 5, label: 'Fifth' }, { value: 6, label: 'Sixth' }, { value: 7, label: 'Seventh' }, { value: 8, label: 'Eigth' }, { value: 9, label: 'Nineth' }
]

export const schoolTypes = {
  'ALL': 'All', 'A': 'Abjuration', 'C': 'Conjuration', 'D': 'Divinitation', 'E': 'Enchantment',
  'V': 'Evocation', 'I': 'Illusion', 'N': 'Necromancy', 'T': 'Transmutation'
}

export const schoolFilters = Object.keys(schoolTypes).map(key => ({
  value: key,
  label: schoolTypes[key]
}))

export const schoolOptions = schoolFilters.filter((key, index) => index !== 0)

export const statTypes = {
  'AUTO': 'Automatic', 'STR': 'Strength', 'DEX': 'Dexterity', 'CON': 'Constitution',
  'INT': 'Intelligence', 'WIS': 'Wisdom', 'CHA': 'Charisma'
}

export const statOptions = Object.keys(statTypes).map(key => ({
  value: key,
  label: statTypes[key]
}))

export const rarityTypes = {
  'N': 'None', 'C': 'Common', 'U': 'Uncommon', 'R': 'Rare', 'VR': 'Very Rare',
  'L': 'Legendary', 'A': 'Artifact', 'UK': 'Unknown', 'UKM': 'Unknown (Magic)',
  'V': 'Varies'
}

export const rarityOptions = Object.keys(rarityTypes).map(key => ({
  value: key,
  label: rarityTypes[key]
}))

export const itemTypes = {
  'ALL': 'All', 'G': 'Adventuring Gear', 'LA': 'Light Armor', 'MA': 'Medium Armor', 'HA': 'Heavy Armor',
  'S': 'Shield', 'M': 'Melee Weapon', 'R': 'Ranged Weapon', 'A': 'Ammunition', 'RD': 'Rod', 'T': 'Tools',
  'ST': 'Staff', 'WD': 'Wand', 'RG': 'Ring', 'P': 'Potion', 'SC': 'Scroll', 'W': 'Wondrous Item',
  'WE': 'Wealth', 'SCF': 'Spellcasting Focus', 'AT': 'Artison Tools', 'INS': 'Musical Instrument'
}

export const typeFilters = Object.keys(itemTypes).map(key => ({
  value: key,
  label: itemTypes[key]
}))

export const typeOptions = typeFilters.filter((key, index) => index !== 0);

export const damageTypes = {
  'AUTO': 'Automatic', 'A': 'Acid', 'B': 'Bludgeoning', 'C': 'Cold', 'F': 'Fire', 'FO': 'Force',
  'L': 'Lightning', 'N': 'Necrotic', 'P': 'Piercing', 'PO': 'Poison',
  'PS': 'Psychic', 'R': 'Radiant', 'S': 'Slashing', 'T': 'Thunder'
}

export const damageOptions = Object.keys(damageTypes).map(key => ({
  value: key,
  label: damageTypes[key]
}))

export const propertyTypes = {
  'LD': 'loading', 'L': 'light', 'F': 'finesse', 'T': 'thrown',
  'H': 'heavy', 'R': 'reach', '2H': 'two-handed', 'V': 'versatile', 'S': 'special',
  'RLD': 'reload', 'BF': 'Burst Fire', 'M': 'Martial', 'A': 'Ammunition'
}

export const propOptions = Object.keys(propertyTypes).map(key => ({
  value: key,
  label: propertyTypes[key]
}))