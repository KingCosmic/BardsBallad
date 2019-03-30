
/**
 * ACTIONS TYPES
 * 
 * These here are our action types defined for later use
 */

import { UPDATE_FEAT, UPDATE_CHARACTER, REVERT_CHARACTER } from './characters';
export const EDIT_ITEM = 'EDIT_ITEM';

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


/**
 * HANDLERS
 * 
 * Here we define handlers for our actions
 */
const actions = {}

actions[UPDATE_FEAT] = (state) =>
  Object.assign({}, state, { editing: '' });

actions[UPDATE_CHARACTER] = (state) =>
  Object.assign({}, state, { editing: '' });

actions[REVERT_CHARACTER] = (state) =>
  Object.assign({}, state, { editing: '' });

actions[EDIT_ITEM] = (state, { payload: { id } }) =>
  Object.assign({}, state, { editing: id });

/**
 * Reducer
 */

const initialState = {
  editing: ''
};

export default (state = initialState, action) => {
  const handler = actions[action.type]

  return handler ? handler(state, action) : state;
}