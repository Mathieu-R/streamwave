import { h, render } from 'preact';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import Constants from './constants';
import store from './store';

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

if (Constants.PRODUCTION && Constants.SUPPORT_SERVICE_WORKER) {
  navigator.serviceWorker.register('/sw.js', {scope: '/'}).then(registration => {
    if (!registration.active) {
      return;
    }

    const isReloading = false;
    navigator.serviceWorker.oncontrollerchange = evt => {
      if (isReloading) {
        return;
      }

      // refresh the page
      window.location.reload();
      isReloading = true;
    }

    registration.onupdatefound = event => {
      console.log('A new service worker has been found, installing...');
    }

    registration.installing.onstatechange = event => {
      // first time service-worker installed.
      if (event.target.state === 'activated' && !navigator.serviceWorker.controller) {
        toasting(['Streamwave cached.', 'Ready to work offline.'])
        return;
      }

      // as the service worker is installed, we can push the message
      if (event.target.state === 'activated') {
        toasting(['Streamwave updated.', 'Refresh to get the new version.']);
      }

      console.log(`Service Worker ${event.target.state}`);
    }

    navigator.serviceWorker.onmessage = event => {
      if (event.data.type === 'downloading') {
        const {tracklistId, downloaded, totalDownload} = event.data;
        store.dispatch(setDownloadPercentage({id: tracklistId, percentage: (downloaded / totalDownload)}));
        return;
      }

      if (event.data.type === 'downloaded') {
        const {tracklistId} = event.data;
        store.dispatch(removeDownloadPercentage({id: tracklistId}));
      }
    }
  }).catch(err => console.error(err));
}

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
