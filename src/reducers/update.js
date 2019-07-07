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
export const REMOVE_FEAT = 'REMOVE_FEAT'
export const ADD_SPELL = 'ADD_SPELL'
export const UPDATE_SPELL = 'UPDATE_SPELL'
export const REMOVE_SPELL = 'REMOVE_SPELL'
export const REVERT_CHARACTER = 'REVERT_CHARACTER'
export const SYNC_CHARACTER = 'SYNC_CHARACTER'
export const UPDATE_CHARACTER = 'UPDATE_CHARACTER'
export const UPDATE_SPELL_SLOTS = 'UPDATE_SPELLSLOTS'
export const RESTORE_ALL_SPELL_SLOTS = 'RESTORE_ALL_SPELL_SLOTS'

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

export const addSpell = (spell) => (dispatch) => dispatch({
  type: ADD_SPELL,
  payload: { spell }
})

export const updateSpell = (id, data) => (dispatch) => dispatch({
  type: UPDATE_SPELL,
  payload: { id, data }
})

export const removeSpell = (id) => (dispatch) => dispatch({
  type: REMOVE_SPELL,
  payload: { id }
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

export const addFeat = (feat) => (dispatch) => dispatch({
  type: ADD_FEAT,
  payload: { feat }
})

export const updateFeat = (id, data) => (dispatch) => dispatch({
  type: UPDATE_FEAT,
  payload: { id, data }
})

export const removeFeat = (id) => (dispatch) => dispatch({
  type: REMOVE_FEAT,
  payload: { id }
})

export const updateSpellslots = (level, slots) => (dispatch) => dispatch({
  type: UPDATE_SPELL_SLOTS,
  payload: { level, slots }
})

export const restoreAllSpellSlots = (slots) => (dispatch) => dispatch({
  type: RESTORE_ALL_SPELL_SLOTS,
  payload: { slots }
})

export const revertData = (path) => (dispatch) => dispatch({
  type: REVERT_CHARACTER,
  payload: { path }
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

actions[ADD_FEAT] = (state, { payload: { feat } }) => {
  let id = nanoid(lowercased, 24)

  let newChanges = state.changes.includes('feats') ? state.changes : [...state.changes, 'feats']

  return merge({}, state, { changes: newChanges, feats: [...state.feats || [], { ...feat, id, new: true }] })
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

actions[REMOVE_FEAT] = (state, { payload: { id } }) => {
  let feats = cloneDeep(state.feats || []);

  let update = { remove: true, id }

  let isRemoved = false;

  for (let i = 0; i < feats.length; i++) {
    let feat = feats[i]

    if (feat.id === id) {
      feats[i] = merge(feats[i], update);
      isRemoved = true
    }
  }

  if (!isRemoved) feats.push(update);

  let newChanges = state.changes.includes('feats') ? state.changes : [...state.changes, 'feats']

  return merge({}, state, { changes: newChanges, feats })
}

actions[ADD_SPELL] = (state, { payload: { spell } }) => {
  let id = nanoid(lowercased, 24)

  let newChanges = state.changes.includes('spells') ? state.changes : [...state.changes, 'spells']

  return merge({}, state, { changes: newChanges, spells: [...state.spells || [], { ...spell, id, new: true }] })
}

actions[UPDATE_SPELL] = (state, { payload: { id, data } }) => {
  let spells = cloneDeep(state.spells || []);

  let update = { ...data, id }

  let isUpdated = false;

  for (let i = 0; i < spells.length; i++) {
    let spell = spells[i];

    if (spell.id === id) {
      spells[i] = merge({}, spells[i], update);
      isUpdated = true
    }

  }

  if (!isUpdated) spells.push(update);

  let newChanges = state.changes.includes('spells') ? state.changes : [...state.changes, 'spells']

  return merge({}, state, { changes: newChanges, spells });
}

actions[REMOVE_SPELL] = (state, { payload: { id } }) => {
  let spells = cloneDeep(state.spells || []);

  let update = { remove: true, id }

  let isRemoved = false;

  for (let i = 0; i < spells.length; i++) {
    let spell = spells[i]

    if (spell.id === id) {
      spells[i] = merge(spells[i], update);
      isRemoved = true
    }
  }

  if (!isRemoved) spells.push(update);

  let newChanges = state.changes.includes('spells') ? state.changes : [...state.changes, 'spells']

  return merge({}, state, { changes: newChanges, spells })
}

actions[UPDATE_SPELL_SLOTS] = (state, { payload: { level, slots } }) =>
  merge({}, state, { spellSlots: { [level]: slots }, changes: state.changes.includes('spellSlots') ? state.changes : [...state.changes, 'spellslots'] })

const levelMap = { 1: 'one', 2: 'two', 3: 'three', 4: 'four', 5: 'five', 6: 'six', 7: 'seven', 8: 'eight', 9: 'nine' }
actions[RESTORE_ALL_SPELL_SLOTS] = (state, { payload: { slots } }) => {
  const updatedSlots = cloneDeep(slots);

  for (let i = 1; i < 10; i++) {
    updatedSlots[levelMap[i]].current = updatedSlots[levelMap[i]].max
  }

  let newChanges = state.changes.includes('spellSlots') ? state.changes : [...state.changes, 'spellslots']

  return merge({}, state, { spellSlots: updatedSlots, changes: newChanges })
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