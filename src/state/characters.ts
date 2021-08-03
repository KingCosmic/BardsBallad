import { newRidgeState } from 'react-ridge-state'
import localforage from 'localforage'

import { createCharacter, syncCharacters } from '../services/db'

import { Character } from '../types'
import { convertCharacters } from '../system/converters'
import { authState } from './auth'

interface CharState {
  isLoaded:boolean
  characters:Character[]
  characterID:string
}

export const charsState = newRidgeState<CharState>(
  {
    isLoaded: false,
    characters: [],
    characterID: ''
  },
  {
    onSet: async (newState) => {
      try {
        await localforage.setItem('characters', newState.characters)
      } catch(e) {}
    }
  }
)

export async function setInitialState() {
  const auth = authState.get()

  if (!auth.isLoggedIn) return

  try {
    // grab the item from storage.
    const initialState:Character[] = await localforage.getItem('characters') || []

    // check if our item exists.
    if (initialState) {
      // run our characters through the converters incase some are old.
      // this will set our state.
      convertCharacters(initialState);

      // sync the characters from the website after loading our local ones
      // better responsiveness this way.
      syncCharacters(false)
    }
  } catch (e) {
    console.log(`Error: ${e}`)
  }
}

// set state as our application starts.
setInitialState();

export const createChar = (sys: string) => {
  createCharacter(sys)
}

export const setCurrentCharacter = (id:string) => {
  charsState.set(prevState => ({
    ...prevState,
    characterID: id
  }))
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
