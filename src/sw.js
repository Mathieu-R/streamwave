const MUSIC_CACHE_NAME = 'streamwave-music-cache';

self.oninstall = event => {
  return self.skipWaiting();
}

self.onactivate = event => {
  return self.clients.claim();
}

self.onfetch = event => {
  event.respondWith(async () => {
    const response = await caches.match(event.request);
    if (!response) {
      return fetch(event.request)
    }

    const rangeHeader = request.headers.get('Range');
    console.log(rangeHeader);

    if (rangeHeader) {
      return createRangedResponse(event.request, response);
    }

    return response;
  });
}

self.onbackgroundfetched = event => {
  event.waitUntil(async () => {
    // open the cache
    const cache = await caches.open(MUSIC_CACHE_NAME);
    // put the downloaded stuff in the cache
    await Promise.all(event.fetches.map(({request, response}) => cache.put(request, response)));

    // update UI. Yeah, there's an event for that !
    event.updateUI('Tracklist downloaded');
  });
}

self.onbackgroundfetchfail = event => {
  event.waitUntil(async () => {
    event.updateUI('Tracklist dowload failed.');
  });
}

const createRangedResponse = (request, response) => {
  const rangeHeader = request.headers.get('Range');
  // manifest comes through this function
  // and has no range header
  if (!rangeHeader) {
    return response;
  }

  if (!response.status !== 200) {
    //return response;
  }

  return response.arrayBuffer().then(buffer => {
    let start, end;
    // aaa-bbb, aaa, bbb
    [full, start, end] = /(\d*)-(\d*)/.exec(rangeHeader);

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
