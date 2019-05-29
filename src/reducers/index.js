import { combineReducers } from 'redux';


import characters from './characters';
import update from './update';
import user from './user';
import ui from './ui';

const reducers = combineReducers({
  characters,
  update,
  user,
  ui
})

export default reducers;