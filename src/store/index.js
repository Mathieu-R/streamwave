import { createStore, applyMiddleware, compose } from 'redux';
import getPersistMiddleware from 'redux-persist-middleware';
import thunk from 'redux-thunk';
import { getConfiguredCache } from 'money-clip';
import reducers from './reducers';
import { VERSION } from '../constants';

const cache = getConfiguredCache({
  version: VERSION,
  maxAge: 365 * 24 * 60 * 60 * 1000
});

const persist = getPersistMiddleware({
  // function to call to persist store
  cacheFunction: cache.set,
  logger: console.info,

})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = composeEnhancers(
  applyMiddleware(thunk)
);

const initialState = {
  toast: {
    show: false,
    messages: []
  },
  player: {
    // current track
    track: null,
    // all the tracks of album or playlist
    // needed to handle next/prev
    tracks: [],
    // queue (shuffle or not)
    // needed to handle continuous play
    queue: [],
    // current time of the track
    currentTime: null,
    // is the track playing
    playing: false,
    repeat: false,
    shuffle: false,
    chromecasting: false
  }
};

const store = createStore(
  reducers,
  initialState,
  middlewares
);

export default store;
