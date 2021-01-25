import { newRidgeState } from 'react-ridge-state'

import { getCharacters, createCharacter } from '../services/db'

import { Character } from '../types'

interface CharState {
  isLoaded:boolean
  characters:Character[]
  characterID:string
}

export const charsState = newRidgeState<CharState>({
  isLoaded: false,
  characters: [],
  characterID: ''
})

export const createChar = (sys: string) => {
  createCharacter(sys)
}

export const loadAll = () => {
  getCharacters().then(characters => {
    charsState.set({
      characters,
      isLoaded: true,
      characterID: ''
    })
  })
}

export const setCurrentCharacter = (id:string) => {
  const { isLoaded, characters } = charsState.get()

  // if we're loaded we should just set stuff
  if (isLoaded) {
    const char = characters.find(c => c._id === id)

    // if we don't have this character don't do anything
    if (!char) return

    charsState.set({
      characters,
      isLoaded,
      characterID: id
    })
  } else {
    // if we aren't loaded, we should load then change
    getCharacters().then(characters => {
      const char = characters.find(c => c._id === id)

      // if we don't have this character we'll still load the rest
      // just don't set the current one
      charsState.set({
        characters,
        isLoaded: true,
        characterID: char ? char._id : ''
      })
    })
  }
}

export const getCharacter = (id:string, cb) => {
  const { isLoaded, characters } = charsState.get()

  // if we're loaded we should just set stuff
  if (!isLoaded) return cb(false, false)

  const char = characters.find(c => c._id === id)

  // if we don't have this character don't do anything
  if (!char) return cb(true, false)

  charsState.set({
    characters,
    isLoaded,
    characterID: id
  })

  return cb(false, true)
}
