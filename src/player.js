import shaka from 'shaka-player';
import Constants from './constants';

class Player {
  constructor () {
    // audio element
    this.audio = null;
    this.player = null;
    this.init = false;

    this.initShakaPlayer();
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
  }

  listen (manifest, m3u8playlist) {
    // load the player
    player.load(`${Constants.CDN_URL}/${manifest}`).then(_ => {
      console.log(`[shaka-player] Music loaded: ${manifest}`);
    }).catch(err => {
      console.error(err);
      // if fail, fallback to HLS format (safari mobile)
      player.unload().then(_ => this.fallbackToHLS(m3u8playlist))
    });
  }

  fallbackToHLS (m3u8playlist) {
    // simply put it in src attribute
    this.audio.src = `${Constants.CDN_URL}/${m3u8playlist}`;
  }
}

export default Player;
