// @flow

import cloneDeep from 'lodash.clonedeep'
import merge from 'lodash.merge';

import nanoid from 'nanoid/generate';
import lowercased from 'nanoid-dictionary/lowercase';

import api from '../api';

/**
 * ACTIONS TYPES
 * 
 * These here are our action types defined for later use
 */

export const ADD_ITEM = 'ADD_ITEM'
export const UPDATE_ITEM = 'UPDATE_ITEM'
export const REMOVE_ITEM = 'REMOVE_ITEM'
export const ADD_FEAT = 'ADD_FEAT'
export const UPDATE_FEAT = 'UPDATE_FEAT'
export const ADD_SPELL = 'ADD_SPELL'
export const UPDATE_SPELL = 'UPDATE_SPELL'
export const REVERT_CHARACTER = 'REVERT_CHARACTER'
export const SYNC_CHARACTER = 'SYNC_CHARACTER'
export const UPDATE_CHARACTER = 'UPDATE_CHARACTER'

/**
 * ACTIONS
 * 
 * Here we define our actions
 */

export const updateData = (path, data) => (dispatch) => dispatch({
  type: UPDATE_CHARACTER,
  payload: {
    path,
    data
  }
})

export const addItem = (item) => (dispatch) => dispatch({
  type: ADD_ITEM,
  payload: { item }
})

export const updateItem = (id, data) => (dispatch) => dispatch({
  type: UPDATE_ITEM,
  payload: { id, data }
})

export const removeItem = (id) => (dispatch) => dispatch({
  type: REMOVE_ITEM,
  payload: { id }
})

export const addFeat = () => (dispatch) => dispatch({
  type: ADD_FEAT,
  payload: {}
})

export const updateFeat = (id, data) => (dispatch) => dispatch({
  type: UPDATE_FEAT,
  payload: { id, data }
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
      });
    });
};

/**
 * HANDLERS
 * 
 * Here we define handlers for our actions
 */
const actions = {}

actions[UPDATE_CHARACTER] = (state, { payload: { path, data } }) => {

  let newChanges = state.changes.includes(path) ? state.changes : [...state.changes, path]

  return merge({}, state, { changes: newChanges, [path]: data });
}

actions[ADD_ITEM] = (state, { payload: { item } }) => {
  let id = nanoid(lowercased, 24)

  let newChanges = state.changes.includes('items') ? state.changes : [...state.changes, 'items']

  return merge({}, state, { changes: newChanges, items: [...state.items || [], { ...item, id, new: true }] })
}

actions[UPDATE_ITEM] = (state, { payload: { id, data } }) => {
  let items = cloneDeep(state.items || []);

  let update = { ...data, id }

  let isUpdated = false;

  for (let i = 0; i < items.length; i++) {
    let item = items[i];

    if (item.id === id) {
      items[i] = merge({}, items[i], update);
      isUpdated = true
    }

  }

  if (!isUpdated) items.push(update);

  let newChanges = state.changes.includes('items') ? state.changes : [...state.changes, 'items']

  return merge({}, state, { changes: newChanges, items });
}

actions[REMOVE_ITEM] = (state, { payload: { id } }) => {
  let items = cloneDeep(state.items || []);

  let update = { remove: true, id }

  let isRemoved = false;

  for (let i = 0; i < items.length; i++) {
    let item = items[i]

    if (item.id === id) {
      items[i] = merge(items[i], update);
      isRemoved = true
    }
  }

  if (!isRemoved) items.push(update);

  let newChanges = state.changes.includes('items') ? state.changes : [...state.changes, 'items']

  return merge({}, state, { changes: newChanges, items })
}

actions[ADD_FEAT] = (state) => {
  let id = nanoid(lowercased, 24)

  let newChanges = state.changes.includes('feats') ? state.changes : [ ...state.changes, 'feats' ]

  return merge({}, state, { changes: newChanges, feats: [...state.feats || [], { name: 'new feat', uses: 0, description: 'click to edit me', id, new: true }] })
}

actions[UPDATE_FEAT] = (state, { payload: { id, data } }) => {
  let feats = cloneDeep(state.feats || []);

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

  let newChanges = state.changes.includes('feats') ? state.changes : [...state.changes, 'feats']

  return merge({}, state, { changes: newChanges, feats });
}

actions[ADD_SPELL] = (state, { payload: { level } }) => {
  let id = nanoid(lowercased, 24)

  let newChanges = state.changes.includes('spells') ? state.changes : [...state.changes, 'spells']

  return merge({}, state, {
    changes: newChanges,
    spells: [...state.update.data.spells || [],
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
    ]
  })
}

actions[UPDATE_SPELL] = (state, { payload: { id, data } }) => {
  let spells = cloneDeep(state.spells || []);

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

  let newChanges = state.changes.includes('spells') ? state.changes : [...state.changes, 'spells']

  return merge(state, { changes: newChanges, spells });
}

actions[REVERT_CHARACTER] = (state, { payload: { path } }) => {
  let newstate = cloneDeep(state);

  delete newstate[path];

  if (state.changes.includes(path)) newstate.changes.splice(newstate.changes.indexOf(path), 1)

  return newstate;
}

actions[SYNC_CHARACTER] = (state) => ({ changes: [] })

/**
 * Reducer
 */

const initialState = {
  changes: []
}

export default (state = initialState, action) => {
  const handler = actions[action.type]

  return handler ? handler(state, action) : state;
}