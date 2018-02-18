import { combineReducers } from 'redux';

import toastReducers from './toast';
import userReducers from './user';
import libraryReducers from './library';

export default combineReducers({
  toastReducers,
  userReducers,
  libraryReducers
});
