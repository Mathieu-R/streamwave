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

if (Constants.PRODUCTION && Constants.SUPPORT_SERVICE_WORKER) {
  navigator.serviceWorker.ready.then(registration => {
    if (!registration.active) {
      return;
    }

    registration.onupdatefound = event => {
      console.log('A new service worker has been found, installing...');

      registration.installing.onstatechange = event => {
        // as the service worker is installed, we can push the message
        if (event.target.state === 'activated') {
          toasting(['Streamwave updated. Refresh to get the new version.']);
        }
        console.log(`Service Worker ${event.target.state}`)
      }
    }
  }).catch(err => console.error(err));

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
}

const Main = () => (
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);

export default Main;
