
/**
 * ACTIONS TYPES
 * 
 * These here are our action types defined for later use
 */

export const OPEN_MODAL = 'OPEN_MODAL';
export const  CLOSE_MODAL = 'CLOSE_MODAL';

/**
 * ACTIONS
 * 
 * Here we define our actions
 */

export const openModal = (obj) => (dispatch) => {
  dispatch({
    type: OPEN_MODAL,
    payload: { obj }
  })
}

export const closeModal = (obj) => (dispatch) => {
  dispatch({
    type: CLOSE_MODAL,
    payload: { obj }
  })
}

/**
 * HANDLERS
 * 
 * Here we define handlers for our actions
 */
const actions = {}

actions[OPEN_MODAL] = (state, { payload: { obj } }) => {
  console.log(obj)
  return ({ ...state, modals: state.modals.concat(obj) })
}

actions[CLOSE_MODAL] = (state, { payload: { obj } }) =>
  ({ ...state, modals: state.modals.filter(item => item.id !== obj.id) })

/**
 * Reducer
 */

const initialState = {
  modals: []
};

export default (state = initialState, action) => {
  const handler = actions[action.type]

  return handler ? handler(state, action) : state;
}