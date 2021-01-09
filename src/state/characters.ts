import { newRidgeState } from 'react-ridge-state'

import { getCharacters, createCharacter } from '../services/db'

import { Character } from '../types'

interface CharState {
  isLoaded: boolean
  characters: Character[]
  characterID: string
  currentRevision: string
}

export const charsState = newRidgeState<CharState>({
  isLoaded: false,
  characters: [],
  characterID: '',
  currentRevision: ''
})

export const createChar = (sys: string) => {
  createCharacter(sys)
}

export const loadAll = () => {
  getCharacters().then(characters => {
    charsState.set({
      characters,
      isLoaded: true,
      characterID: '',
      currentRevision: ''
    })
  })
}

export const setCurrentCharacter = (id: string) => {
  const { isLoaded, characters } = charsState.get()

  // if we're loaded we should just set stuff
  if (isLoaded) {
    const char = characters.find(c => c._id === id)

    // if we don't have this character don't do anything
    if (!char) return

    charsState.set({
      characters,
      isLoaded,
      characterID: id,
      currentRevision: char._rev
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
        characterID: char ? char._id : '',
        currentRevision: char ? char._rev : ''
      })
    })
  }
}

export const getCharacter = (id: string, cb) => {
  const { isLoaded, characters } = charsState.get()

  // if we're loaded we should just set stuff
  if (!isLoaded) return cb(false, false)

  const char = characters.find(c => c._id === id)

  // if we don't have this character don't do anything
  if (!char) return cb(true, false)

  charsState.set({
    characters,
    isLoaded,
    characterID: id,
    currentRevision: char._rev
  })

  return cb(false, true)
}
