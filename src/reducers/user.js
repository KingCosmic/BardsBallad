import api from '../utility/api';

/**
 * ACTIONS TYPES
 * 
 * These here are our action types defined for later use
 */

export const LOG_IN = 'LOG_IN';
export const LOG_OUT = 'LOG_OUT';

/**
 * ACTIONS
 * 
 * Here we define our actions
 */

export const logIn = (jwt) => (dispatch) => {
  dispatch({
    type: LOG_IN,
    payload: {
      user: api.getProfile(),
      jwt,
    }
  })
}


/**
 * HANDLERS
 * 
 * Here we define handlers for our actions
 */
const actions = {}

actions[LOG_IN] = (state, { payload: { user, jwt } }) =>
  Object.assign({}, state, { loggedIn: true, user, jwt });

actions[LOG_OUT] = (state) =>
  Object.assign({}, state, { loggedIn: false, user: {} });

/**
 * Reducer
 */

const initialState = {
  loggedIn: false,
  token: api.getToken() || '',
  user: {}
};

export default (state = initialState, action) => {
  const handler = actions[action.type]

  return handler ? handler(state, action) : state;
}