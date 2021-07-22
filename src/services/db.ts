import localforage from 'localforage'

import api from './api'

import { cloneDeep } from 'lodash'

import { nanoid } from 'nanoid'

import { createCharacter as createChar, SkillNames } from '../system'

import { charsState, loadAll } from '../state/characters'

import { Character, Spell, Item, Feat, InfoObject } from '../types'
import { syncState } from '../state/sync'
import { convertCharacters } from '../system/converters'

// TODO: change this to sync the local characters with the remote ones.
// currently it just loads the remote ones to local storage.
export function syncCharacters(remote:boolean) {
  // are we syncing remotely? or are we just pulling the character data (first open application or not.)
  const charState = charsState.get();
  const sState = syncState.get();

  if (remote) {
    api.syncCharacters(sState, charState.characters)
    .then(chars => {
      // if characters are undefined it means our sync didnt have any data so just pretend it didnt happen.
      if (chars !== undefined) {
        saveCharacters(chars)
      }
    })
  } else {
    api.loadCharacters()
    .then(async chars => {
      // grab our local characters
      let localChars = charState.characters;

      // if we haven't loaded the local characters then laod em.
      if (!charState.isLoaded) {
        localChars = await loadAll()
      }
      // filter the remote characters by updatedAt field
      let filteredChars:Character[] = chars.filter((c:Character) => {
        // keep remote if we never deleted it client side.
        let keepRemote = sState.deleted.includes(c._id) ? false : true;
        let index = localChars.findIndex((lc) => {
          if (c._id === lc._id && keepRemote) {
            // calculate the time they was updatedAt
            var rTime = new Date(c.updatedAt).getTime();
            var lTime = new Date(lc.updatedAt).getTime();

            // check the difference in times.
            var time = rTime - lTime;

            // if the time is below zero that means the local version was changed after the remote one.
            if (time > 0) keepRemote = false;

            // return true so we get this index.
            return true;
          }

          // return false so we can find the index.
          return false;
        })

        // if we're keeping the remote character remove the local one.
        if (keepRemote && index !== -1) localChars.splice(index, 1);

        // return for the filter.
        return keepRemote;
      })

      // run our characters through a converter and then update our local state.
      convertCharacters(filteredChars.concat(localChars))
      .then(() => syncCharacters(true))
    })
  }
}

export function generateID() {
  return nanoid(23)
}

export function updateInfo(info:InfoObject):Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char = { ...char, ...info }

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function changeName(name:string):Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char.name = name

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function changeJob(job: string): Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char.job = job

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function changeExp(exp: number): Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char.exp = exp

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

type HP = {
  current:number
  max:number
  temp:number
}

export function changeHp(hp:HP):Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char.hp = hp

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function changeAC(ac:number):Promise<boolean> {
  const state = charsState.get();

  const id = state.characterID;

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char.ac = ac

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function changeSpeed(spd:number):Promise<boolean> {
  const state = charsState.get();

  const id = state.characterID;

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char.speed = spd

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function changeInitiative(init:number):Promise<boolean> {
  const state = charsState.get();

  const id = state.characterID;

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char.initiative = init

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function changePP(pp:number):Promise<boolean> {
  const state = charsState.get();

  const id = state.characterID;

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char.passivePerception = pp

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function changeHitDice(hd:string):Promise<boolean> {
  const state = charsState.get();

  const id = state.characterID;

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char.hitdice = hd

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function changeStat(stat:string, value:number):Promise<boolean> {
  const state = charsState.get();

  const id = state.characterID;

  const characters = state.characters.map(char => {
    if (char._id === id) {
      if (char.stats[stat]) char.stats[stat] = value

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function addItem(item: Item): Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char.items.push(item)

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function editItem(updatedItem: Item): Promise<boolean> {
  const state = charsState.get()
  
  const id = state.characterID

  const characters = state.characters.map(char => {
    if (char._id === id) {
      for (let c = 0; c < char.items.length; c++) {
        let item = char.items[c]

        if (item.id === updatedItem.id) {
          char.items[c] = updatedItem

          char.updatedAt = new Date().toISOString();
        }
      }
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function deleteItem(itemID: string) {
  const state = charsState.get()

  const id = state.characterID

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char.items = char.items.filter(item => item.id !== itemID)

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function addSpell(spell: Spell): Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = state.characters.map(char => {
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

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function editSpell(updatedSpell: Spell) {
  const state = charsState.get()

  const id = state.characterID

  const characters = state.characters.map(char => {
      if (char._id === id) {
        for (let c = 0; c < char.spells.length; c++) {
          let spell = char.spells[c]

          if (spell.id === updatedSpell.id) {
            char.spells[c] = updatedSpell

            char.updatedAt = new Date().toISOString();
          }
        }
      }

      return cloneDeep(char)
    })

  return saveCharacters(characters, id, 'modified')
}

export function deleteSpell(spellID: string) {
  const state = charsState.get()

  const id = state.characterID

  const characters = state.characters.map(char => {
      if (char._id === id) {
        char.spells = char.spells.filter(spell => spell.id !== spellID)

        char.updatedAt = new Date().toISOString();
      }

      return cloneDeep(char)
    }
  )

  return saveCharacters(characters, id, 'modified')
}

export function addFeat(feat:Feat):Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char.feats.push(feat)

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function editFeat(updatedFeat:Feat) {
  const state = charsState.get()

  const id = state.characterID

  const characters = state.characters.map(char => {
      if (char._id === id) {
        for (let c = 0; c < char.feats.length; c++) {
          let feat = char.feats[c]

          if (feat.id === updatedFeat.id) {
            char.feats[c] = updatedFeat

            char.updatedAt = new Date().toISOString();
          }
        }
      }

      return cloneDeep(char)
    })

  return saveCharacters(characters, id, 'modified')
}

export function deleteFeat(featID: string) {
  const state = charsState.get()

  const id = state.characterID

  const characters = state.characters.map(char => {
      if (char._id === id) {
        char.feats = char.feats.filter(feat => feat.id !== featID)

        char.updatedAt = new Date().toISOString();
      }

      return cloneDeep(char)
    }
  )

  return saveCharacters(characters, id, 'modified')
}

export function toggleSave(save: string, value: boolean) {
  const state = charsState.get()

  const id = state.characterID

  // make sure it's a valid save.
  if (!['charisma', 'constitution', 'dexterity', 'strength', 'intelligence', 'wisdom'].includes(save))
    return false

  const characters = state.characters.map((char) => {
    if (char._id === id) {
      char.savingThrows[save] = value

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export async function setSkillProficiency(skill: string, value: number): Promise<boolean> {
  const state = charsState.get()

  const id = state.characterID

  // make sure it's a valid skill.
  if (!Object.values(SkillNames).includes(skill)) return false

  const characters = state.characters.map(char => {
    if (char._id === id) {
      char.skills[skill] = value

      char.updatedAt = new Date().toISOString();
    }

    return cloneDeep(char)
  })

  return saveCharacters(characters, id, 'modified')
}

export function createCharacter(sys: string): Promise<boolean> {
  const state = charsState.get()

  var newChar = createChar(sys)

  return saveCharacters([...state.characters, newChar], newChar._id, 'new')
}

export function deleteCharacter(id: string): Promise<boolean> {
  const state = charsState.get()

  return saveCharacters(state.characters.filter(char => char._id !== id), id, 'removed')
}

export function getCharacters():Promise<Character[]> {
  return new Promise((resolve, reject) => {
    localforage.getItem('characters')
    // @ts-ignore
    .then((characters:Character[]) => resolve(characters || []))
    .catch(reject)
  })
}

export function getCharacter(id:string):Promise<Character[]> {
  return new Promise((resolve, reject) => {
    // @ts-ignore
    localforage.getItem('characters').then((characters:Character[]) => {
      const char = characters.filter(c => c._id === id)
      resolve(char)
    })
    .catch(reject)
  })
}

// this function reduces code duplication,
export function saveCharacters(chars:Character[], id?:string, type?:string):Promise<boolean> {
  return new Promise((resolve) => {
    const state = charsState.get()

    localforage.setItem('characters', chars).then(updatedCharacters => {
      charsState.set({
        ...state,
        characters: updatedCharacters,
      }, () => {
        if (id === undefined) return resolve(true);

        updateSyncData([{
          id, type
        }])
        .then(resolve)
      })
    })
  })
}

type SyncData = {
  id:string,
  type:string
}

// this function reduces code duplication,
export function updateSyncData(data:Array<SyncData>):Promise<boolean> {
  return new Promise((resolve) => {
    var syncData = syncState.get();

    for (let i = 0; i < data.length; i++) {
      const { type, id } = data[i];

      // adding a character.
      if (type === 'new') {
        // if we somehow already have this id, don't worry about it
        if (!syncData.created.includes(id)) syncData.created.push(id);
      }

      // we're changing a character
      else if (type === 'modified') {
        // don't add it if it already exists
        if (!syncData.updated.includes(id)) syncData.updated.push(id);
      }

      // we're removing a character
      else if (type === 'removed') {
        // if this character was made before we synced, just remove it from the sync data.
        if (syncData.created.includes(id)) {
          syncData.created = syncData.created.filter(newID => newID != id);
        }
        
        // otherwise we need to add it to the removed array if it isn't already.
        else if (!syncData.deleted.includes(id)) {
          syncData.deleted.push(id);
        }
      }
    }

    localforage.setItem('sync_data', syncData).then(data => {
      syncState.set(data, () => {
        resolve(true)
      })
    })
  })
}