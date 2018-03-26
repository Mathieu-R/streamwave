import idb from './cache';
import store from '../store';
import { flatten } from '../utils';
import Constants from '../constants';

import { setDownloadPercentage, removeDownloadPercentage } from '../store/player';
import { toasting } from '../store/toast';

const MUSIC_CACHE_NAME = 'streamwave-music-cache';

async function getRequestsUrls (tracklist, cover) {
  const qualities = {
    '128': 'audio128URL',
    '192': 'audio192URL',
    '256': 'audio256URL'
  };

  // temp.
  const quality = await idb.get('download-quality') || 256;
  const urls = tracklist.map(track => {
    const audio = track[qualities[quality]];
    const {manifestURL, playlistHLSURL} = track;
    return [audio, manifestURL, playlistHLSURL].map(url => `${Constants.CDN_URL}/${url}`);
  });

  return [...flatten(urls), `${Constants.CDN_URL}/${cover}`];
}

export async function downloadTracklist ({tracklist, cover, id: tracklistId}) {
  // get all requests url
  const requests = await getRequestsUrls(tracklist, cover)

  const files = await requests.map(request => ({request, response: fetch(request)}));
  const responses = await Promise.all(files.map(file => file.response));

  track(responses, tracklistId);
  const cache = await caches.open(MUSIC_CACHE_NAME);
  return files.map(file => file.response.then(response => cache.put(file.request, response)));
}

export async function removeTracklistFromCache (tracklist, id) {
  return;
  const cache = await caches.open(MUSIC_CACHE_NAME);
  await Promise.all(
    tracklist.map(([audio256URL, manifestURL, playlistHLSURL]) => {
      //cache.delete(audio256URL) // regex ?
      cache.delete(manifestURL);
      cache.delete(playlistHLSURL);
  }));

  return idb.delete(id, {downloaded: false});
}

export function track (responses, tracklistId) {
  let totalDownload, downloaded = 0;

  totalDownload = responses.reduce((total, response) => {
    const contentLength = parseInt(response.headers.get('content-length'), 10);
    return total += contentLength;
  }, 0);

  responses.map(response => {
    // response has been consumed
    // by cache api
    const cloned = response.clone();
    const onStream = ({done, value}) => {
      if (done) {
        store.dispatch(removeDownloadPercentage({id: tracklistId}));
        return;
      }

      downloaded += value.length;
      store.dispatch(setDownloadPercentage({id: tracklistId, percentage: (downloaded / totalDownload)}));
      return reader.read().then(onStream);
    }

    const reader = cloned.body.getReader();
    reader.read().then(onStream);
  });
}

// uses background fetch which is for now only available in chrome canary
// https://github.com/WICG/background-fetch
export async function downloadTracklistInBackground ({tracklist, album, cover, id}) {
  // get the active service-worker
  const registration = await navigator.serviceWorker.ready;

  // no active service-worker
  if (!registration.active) {
    return;
  }

  // dispatch toasting so we inform the user in UI
  store.dispatch(toasting(['Your tracklist is gonna download in background.', 'You can close the app if you want to.'], 5000));

  // store the tracklist in idb in case we would lost internet connection
  //await idb.set(`background-fetch-${id}`, tracklist);

  // background fetch options
  const icons = [
    {
      "src": "/assets/icons/android-chrome-192x192.png",
      "type": "image/png",
      "sizes": "192x192"
    },
    {
      "src": "/assets/icons/android-chrome-512x512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]

  const options = {
    // could also put the icon of the app in icons property
    icons,
    title: `Downloading ${album} in background for offline listening.`
  }

  // get requests urls
  const requests = await getRequestsUrls(tracklist, cover);

  // launch a background fetch
  const bgFetch = await registration.backgroundFetch.fetch(id, requests, options);
}
