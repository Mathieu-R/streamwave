import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = composeEnhancers(
  applyMiddleware(thunk)
);

const initialState = {
  toast: {
    show: false,
    messages: []
  },
  sideNav: {
    show: false
  },
  player: {
    // show fullscreen player
    show: false,
    // current track
    track: null,
    // all the tracks of album or playlist
    // needed to handle next/prev
    // tracks: [],
    // queue (shuffle or not)
    // needed to handle continuous play
    queue: [],
    // current time of the track
    currentTime: null,
    // is the track playing
    playing: false,
    repeat: false,
    shuffle: false,
    chromecasting: false,
    // list of downloads and their percentages
    downloads: {}
  },
  playlists: {},
  settings: {
    fade: 0,
    equalizeVolume: false,
    equalizer: false,
    downloadQuality: 256,
    dataMax: false
  }
};

const store = createStore(
  reducers,
  initialState,
  middlewares
);

export default store;
