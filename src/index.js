import createStore from 'stockroom';
import storeWorker from 'workerize-loader!./store/worker';
import { Provider, connect } from 'unistore/preact';
import devtools from 'unistore/devtools';

const production = process.env.NODE_ENV === 'production';
const store = production ? createStore(storeWorker()) : devtools(createStore(storeWorker()));

import './style/index.scss';
import Main from './components/app';

//const propertiesMapping = ['user', 'toast'];
/*const actionsMapping = {
  toasting: 'toasting'
};*/

//const App = connect(propertiesMapping, actionsMapping)(Main);

export default () => (
  <Provider store={store}>
    <Main />
  </Provider>
);
