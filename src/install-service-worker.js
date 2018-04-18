import Constants from './constants';

export default () => {
  if (Constants.PRODUCTION && Constants.SUPPORT_SERVICE_WORKER) {
    navigator.serviceWorker.register('/sw.js', {scope: '/'}).then(registration => {
      // if (!registration.active) {
      //   return;
      // }

      const isReloading = false;
      navigator.serviceWorker.oncontrollerchange = evt => {
        if (isReloading) {
          return;
        }

        // refresh the page
        window.location.reload();
        isReloading = true;
      }

      // if an update is found
      // we should have a service-worker installing
      registration.onupdatefound = event => {
        console.log('A new service worker has been found, installing...');

        registration.installing.onstatechange = event => {
          // first time service-worker installed.
          if (event.target.state === 'activated' && !navigator.serviceWorker.controller) {
            toasting(['Streamwave cached.', 'Ready to work offline.'])
          }

          // new update
          if (event.target.state === 'activated' && navigator.serviceWorker.controller) {
            toasting(['Streamwave updated.', 'Refresh to get the new version.']);
          }

          // service worker updated and installed
          if (event.target.state === 'installed') {
            toasting(['Streamwave updated.']);
          }

          console.log(`Service Worker ${event.target.state}`);
        }
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
}
