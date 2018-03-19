import idb from './cache';
import store from '../store';
import { flatten } from '../utils';
import Constants from '../constants';

import { setDownloadPercentage } from '../store/player';

const MUSIC_CACHE_NAME = 'streamwave-music-cache';

export async function downloadTracklist (tracklist, tracklistId) {
  const qualities = {
    '128': 'audio128URL',
    '192': 'audio192URL',
    '256': 'audio256URL'
  };

  // temp.
  const quality = await idb.get('quality') || 256;
  const urls = tracklist.map(track => {
    const audio = track[qualities[quality]];
    const {manifestURL, playlistHLSURL} = track;
    return [audio, manifestURL, playlistHLSURL].map(url => `${Constants.CDN_URL}/${url}`);
  });

  const files = flatten(await urls.map(url => url.map(request => ({request, response: fetch(request)}))));
  const responses = await Promise.all(files.map(file => file.response));

  track(responses, tracklistId);
  const cache = await caches.open(MUSIC_CACHE_NAME);
  files.map(file => file.response.then(response => cache.put(file.request, response)));
}

export async function removeTracklistFromCache (tracklist) {
  const cache = await caches.open(MUSIC_CACHE_NAME);
  tracklist.map(([audio256URL, manifestURL, playlistHLSURL]) => {
    //cache.delete(audio256URL) // regex ?
    cache.delete(manifestURL);
    cache.delete(playlistHLSURL);
  })
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
      if (done) return;

      downloaded += value.length;
      store.dispatch(setDownloadPercentage({id: tracklistId, percentage: Math.round((downloaded / totalDownload) * 100)}));
      return reader.read().then(onStream);
    }

    const reader = cloned.body.getReader();
    reader.read().then(onStream);
  });
}
