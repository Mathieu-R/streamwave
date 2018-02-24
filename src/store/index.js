import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const middlewares = compose(
  applyMiddleware(thunk),
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

const initialState = {
  toast: {
    show: false,
    messages: []
  },
  player: {
    track: null,
    playing: false,
    chromecasting: false
  }
};

const store = createStore(
  reducers,
  initialState,
  middlewares
);

export default store;
