import { combineReducers } from 'redux';

import characters from './characters';
import user from './user';
import modals from './modals';
import ui from './ui';

const reducers = combineReducers({
  characters,
  user,
  modals,
  ui
})

export default reducers;