export const SkillNames = {
  AC: 'acrobatics',
  AH: 'animalHandling',
  AR: 'arcana',
  AT: 'athletics',
  DE: 'deception',
  HI: 'history',
  IN: 'insight',
  INT: 'intimidation',
  INV: 'investigation',
  MED: 'medicine',
  NAT: 'nature',
  PER: 'perception',
  PERF: 'performance',
  PERS: 'persuasion',
  REL: 'religion',
  SOH: 'sleightOfHand',
  STE: 'stealth',
  SUR: 'survival',
}

export const skills = {
  acrobatics: 'dexterity',
  animalHandling: 'wisdom',
  arcana: 'intelligence',
  athletics: 'strength',
  deception: 'charisma',
  history: 'intelligence',
  insight: 'wisdom',
  intimidation: 'charisma',
  investigation: 'intelligence',
  medicine: 'wisdom',
  nature: 'intelligence',
  perception: 'wisdom',
  performance: 'charisma',
  persuasion: 'charisma',
  religion: 'intelligence',
  sleightOfHand: 'dexterity',
  stealth: 'dexterity',
  survival: 'wisdom',
}

export const skillToStat = (skill: string): string | null =>
  skills[skill] || null
