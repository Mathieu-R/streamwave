import createStore from 'stockroom';
import storeWorker from 'worker-loader!./store/worker';
import { Provider, connect } from 'unistore/preact';
import devtools from 'unistore/devtools';

const production = process.env.NODE_ENV === 'production';

const store = production ? createStore(new storeWorker()) : devtools(createStore(new storeWorker()));
store.subscribe(console.log);

store.action('toastMessage')(['bloblboblbob', 'blbobbbl'])

import './style/index.scss';
import App from './components/app';

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
