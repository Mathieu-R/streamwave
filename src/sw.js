importScripts("/third_party/idb-keyval.min.js");

const MUSIC_CACHE_NAME = 'streamwave-music-cache';

// workbox library will be injected by webpack plugin
workbox.precaching.precache(self.__precacheManifest);
workbox.routing.registerRoute('/', workbox.strategies.staleWhileRevalidate());
workbox.routing.registerRoute(new RegExp('/auth/'), workbox.strategies.staleWhileRevalidate());
workbox.routing.registerRoute(new RegExp('/album/'), workbox.strategies.staleWhileRevalidate());
workbox.routing.registerRoute('/settings', workbox.strategies.staleWhileRevalidate());

// skipping default sw lifecycle
// update page as soon as possible
workbox.skipWaiting();
workbox.clientsClaim();

self.onfetch = event => {
  event.respondWith(async function () {
    // cached stuff (e.g. static files - cache-manifest / routes)
    const response = await caches.match(event.request);

    // https://github.com/paulirish/caltrainschedule.io/pull/51
    // seems kind of a bug with chrome devtools open
    if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') {
      return;
    }

    // api call
    if (!response) {
      return fetch(event.request);
    }

    // range-request (music)
    const rangeHeader = event.request.headers.get('Range');

    if (rangeHeader) {
      return createRangedResponse(event.request, response, rangeHeader);
    }

    return response;
  }());
}

self.onbackgroundfetched = event => {
  console.log(event);
  event.waitUntil(async function () {
    // open the cache
    const cache = await caches.open(MUSIC_CACHE_NAME);
    // put the downloaded stuff in the cache
    await Promise.all(event.fetches.map(({request, response}) => cache.put(request, response)));
    // update UI. Yeah, there's an event for that !
    event.updateUI('Tracklist downloaded');
  }());
}

self.onbackgroundfetchfail = event => {
  console.log(event);
  event.waitUntil(async function () {
    event.updateUI('Tracklist download failed.');
  }());
}

self.onsync = event => {
  if (event.tag === 'foreground-download') {
    event.waitUntil(downloadInForeground())
  }
}

self.onnotificationclick = event => {
  // close notification
  event.notification.close();
  // redirect user to album
  clients.openWindow(`${location.origin}/${event.notification.data.type}/${event.notification.data.id}`);
}

const downloadInForeground = async () => {
  try {
    const toCache = await idbKeyval.get('bg-sync-queue');

    // download each tracklist
    // feedback in ui
    await Promise.all(toCache.map(async ({requests, tracklistId}) => {
      const files = await requests.map(request => ({request, response: fetch(request)}));
      const responses = await Promise.all(files.map(file => file.response));


      trackDownload(responses, tracklistId);
      const cache = await caches.open(MUSIC_CACHE_NAME);
      await Promise.all(files.map(file => file.response.then(response => cache.put(file.request, response))));
      self.registration.showNotification('Tracklist downloaded.', {
        // could show more infos.
        body: 'access the tracklist.',
        // usefull to redirect user when
        // he clicks on the notification
        data: {type: 'album', id: tracklistId}
      });
    }));

    // clean bg-sync-queue
    await idbKeyval.set('bg-sync-queue', []);
  } catch (err) {
    console.error(err);
  }
}

const createRangedResponse = (request, response, rangeHeader) => {
  return response.arrayBuffer().then(buffer => {
    // aaa-bbb, aaa, bbb
    let [full, start, end] = /(\d*)-(\d*)/.exec(rangeHeader);

    if (start === '') {
      start = buffer.byteLength - Number(end);
      end = buffer.byteLength;
    } else if (end === '') {
      start = Number(start);
      end = buffer.byteLength;
    } else {
      start = Number(start);
      end = Number(end) + 1;
    }

    if (start < 0 || end > buffer.byteLength) {
      return new Response('Range not satisfiable', {status: 416});
    }

    const slicedBuffer = buffer.slice(start, end);
    const slicedResponse = new Response(slicedBuffer, {
      status: 206,
      headers: response.headers
    });

    console.log(`ranged response from service-worker from ${start} to ${end}`);

    slicedResponse.headers.set('Content-Length', slicedBuffer.byteLength);
    slicedResponse.headers.set('Content-Range', `bytes ${start}-${end - 1}/${buffer.byteLength}`);
    return slicedResponse;
  });
}


const trackDownload = (responses, tracklistId) => {
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
        // get all clients (window)
        // and show a ui feedback
        clients.matchAll({type: 'window'}).then(clients => {
          clients.forEach(client => client.postMessage({type: 'downloaded', tracklistId}));
        });
        return;
      }

      downloaded += value.length;
      clients.matchAll({type: 'window'}).then(clients => {
        clients.forEach(client => client.postMessage({type: 'downloading', tracklistId, downloaded, totalDownload, value: value.length}));
      });
      return reader.read().then(onStream);
    }

    const reader = cloned.body.getReader();
    reader.read().then(onStream);
  });
}
