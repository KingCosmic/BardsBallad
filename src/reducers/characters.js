import React from 'react';
import cloneDeep from 'lodash.clonedeep'
import merge from 'lodash.merge';

import nanoid from 'nanoid/generate';
import lowercased from 'nanoid-dictionary/lowercase';

import api from '../utility/api';

import { openModal, closeModal } from './modals';

import Loading from '../modals/Loading';

/**
 * ACTIONS TYPES
 *
 * These here are our action types defined for later use
 */
export const LOAD_ALL = 'LOAD_ALL_CHARACTERS'
export const LOAD_ONE = 'LOAD_ONE_CHARACTER'
export const ADD_FEAT = 'ADD_FEAT'
export const UPDATE_FEAT = 'UPDATE_FEAT'
export const ADD_SPELL = 'ADD_SPELL'
export const UPDATE_SPELL = 'UPDATE_SPELL'
export const CHANGE_CHARACTER = 'CHANGE_CHARACTER'
export const CREATE_CHARACTER = 'CREATE_CHARACTER'
export const DELETE_CHARACTER = 'DELETE_CHARACTER'
export const UPDATE_CHARACTER = 'UPDATE_CHARACTER'
export const LEVEL_UP = 'LEVEL_UP'
export const REVERT_CHARACTER = 'REVERT_CHARACTER'
export const SYNC_CHARACTER = 'SYNC_CHARACTER'
export const UPDATE_DEATH_SAVES_SUCCESSES = 'UPDATE_DEATH_SAVES_SUCCESSES'
export const UPDATE_DEATH_SAVES_FAILS = 'UPDATE_DEATH_SAVES_FAILS'

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

export const deleteCharacter = () => (dispatch) => {
  api.deleteCharacter()
  .then(id => {
    dispatch({
      type: DELETE_CHARACTER,
      payload: {
        id
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

export const levelUp = () => (dispatch) => dispatch({
  type: LEVEL_UP,
  payload: {}
})

export const addFeat = () => (dispatch) => dispatch({
  type: ADD_FEAT,
  payload: {}
})

export const updateFeat = (id, data) => (dispatch) => dispatch({
  type: UPDATE_FEAT,
  payload: { id, data }
})

export const addSpell = (level) => (dispatch) => dispatch({
  type: ADD_SPELL,
  payload: { level }
})

export const updateSpell = (id, data) => (dispatch) => dispatch({
  type: UPDATE_SPELL,
  payload: { id, data }
})

export const revertData = (path) => (dispatch) => dispatch({
  type: REVERT_CHARACTER,
  payload: {
    path,
  }
})

export const updateDeathSaveSuccesses = (count) => (dispatch) => {
  dispatch({
    type: UPDATE_DEATH_SAVES_SUCCESSES,
    payload: {
      count,
    }
  });
};

export const updateDeathSaveFails = (count) => (dispatch) => dispatch({
  type: UPDATE_DEATH_SAVES_FAILS,
  payload: {
    count,
  }
});

export const syncData = (id, data) => (dispatch) => {

  openModal({
    id: 'loading',
    type: 'custom',
    content: <Loading />
  })(dispatch)

  api.updateCharacter(id, data)
    .then(({ character }) => {
      closeModal({ id: 'loading' })(dispatch)
      dispatch({
        type: SYNC_CHARACTER,
        payload: { character }
      });
    });
};

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

actions[DELETE_CHARACTER] = (state, { payload: { id } }) =>
  cloneDeep(state).characters = state.characters.filter(char => char._id !== id);

actions[UPDATE_CHARACTER] = (state, { payload: { path, data } }) => {
  let newstate = cloneDeep(state);
  newstate.update.data[path] = data;
  newstate.update.empty = false;

  return Object.assign({}, state, newstate);
}

//const regex = /([{](\w+)[}])/g

actions[LEVEL_UP] = (state) => {
  // TODO: get this setup to work right.
}

actions[ADD_FEAT] = (state) =>  {
  let id = nanoid(lowercased, 24)

  return merge({}, state, { update: { empty: false, data: { feats: [...state.update.data.feats || [], { name: 'new feat', uses: 0, description: 'click to edit me', id, new: true } ] } } })
}

actions[UPDATE_FEAT] = (state, { payload: { id, data } }) => {
  let feats = cloneDeep(state.update.data.feats || []);

  let update = { ...data, id }

  let isUpdated = false;

  for (let f = 0; f < feats.length; f++) {
    let feat = feats[f];

    if (feat.id === id) {
      feats[f] = merge(feats[f], update);
      isUpdated = true
    }

  }

  if (!isUpdated) feats.push(update);

  return merge(state, { update: { data: { feats }, empty: false } });
}

actions[ADD_SPELL] = (state, { payload: { level } }) =>  {
  let id = nanoid(lowercased, 24)

  return merge({}, state, { update: { empty: false, data: { spells: [...state.update.data.spells || [],
    {
      id,
      level,
      name: 'New Spell',
      school: 'divination',
      castingTime: '1 action',
      range: '15 feet',
      verbal: false,
      somatic: false,
      material: [],
      concentration: false,
      ritual: false,
      duration: '1 minute',
      description: 'Here\'s your new spell edit it to your hearts content bud.',
      new: true
    }
  ] } } })
}

actions[UPDATE_SPELL] = (state, { payload: { id, data } }) => {
  let spells = cloneDeep(state.update.data.spells || []);

  let update = { ...data, id }

  let isUpdated = false;

  for (let s = 0; s < spells.length; s++) {
    let spell = spells[s];

    if (spell.id === id) {
      spells[s] = merge(spells[s], update);
      isUpdated = true
    }

  }

  if (!isUpdated) spells.push(update);

  return merge(state, { update: { data: { spells }, empty: false } });
}

actions[REVERT_CHARACTER] = (state, { payload: { path } }) => {
  let newstate = cloneDeep(state);
  delete newstate.update.data[path];

  if (Object.keys(newstate.update.data).length === 0) newstate.update.empty = true;

  return Object.assign({}, state, newstate);
}

actions[SYNC_CHARACTER] = (state, { payload: { character } }) =>
  Object.assign({}, state, { character, update: { empty: true, data: {} } })

actions[UPDATE_DEATH_SAVES_SUCCESSES] = (state, { payload: { count } }) => {
  const successesSaves = {
    first: count > 0 ? true : false,
    second: count > 1 ? true : false,
    third: count > 2 ? true : false
  };
  return merge({}, state, { character: { deathsaves: { success: successesSaves } } });
};

actions[UPDATE_DEATH_SAVES_FAILS] = (state, { payload: { count } }) => {
  const deathSaves = {
    first: count > 0 ? true : false,
    second: count > 1 ? true : false,
    third: count > 2 ? true : false
  };
  let newState = Object.assign ({}, state)

  newState.character.deathsaves.fails = deathSaves;

  return merge({}, newState);
};

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