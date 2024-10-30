import { newRidgeState } from 'react-ridge-state'

import { produce } from 'immer'

import Storage from '../lib/storage'

import { type CharacterData } from './character'
import { SystemData } from './systems'

export const charactersState = newRidgeState<CharacterData[]>([])

export async function loadCharacters() {
  try {
    let chars: CharacterData[] = []

    const names = await Storage.keys()

    for (let n = 0; n < names.length; n++) {
      const char = await Storage.get(names[n])

      chars.push(char)
    }

    charactersState.set(chars)
  } catch(e) {
    // TODO: show error message to user.
    charactersState.set([])
  }
}

loadCharacters()

export function createCharacter(name: string, system: SystemData) {
  const character = { id: '', name, system, data: system.defaultCharacterData, ownerID: '', version: '', createdAt: '', updatedAt: '' }
  charactersState.set((prevState) => [ ...prevState, character ])
  Storage.set(character.name, character)
}

export function deleteCharacter(name: string) {
  charactersState.set((prevState) => prevState.filter((char) => char.name !== name))
  Storage.remove(name)
}

function getDefaultData(): { [key: string]: any } {
  return {
    info: [],
    stats: [],
    savingThrows: [],
    skills: [],
    spells: [],
    equipment: [],
  }
}
