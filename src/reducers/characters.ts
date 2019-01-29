import { Actions, Action } from './types';

interface Character {
  name: String
}

interface State {
  characters: Array<Character>
}

/**
 * ACTIONS TYPES
 * 
 * These here are our action types defined for later use
 */

const LOAD_CHARACTERS: string = 'LOAD_CHARACTERS';

/**
 * ACTIONS
 * 
 * Here we define our actions
 */

export const loadCharacters = (characters: Array<Character>) : Action => ({
  type: LOAD_CHARACTERS,
  payload: {
    characters
  }
})

/**
 * HANDLERS
 * 
 * Here we define handlers for our actions
 */
const actions: Actions = {}

actions[LOAD_CHARACTERS] = (state: State, { payload: { characters } }: Action) : State => 
  Object.assign({}, state, { characters });


// REDUCER

const initialState : State = {
  characters: []
};

export default (state: State = initialState, action: Action) : State => {
  const handler = actions[action.type]

  return handler ? handler(state, action) : state;
}