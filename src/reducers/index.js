import { combineReducers } from 'redux';


import characters from './characters';
import user from './user';
import ui from './ui';

const reducers = combineReducers({
  characters,
  user,
  ui
})

export default reducers;