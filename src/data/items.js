import { determinMod } from '../helpers';

/**
 * Man what did I get myself into having all this data to format oml
 */

const determinAC = (stat, base, boostLimit = 0) => (char) => {
  let boost = determinMod(char.stats[stat])

  if (boostLimit && boost > boostLimit) boost = boostLimit;

  return base + boost;
}

const items = [
  // light armor
  {
    type: 'armor',
    name: 'Padded',
    description: 'gives the wearer 11 + dex mod ac',
    weight: 8,
    stealth: true,
    cost: { amount: 5, pieces: 'gold' },
    modifiers: [
      { target: 'ac', amount: determinAC('dexterity', 11) }
    ]
  },
  {
    type: 'armor',
    name: 'Leather',
    description: 'gives the wearer 11 + dex mod ac',
    weight: 10,
    cost: { amount: 10, pieces: 'gold' },
    modifiers: [
      { target: 'ac', amount: determinAC('dexterity', 11) }
    ]
  },
  {
    type: 'armor',
    name: 'Studded Leather',
    description: 'gives the wearer 12 + dex mod ac',
    weight: 13,
    cost: { amount: 45, pieces: 'gold' },
    modifiers: [
      { target: 'ac', amount: determinAC('dexterity', 12) }
    ]
  },

  // medium armor
  {
    type: 'armor',
    name: 'Hide',
    description: 'gives the wearer 12 + dex mod (max 2) ac',
    weight: 12,
    cost: { amount: 10, pieces: 'gold' },
    modifiers: [
      { target: 'ac', amount: determinAC('dexterity', 12, 2) }
    ]
  },
  {
    type: 'armor',
    name: 'Chain shirt',
    description: 'gives the wearer 13 + dex mod (max 2) ac',
    weight: 20,
    cost: { amount: 50, pieces: 'gold' },
    modifiers: [
      { target: 'ac', amount: determinAC('dexterity', 13, 2) }
    ]
  },
  {
    type: 'armor',
    name: 'Scale mail',
    description: 'gives the wearer 14 + dex mod (max 2)',
    weight: 45,
    stealth: true,
    cost: { amount: 50, pieces: 'gold' },
    modifiers: [
      { target: 'ac', amount: determinAC('dexterity', 14, 2) }
    ]
  },
  {
    type: 'armor',
    name: 'Breastplate',
    description: 'gives the wearer 14 + dex mod (max 2) ac',
    weight: 20,
    cost: { amount: 400, pieces: 'gold' },
    modifiers: [
      { target: 'ac', amount: determinAC('dexterity', 14, 2) }
    ]
  },
  {
    type: 'armor',
    name: 'Half plate',
    description: 'gives the wearer 15 + dex mod (max 2) ac',
    weight: 40,
    stealth: true,
    cost: { amount: 750, pieces: 'gold' },
    modifiers: [
      { target: 'ac', amount: determinAC('dexterity', 15, 2) }
    ]
  },

  // heavy armor
  {
    type: 'armor',
    name: 'Ring mail',
    description: 'gives the wearer 14 ac',
    weight: 40,
    stealth: true,
    cost: { amount: 30, pieces: 'gold' },
    modifiers: [
      { target: 'ac', amount: 14 }
    ]
  },
  {
    type: 'armor',
    name: 'Chain mail',
    description: 'gives the wearer 16 ac',
    weight: 55,
    stealth: true,
    cost: { amount: 75, pieces: 'gold' },
    modifiers: [
      { target: 'ac', add: 16 }
    ],
    requirements: [
      { stat: 'strength', amount: 13 }
    ]
  },
  {
    type: 'armor',
    name: 'Splint',
    description: 'gives the wearer 17 ac',
    weight: 60,
    stealth: true,
    cost: { amount: 200, pieces: 'gold' },
    modifiers: [
      { target: 'ac', add: 17 }
    ],
    requirements: [
      { stat: 'strength', amount: 15 }
    ]
  },
  {
    type: 'armor',
    name: 'Plate',
    description: 'gives the wearer 18 ac',
    weight: 65,
    stealth: true,
    cost: { amount: 1500, pieces: 'gold' },
    modifiers: [
      { target: 'ac', add: 18 }
    ],
    requirements: [
      { stat: 'strength', amount: 18 }
    ]
  },

  // misc items
  {
    type: 'shield',
    name: 'Shield',
    cost: { amount: 10, pieces: 'gold' },
    weight: 6,
    modifiers: [
      { target: 'ac', amount: 2 }
    ]
  }
] 

export default items;