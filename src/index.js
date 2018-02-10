import createStore from 'stockroom';
import storeWorker from 'workerize-loader!./store/worker';
import { Provider, connect } from 'unistore/preact';
import devtools from 'unistore/devtools';
import mainWorker from 'workerize-loader!./worker';
import { BrowserRouter } from 'react-router-dom';

const production = process.env.NODE_ENV === 'production';
const store = production ? createStore(storeWorker()) : devtools(createStore(storeWorker()));

import './style/index.scss';
import Main from './components/app';

//const propertiesMapping = ['user', 'toast'];
/*const actionsMapping = {
  toasting: 'toasting'
};*/

//const App = connect(propertiesMapping, actionsMapping)(Main);

export const worker = mainWorker();

export default () => (
  <Provider store={store}>
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  </Provider>
);
