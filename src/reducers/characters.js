import merge from 'lodash.merge';
import cloneDeep from 'lodash.clonedeep';

import nanoid from 'nanoid/generate';
import lowercased from 'nanoid-dictionary/lowercase';

import api from '../api';

/**
 * ACTIONS TYPES
 *
 * These here are our action types defined for later use
 */

import { SYNC_CHARACTER } from './update';

export const LOAD_ALL = 'LOAD_ALL_CHARACTERS'
export const LOAD_ONE = 'LOAD_ONE_CHARACTER'
export const CHANGE_CHARACTER = 'CHANGE_CHARACTER'
export const CREATE_CHARACTER = 'CREATE_CHARACTER'
export const UPDATE_CHARACTER = 'UPDATE_CHARACTER'

/**
 * ACTIONS
 *
 * Here we define our actions
 */
export const loadAll = () => (dispatch) => {
  api.loadCharacters()
  .then(({ characters }) => {
    dispatch({
      type: LOAD_ALL,
      payload: {
        characters
      }
    })
  })
}

export const loadOne = (id) => (dispatch) => {
  api.loadCharacter(id)
  .then(({ character }) => {
    dispatch({
      type: LOAD_ONE,
      payload: { characters: [character] }
    })
  })
}

export const changeCharacter = (id) => (dispatch) => {
  dispatch({
    type: CHANGE_CHARACTER,
    payload: { id }
  })
}

export const createCharacter = () => (dispatch) => {
  api.createCharacter()
  .then(({ character }) => {
    dispatch({
      type: CREATE_CHARACTER,
      payload: {
        character
      }
    })
  })
}

/**
 * HANDLERS
 *
 * Here we define handlers for our actions
 */
const actions = {}

actions[LOAD_ALL] = (state, { payload: { characters } }) =>
  merge({}, state, { characters, loaded: true });

actions[LOAD_ONE] = (state, { payload: { characters } }) =>
  merge({}, state, { characters, character: characters[0] })

actions[CREATE_CHARACTER] = (state, { payload: { character } }) =>
  merge({}, state, { characters: [...state.characters, character]})

actions[SYNC_CHARACTER] = (state, { payload: { character } }) =>
  Object.assign({}, state, { characters: merge(state.characters, [character]), character: character })

// REDUCER

const initialState = {
  characters: [],
  character: false,
  loaded: false
};

export default (state = initialState, action) => {
  const handler = actions[action.type]

  return handler ? handler(state, action) : state;
}