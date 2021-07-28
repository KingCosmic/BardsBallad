import localforage from 'localforage'

import api from './api'

import { cloneDeep } from 'lodash'

import { nanoid } from 'nanoid'

import { createCharacter as createChar, SkillNames } from '../system'

import { charsState } from '../state/characters'

import { Character, Spell, Item, Feat, InfoObject } from '../types'
import { syncState, updateSyncData } from '../state/sync'
import { convertCharacters } from '../system/converters'

// TODO: change this to sync the local characters with the remote ones.
// currently it just loads the remote ones to local storage.
export async function syncCharacters(remote:boolean) {
  try {
    // are we syncing remotely? or are we just pulling the character data (first open application or not.)
    const charState = charsState.get();
    const sState = syncState.get();

    // are we syncing remotely?
    if (remote) {
      // if we're already syncing just return out.
      if (sState.isSyncing) return;

      // check our data to make sure we arent trying to sync nothing.
      if (sState.created.length === 0 && sState.updated.length === 0 && sState.deleted.length === 0) return;

      const copiedState = cloneDeep(sState);

      syncState.set({
        ...sState,
        created: [],
        updated: [],
        deleted: [],
        isSyncing: true
      }, async () => {
        const chars = await api.syncCharacters(copiedState, charState.characters)

        convertCharacters(chars)

        syncState.set(prevState => ({
          ...prevState,
          isSyncing: false
        }))
      })
    } else {
      api.loadCharacters()
      .then(async chars => {
        // grab our local characters
        let localChars = charState.characters;

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
  } catch (e) {}
}

export function generateID() {
  return nanoid(23)
}

export function updateInfo(info:InfoObject):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c = { ...c, ...info}

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function changeName(name:string):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.name = name

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function changeJob(job: string): Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.job = job

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function changeExp(exp: number): Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.exp = exp

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

type HP = {
  current:number
  max:number
  temp:number
}

export function changeHp(hp:HP):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.hp = hp

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function changeAC(ac:number):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.ac = ac

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function changeSpeed(speed:number):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.speed = speed

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function changeInitiative(init:number):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.initiative = init

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function changePP(pp:number):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.passivePerception = pp

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function changeHitDice(hd:string):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.hitdice = hd
        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function changeStat(stat:string, value:number):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID && c.stats[stat]) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.stats[stat] = value

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function addItem(item: Item): Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.items.push(item)

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function editItem(updatedItem: Item): Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        for (let i = 0; i < c.items.length; i++) {

          c.items[i] = updatedItem

          // set it's most recent update time.
          c.updatedAt = new Date().toISOString()
        }
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function deleteItem(itemID:string):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.items = c.items.filter(i => i.id !== itemID)

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function addSpell(spell:Spell):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.

        // check if we have spellslots for this level.
        const spellSlot = c.spellSlots.find((slot) => slot.level === spell.level)

        // if not make some.
        if (!spellSlot) c.spellSlots.push({
          level: spell.level,
          current: 1,
          max: 1
        })

        // add the spell
        c.spells.push(spell)

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function editSpell(updatedSpell:Spell):Promise<void> {
    let id = ''
    // update the characters info.
    charsState.set(previousState => ({
      ...previousState,
      characters: previousState.characters.map(c => {
        if (c._id === previousState.characterID) {
          // store the id of the character we're updating.
          id = previousState.characterID
  
          // update character.
          for (let i = 0; i < c.spells.length; i++) {
            let spell = c.spells[i]
  
            if (spell.id === updatedSpell.id) {
              c.spells[i] = updatedSpell
  
              // set it's most recent update time.
              c.updatedAt = new Date().toISOString()
            }
          }
        }
  
        // return it.
        return c
      })
    }))
  
    // update our syncData
    return updateSyncData([{
      id, 
      type: 'modified'
    }])
}

export function deleteSpell(spellID:string):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.spells = c.spells.filter(i => i.id !== spellID)

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function addFeat(feat:Feat):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.feats.push(feat)

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function editFeat(updatedFeat:Feat):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        for (let i = 0; i < c.feats.length; i++) {
          let feat = c.feats[i]

          if (feat.id === updatedFeat.id) {
            c.feats[i] = updatedFeat;

            // set it's most recent update time.
            c.updatedAt = new Date().toISOString()
          }
        }
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function deleteFeat(featID:string):Promise<void> {
  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.feats = c.feats.filter(f => f.id !== featID)

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function toggleSave(save:string, value:boolean):Promise<void> {
  // make sure it's a valid save.
  if (!['charisma', 'constitution', 'dexterity', 'strength', 'intelligence', 'wisdom'].includes(save)) return

  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.savingThrows[save] = value

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export async function setSkillProficiency(skill:string, value:number):Promise<void> {
  // make sure it's a valid skill.
  if (!Object.values(SkillNames).includes(skill)) return

  let id = ''
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.map(c => {
      if (c._id === previousState.characterID) {
        // store the id of the character we're updating.
        id = previousState.characterID

        // update character.
        c.skills[skill] = value

        // set it's most recent update time.
        c.updatedAt = new Date().toISOString()
      }

      // return it.
      return c
    })
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'modified'
  }])
}

export function createCharacter(sys:string):Promise<void> {
  const c = createChar(sys);
  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: [c, ...previousState.characters]
  }))

  // update our syncData
  return updateSyncData([{
    id: c._id, 
    type: 'new'
  }])
}

export function deleteCharacter(id:string):Promise<void> {


  // update the characters info.
  charsState.set(previousState => ({
    ...previousState,
    characters: previousState.characters.filter(c => c._id !== id)
  }))

  // update our syncData
  return updateSyncData([{
    id, 
    type: 'removed'
  }])
}