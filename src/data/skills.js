
const skills = {
  'acrobatics': 'dexterity',
  'animalHandling': 'wisdom',
  'arcana': 'intelligence',
  'athletics': 'strength',
  'deception': 'charisma',
  'history': 'intelligence',
  'insight': 'wisdom',
  'intimidation': 'charisma',
  'investigation': 'intelligence',
  'medicine': 'wisdom',
  'nature': 'intelligence',
  'perception': 'wisdom',
  'performance': 'charisma',
  'persuasion': 'charisma',
  'religion': 'intelligence',
  'sleightOfHand': 'dexterity',
  'stealth': 'dexterity',
  'survival': 'wisdom'
}

export const skillToStat = skill => skills[skill] || null

export default skills;