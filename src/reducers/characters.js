import cloneDeep from 'lodash.clonedeep'
import merge from 'lodash.merge';

import api from '../api';

/**
 * ACTIONS TYPES
 * 
 * These here are our action types defined for later use
 */
const LOAD_ALL = 'LOAD_ALL_CHARACTERS'
const LOAD_ONE = 'LOAD_ONE_CHARACTER'
const ADD_FEAT = 'ADD_FEAT'
const UPDATE_FEAT = 'UPDATE_FEAT'
const CHANGE_CHARACTER = 'CHANGE_CHARACTER'
const CREATE_CHARACTER = 'CREATE_CHARACTER'
const UPDATE_CHARACTER = 'UPDATE_CHARACTER'
const REVERT_CHARACTER = 'REVERT_CHARACTER'
const SYNC_CHARACTER = 'SYNC_CHARACTER'

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

export const updateData = (path, data) => (dispatch) => dispatch({
  type: UPDATE_CHARACTER,
  payload: {
    path,
    data
  }
})

export const addFeat = () => (dispatch) => dispatch({
  type: ADD_FEAT,
  payload: {}
})

export const updateFeat = (id, data) => (dispatch) => dispatch({
  type: UPDATE_FEAT,

})

export const revertData = (path) => (dispatch) => dispatch({
  type: REVERT_CHARACTER,
  payload: {
    path,
  }
})

export const syncData = (id, data) => (dispatch) => {
  api.updateCharacter(id, data)
  .then(({ character }) => {
    dispatch({
      type: SYNC_CHARACTER,
      payload: { character }
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
  Object.assign({}, state, { characters, loaded: true });

actions[LOAD_ONE] = (state, { payload: { characters } }) =>
  Object.assign({}, state, { characters, character: characters[0] })

actions[CHANGE_CHARACTER] = (state, { payload: { id } }) => {
  const character = cloneDeep(state.characters.filter(char => char._id === id)[0])

  return Object.assign({}, state, { character })
}

actions[CREATE_CHARACTER] = (state, { payload: { character } }) => 
  Object.assign({}, state, { characters: [...state.characters, character]})


actions[UPDATE_CHARACTER] = (state, { payload: { path, data } }) => {
  let newstate = cloneDeep(state);
  newstate.update.data[path] = data;
  newstate.update.empty = false;

  return Object.assign({}, state, newstate);
}

actions[ADD_FEAT] = (state, { payload: { feat } }) => 
  merge({}, state, { character: { feats: [...state.character.feats, feat ] } })

actions[REVERT_CHARACTER] = (state, { payload: { path } }) => {
  let newstate = cloneDeep(state);
  delete newstate.update.data[path];

  if (Object.keys(newstate.update.data).length === 0) newstate.update.empty = true;

  return Object.assign({}, state, newstate);
}

actions[SYNC_CHARACTER] = (state, { payload: { character } }) =>
  Object.assign({}, state, { character, update: { empty: true, data: {} } })

// REDUCER

const initialState = {
  characters: [],
  character: false,
  loaded: false,
  update: {
    empty: true,
    data: {}
  }
};

export default (state = initialState, action) => {
  const handler = actions[action.type]

  return handler ? handler(state, action) : state;
}