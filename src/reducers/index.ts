import { combineReducers } from 'redux';

import characters from './characters';
import user from './user'

const reducers = combineReducers({
  characters,
  user
})

export default reducers;