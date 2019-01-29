import { Actions, Action } from './types';

interface State {
  loggedIn: boolean
}

/**
 * ACTIONS TYPES
 * 
 * These here are our action types defined for later use
 */

const LOG_IN: string = 'LOG_IN';

/**
 * ACTIONS
 * 
 * Here we define our actions
 */

export const loggedIn = (): Action => ({
  type: LOG_IN,
  payload: {}
})


/**
 * HANDLERS
 * 
 * Here we define handlers for our actions
 */
const actions: Actions = {}

actions[LOG_IN] = (state: State): State =>
  Object.assign({}, state, { loggedIn: true });

/**
 * Reducer
 */

const initialState: State = {
  loggedIn: false
};

export default (state: State = initialState, action: Action): State => {
  const handler = actions[action.type]

  return handler ? handler(state, action) : state;
}