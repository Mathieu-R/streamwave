import { get, set, del } from 'idb-keyval';
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

  const quality = store.getState().settings.downloadQuality;
  const urls = tracklist.map(track => {
    const audio = track[qualities[quality]];
    const {manifestURL, playlistHLSURL} = track;
    return [audio, manifestURL, playlistHLSURL].map(url => `${Constants.CDN_URL}/${url}`);
  });

  return [...flatten(urls), `${Constants.CDN_URL}/${cover}`];
}

export async function downloadTracklist ({tracklist, cover, id: tracklistId}) {
  const registration = await navigator.serviceWorker.ready;

  if (!registration.active) {
    return;
  }

  // ask user permission to show notification
  await Notification.requestPermission();

  // get all requests url
  const requests = await getRequestsUrls(tracklist, cover);
  // stuff to cache
  const toCache = {requests, tracklistId};

  // retrieve bg-sync queue if any (in case of multiple tracklist download)
  const bgSyncQueue = await get('bg-sync-queue') || [];

  // add stuff to queue, avoid double
  set('bg-sync-queue', Array.from(new Set([...bgSyncQueue, toCache])));

  await registration.sync.register('foreground-download');
}

export async function removeTracklistFromCache (tracklist, id) {
  const cache = await caches.open(MUSIC_CACHE_NAME);
  const keys = await cache.keys();
  await Promise.all(
    tracklist.map(([audio256URL, manifestURL, playlistHLSURL]) => {
      // remove "-quality.mp4"
      const normalizedAudioURL = audio256URL.replace(/-[^-]*$/, '');
      // find request for that url
      const request = await keys.find(request => request.url.startsWith(`${Constants.CDN_URL}/${normalizedAudioURL}`));
      cache.delete(request);
      cache.delete(manifestURL);
      cache.delete(playlistHLSURL);
  }));

  return del(id, {downloaded: false});
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
  store.dispatch(toasting(['Votre tracklist va se être téléchargée en arrière-plan.', 'Vous pouvez fermer l\'application si vous le désirez.'], 5000));

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
    title: `Téléchargement de "${album}" en arrière-plan pour la lecture hors-ligne.`
  }

  // get requests urls
  const requests = await getRequestsUrls(tracklist, cover);

  // launch a background fetch
  const bgFetch = await registration.backgroundFetch.fetch(id, requests, options);
}

export function updateDataVolume ({userId, value}) {
  if (!userId) return;

  return get(`data-volume_${userId}`).then(volume => {
    let newDataVolume;

    // if volume has never been set
    if (volume === undefined) {
      newDataVolume = value;
    } else {
      newDataVolume = volume + value;
    }

    return set(`data-volume_${userId}`, newDataVolume);
  }).catch(err => console.error(err));
}

export function getDataVolumeDownloaded ({userId, dataMax}) {
  return get(`data-volume_${userId}`).then(volume => {
    console.log('UTILS - VOLUME', volume);
    // user hasn't chosen to limit data
    if (!volume) return;
    // volume in bytes
    // 1 byte = 8bits
    const volumeInMo = volume / (1000 * 1024);
    const percentage = volumeInMo / dataMax;
    console.log('UTILS - VOLUME IN MO', volumeInMo);
    console.log('UTILS - PERCENTAGE', percentage);
    return {
      volume: parseFloat(volumeInMo.toFixed(2)),
      percentage
    }
  }).catch(err => console.error(err));
}
