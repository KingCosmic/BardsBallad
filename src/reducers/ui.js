
/**
 * ACTIONS TYPES
 * 
 * These here are our action types defined for later use
 */

import { UPDATE_FEAT, UPDATE_CHARACTER, REVERT_CHARACTER } from './characters';
export const EDIT_ITEM = 'EDIT_ITEM';
export const START_CHARACTER_CREATION = 'START_CHARACTER_CREATION';
export const CHANGE_CHARACTER_CREATION_STAGE = 'CHANGE_CHARACTER_CREATION_STAGE';

/**
 * ACTIONS
 * 
 * Here we define our actions
 */

export const editItem = (id) => (dispatch) => {
  dispatch({
    type: EDIT_ITEM,
    payload: { id }
  })
}

export const startCharacterCreation = () => (dispatch) => {
  dispatch({
    type: START_CHARACTER_CREATION,
    payload: {}
  })
}

export const changeCharacterCreationStage = (stage) => (dispatch) => {
  dispatch({
    type: CHANGE_CHARACTER_CREATION_STAGE,
    payload: {
      stage
    }
  })
}

/**
 * HANDLERS
 * 
 * Here we define handlers for our actions
 */
const actions = {}

actions[EDIT_ITEM] = (state, { payload: { id } }) =>
  Object.assign({}, state, { editing: id });

actions[START_CHARACTER_CREATION] = (state, { payload }) =>
  Object.assign({}, state, { creatingCharacter: true, creationStage: 1 })

actions[CHANGE_CHARACTER_CREATION_STAGE] = (state, { payload: { stage } }) =>
  Object.assign({}, state, { creationStage: stage })

actions[UPDATE_FEAT] = (state) =>
  Object.assign({}, state, { editing: '' });

actions[UPDATE_CHARACTER] = (state) =>
  Object.assign({}, state, { editing: '' });

actions[REVERT_CHARACTER] = (state) =>
  Object.assign({}, state, { editing: '' });

/**
 * Reducer
 */

const initialState = {
  editing: '',
  creatingCharacter: false,
  creationStage: 1
};

export default (state = initialState, action) => {
  const handler = actions[action.type]

  return handler ? handler(state, action) : state;
}