import localforage from 'localforage'

import api from './api'

import { cloneDeep } from 'lodash'

import { nanoid } from 'nanoid'

import { createCharacter as createChar, SkillNames } from '../system'

import { charsState } from '../state/characters'

import { Character, Spell, Item, Feat } from '../types'

export function syncCharacters() {
  api.loadCharacters()
  .then(chars => {
    saveCharacters(chars).then(() => {
      localStorage.setItem('synced', 'true')
    })
  })
}

export function generateID() {
  return nanoid()
}

export function changeName(name:string): Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      char.name = name

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function changeJob(job: string): Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      char.job = job

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function changeExp(exp: number): Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      char.exp = exp

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

type HP = {
  current:number
  max:number
  temp:number
}

export function changeHp(hp:HP):Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      char.hp = hp

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function changeAC(ac:number):Promise<boolean> {
  const state = charsState.get();

  const id = state.characterID;

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      char.ac = ac

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function changeSpeed(spd:number):Promise<boolean> {
  const state = charsState.get();

  const id = state.characterID;

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      char.speed = spd

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function changeInitiative(init:number):Promise<boolean> {
  const state = charsState.get();

  const id = state.characterID;

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      char.initiative = init

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function changePP(pp:number):Promise<boolean> {
  const state = charsState.get();

  const id = state.characterID;

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      char.passivePerception = pp

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function changeHitDice(hd:string):Promise<boolean> {
  const state = charsState.get();

  const id = state.characterID;

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      char.hitdice = hd

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function changeStat(stat:string, value:number):Promise<boolean> {
  const state = charsState.get();

  const id = state.characterID;

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      if (char.stats[stat]) char.stats[stat] = value

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function addItem(item: Item): Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      char.items.push(item)

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function editItem(updatedItem: Item): Promise<boolean> {
  const state = charsState.get()
  
  const id = state.characterID

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      for (let c = 0; c < char.items.length; c++) {
        let item = char.items[c]

        if (item.id === updatedItem.id) {
          char.items[c] = updatedItem

          char.updatedAt = new Date().toISOString();
        }
      }
    }

    return char
  })

  return saveCharacters(characters)
}

export function deleteItem(itemID: string) {
  const state = charsState.get()

  const id = state.characterID

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      char.items = char.items.filter(item => item.id !== itemID)

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function addSpell(spell: Spell): Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      const spellSlot = char.spellSlots.find((slot) => slot.level === spell.level)

      if (!spellSlot) char.spellSlots.push({
        level: spell.level,
        current: 1,
        max: 1
      })

      char.spells.push(spell)

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function editSpell(updatedSpell: Spell) {
  const state = charsState.get()

  const id = state.characterID

  const characters = cloneDeep(state.characters).map(char => {
      if (char._id === id) {
        for (let c = 0; c < char.spells.length; c++) {
          let spell = char.spells[c]

          if (spell.id === updatedSpell.id) {
            char.spells[c] = updatedSpell

            char.updatedAt = new Date().toISOString();
          }
        }
      }

      return char
    })

  return saveCharacters(characters)
}

export function deleteSpell(spellID: string) {
  const state = charsState.get()

  const id = state.characterID

  const characters = cloneDeep(state.characters).map(char => {
      if (char._id === id) {
        char.spells = char.spells.filter(spell => spell.id !== spellID)

        char.updatedAt = new Date().toISOString();
      }

      return char
    }
  )

  return saveCharacters(characters)
}

export function addFeat(feat:Feat):Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      char.feats.push(feat)

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function editFeat(updatedFeat:Feat) {
  const state = charsState.get()

  const id = state.characterID

  const characters = cloneDeep(state.characters).map(char => {
      if (char._id === id) {
        for (let c = 0; c < char.feats.length; c++) {
          let feat = char.feats[c]

          if (feat.id === updatedFeat.id) {
            char.feats[c] = updatedFeat

            char.updatedAt = new Date().toISOString();
          }
        }
      }

      return char
    })

  return saveCharacters(characters)
}

export function deleteFeat(featID: string) {
  const state = charsState.get()

  const id = state.characterID

  const characters = cloneDeep(state.characters).map(char => {
      if (char._id === id) {
        char.feats = char.feats.filter(feat => feat.id !== featID)

        char.updatedAt = new Date().toISOString();
      }

      return char
    }
  )

  return saveCharacters(characters)
}

export function toggleSave(save: string, value: boolean) {
  const state = charsState.get()

  const id = state.characterID

  // make sure it's a valid save.
  if (!['charisma', 'constitution', 'dexterity', 'strength', 'intelligence', 'wisdom'].includes(save))
    return false

  const characters = (cloneDeep(state.characters) as Character[]).map((char) => {
    if (char._id === id) {
      char.savingThrows[save] = value

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export async function setSkillProficiency(skill: string, value: number): Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  // make sure it's a valid skill.
  if (!Object.values(SkillNames).includes(skill)) return false

  const characters = cloneDeep(state.characters).map(char => {
    if (char._id === id) {
      char.skills[skill] = value

      char.updatedAt = new Date().toISOString();
    }

    return char
  })

  return saveCharacters(characters)
}

export function createCharacter(sys: string): Promise<boolean> {
  const state = charsState.get()

  return saveCharacters([...state.characters, createChar(sys)], { isLoaded: true })
}

export function deleteCharacter(id: string): Promise<boolean> {
  const state = charsState.get()

  return saveCharacters(state.characters.filter(char => char._id !== id))
}

export function getCharacters():Promise<Character[]> {
  return new Promise((resolve, reject) => {
    localforage.getItem('characters')
    .then((characters:Character[]) => resolve(characters || []))
    .catch(reject)
  })
}

export function getCharacter(id:string):Promise<Character[]> {
  return new Promise((resolve, reject) => {
    localforage.getItem('characters').then((characters:Character[]) => {
      const char = characters.filter(c => c._id === id)
      resolve(char)
    })
    .catch(reject)
  })
}

// this function reduces code duplication,
export function saveCharacters(chars:Character[], extraState:object = {}):Promise<boolean> {
  return new Promise((resolve) => {
    const state = charsState.get()

    localforage.setItem('characters', chars).then(updatedCharacters => {
      charsState.set({
        ...state,
        ...extraState,
        characters: updatedCharacters,
      }, () => resolve(true))
    })
  })
}
