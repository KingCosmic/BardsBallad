import { newRidgeState } from 'react-ridge-state'

import { CharacterStorage } from '../lib/storage'

import { type CharacterData } from './character'
import { SystemData } from './systems'
import { produce } from 'immer'

export const charactersState = newRidgeState<CharacterData[]>([])

export async function loadCharacters() {
  try {
    let chars: CharacterData[] = []

    const names = await CharacterStorage.keys()

    for (let n = 0; n < names.length; n++) {
      const char = await CharacterStorage.get(names[n])

      chars.push(char)
    }

    charactersState.set(chars)
  } catch(e) {
    // TODO: show error message to user.
    charactersState.set([])
  }
}

loadCharacters()

export function setCharacterData(name: string, data: CharacterData) {
  const characters = charactersState.get()

  const newCharacters = produce(characters, draft => {
    const index = draft.findIndex(c => c.name === name)

    if (index === -1) return draft

    draft[index] = data

    return draft
  })

  charactersState.set(newCharacters)
}

export function createCharacter(name: string, system: SystemData) {
  const character = { id: '', name, system, data: system.defaultCharacterData, ownerID: '', version: '', createdAt: '', updatedAt: '' }
  charactersState.set((prevState) => [ ...prevState, character ])
  CharacterStorage.set(character.name, character)
}

export function deleteCharacter(name: string) {
  charactersState.set((prevState) => prevState.filter((char) => char.name !== name))
  CharacterStorage.remove(name)
}
