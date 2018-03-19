// audio => <audio /> element
export function watchRemoteAvailability (audio) {
  return new Promise(resolve => {
    return audio.remote.watchAvailability(available => resolve(available));
  });
}

export function remote (audio) {
  return audio.remote.prompt()
    .then((evt) => console.log(evt));
}

export function cast (url) {
  const request = new PresentationRequest([url]);
  navigator.presentation.defaultRequest = request;

  return request.start();
}
