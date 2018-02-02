import createStore from 'stockroom';
import storeWorker from 'worker-loader!./store/worker';
import { Provider, connect } from 'unistore/preact';
import devtools from 'unistore/devtools';

const production = process.env.NODE_ENV === 'production';

const store = production ? createStore(new storeWorker()) : devtools(createStore(new storeWorker()));
store.subscribe(console.log);

import './style/index.scss';
import Main from './components/app';

const App = connect('user, toast', {
  toasting: 'toast',
  register: 'register',
  login: 'login',
  getResetToken: 'getResetToken',
  changePassword: 'changePassword'
})(
  ({
    user,
    toast,
    toasting,
    register,
    login,
    getResetToken,
    changePassword
  }) => <Main />
);

export default () => (
  <Provider store={store}>
    <App />
  </Provider>
);
