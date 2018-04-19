import preact, { h, render } from 'preact';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import installServiceWorker from './install-service-worker';
import Constants from './constants';
import store from './store';

if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update');
  whyDidYouUpdate(preact);
}

import {
  setDownloadPercentage,
  removeDownloadPercentage
} from './store/player';

import {
  toasting
} from './store/toast';

import './style/index.scss';
import App from './components/app';

if (process.env.NODE_ENV === 'development') {
  // react devtools
  require('preact/debug');
}

installServiceWorker();

const Main = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

let root = document.body.firstElementChild;
// render a root component in <body>
const rendering = Component => {
  root = render(<Component/>, document.body, root);
};

// preact hmr
if (module.hot) {
  module.hot.accept('./components/app', () => rendering(Main));
}

rendering(Main);
