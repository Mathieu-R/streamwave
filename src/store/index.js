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
  player: {
    track: null,
    queue: [],
    currentTime: null,
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
