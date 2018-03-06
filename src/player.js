import shaka from 'shaka-player';
import Constants from './constants';

class Player {
  constructor () {
    // audio element
    this.audio = null;
    this.player = null;
    this.init = false;

    this.initShakaPlayer();
    this.initMediaSession();
  }

  initShakaPlayer () {
    // if player has already been init
    if (this.init) {
      return;
    }

    // install shaka player polyfills
    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      console.error('Browser not supported by shaka-player...');
      return;
    }

    this.audio = document.querySelector('audio');
    this.player = new shaka.Player(this.audio);

    // put it in window so it's easy to access
    // even in console.
    window.player = this.player;

    // listen to errors
    this.player.addEventListener('error', err => console.error(err));

    // player is init
    this.init = true

    // listen to remote playback api event
    //this.audio.remote.onconnecting =
    //this.audio.remote.onconnect =
    //this.audio.remote.ondisconnect =
  }

  initMediaSession () {
    if (this.init) {
      return;
    }

    if (!Constants.SUPPORT_MEDIA_SESSION_API) {
      return;
    }

    navigator.mediaSession.setActionHandler('play', this.play);
    navigator.mediaSession.setActionHandler('pause', this.pause);
    navigator.mediaSession.setActionHandler('seekbackward', this.onSeekBackward);
    navigator.mediaSession.setActionHandler('seekforward', this.onSeekForward);
    navigator.mediaSession.setActionHandler('previoustrack', this.onSetPreviousTrack);
    navigator.mediaSession.setActionHandler('nexttrack', this.onSetNextTrack);
  }

  listen (manifest, m3u8playlist, track) {
    // load the player
    return player.load(`${Constants.CDN_URL}/${manifest}`).then(_ => {
      console.log(`[shaka-player] Music loaded: ${manifest}`);
      return this.audio.play();
    })
    .then(_ => this.setMediaNotifications(track))
    .catch(err => {
      console.error(err);
      // if fail, fallback to HLS format (safari mobile)
      player.unload().then(_ => this.fallbackToHLS(m3u8playlist, track))
    });
  }

  fallbackToHLS (m3u8playlist, track) {
    // simply put it in src attribute
    this.audio.src = `${Constants.CDN_URL}/${m3u8playlist}`;
    this.audio.play().then(() => this.setMediaNotifications(track));
  }

  setMediaNotifications ({title, artist, album, coverURL}) {
    if (!Constants.SUPPORT_MEDIA_SESSION_API) {
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      title,
      artist,
      album,
      artwork: [
        {src: `${Constants.CDN_URL}/${coverURL}`, sizes: '256x256', type: 'image/png'},
        {src: `${Constants.CDN_URL}/${coverURL}`, sizes: '512x512', type: 'image/png'}
      ]
    });
  }


  play (evt) {
    this.audio.play();
  }

  pause (evt) {
    this.audio.pause();
  }

  onSeekBackward (evt) {
    console.log(evt);
  }

  onSeekForward (evt) {

  }

  onSetPreviousTrack () {

  }

  onSetNextTrack () {

  }

  watchRemoteAvailability () {
    if (!this.audio) {
      return;
    }

    console.log(this.audio)

    return new Promise(resolve => {
      return this.audio.remote.watchAvailability(available => resolve(available));
    });
  }

  remote () {
    if (!this.audio) {
      return;
    }

    console.log(this.audio);

    return this.audio.remote.prompt()
      .then((evt) => console.log(evt));
  }

  static trackDownload (responses) {
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
        return reader.read().then(onStream);
      }

      const reader = cloned.body.getReader();
      reader.read().then(onStream);
    });
  }
}

export default Player;
