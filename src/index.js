import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import './style/index.scss';
import App from './components/app';

export default () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
