import { combineReducers } from 'redux';

import toast from './toast';
import user from './user';
import library from './library';
import player from './player';

// the name of reducers here
// define the name of the properties
// in the store
export default combineReducers({
  toast,
  user,
  library,
  player
});
