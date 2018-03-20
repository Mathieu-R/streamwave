import { Component } from 'preact';
import { Route, Switch } from 'react-router-dom';
import shaka from 'shaka-player';
import { cast } from '../utils/chromecast';
import Constants from '../constants';

import MiniPlayer from '../components/mini-player';
import Player from '../components/player';
import NavBar from '../components/navbar';
import Audio from '../components/audio';

import Library from './library';
import Album from './album';
import Settings from './settings';

class Home extends Component {
  constructor () {
    super();

    this.audio = null;
    this.player = null;
    this.skipTime = 15;

    this.listen = this.listen.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.seekBackward = this.seekBackward.bind(this);
    this.seekForward = this.seekForward.bind(this);
    this.setPrevTrack = this.setPrevTrack.bind(this);
    this.setNextTrack = this.setNextTrack.bind(this);
    this.chromecast = this.chromecast.bind(this);
  }

  componentDidMount () {
    this.initShakaPlayer();
    this.initMediaSession();
  }

  initShakaPlayer () {
    // install shaka player polyfills
    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      console.error('Browser not supported by shaka-player...');
      return;
    }

    this.player = new shaka.Player(this.audio.base);

    // put it in window so it's easy to access
    // even in console.
    window.player = this.player;

    // listen to errors
    this.player.addEventListener('error', err => console.error(err));

    // listen to remote playback api event
    //this.audio.remote.onconnecting =
    //this.audio.remote.onconnect =
    //this.audio.remote.ondisconnect =
  }

  initMediaSession () {
    if (!Constants.SUPPORT_MEDIA_SESSION_API) {
      return;
    }

    navigator.mediaSession.setActionHandler('play', evt => {
      this.props.setPlayingStatus({playing: true});
      this.play();
    });
    navigator.mediaSession.setActionHandler('pause', evt => {
      this.props.setPlayingStatus({playing: false});
      this.pause();
    });
    navigator.mediaSession.setActionHandler('seekbackward', this.seekBackward);
    navigator.mediaSession.setActionHandler('seekforward', this.seekForward);
    navigator.mediaSession.setActionHandler('previoustrack', this.setPrevTrack);
    navigator.mediaSession.setActionHandler('nexttrack', evt => this.setNextTrack({continuous: false}));
  }

  /**
   * Stream an audio with DASH (thanks to shaka-player) or HLS (if dash not supported)
   * @param {String} manifest manifest url
   * @param {String} m3u8playlist  hls playlist url
   * @param {Object} trackInfos {artist, album, title, coverURL}
   */
  listen (manifest, m3u8playlist, trackInfos) {
    // 1. Load the player
    return this.player.load(`${Constants.CDN_URL}/${manifest}`).then(_ => {
      console.log(`[shaka-player] Music loaded: ${manifest}`);
      return this.play();
    })
    // 2. Set media notification (Media Session API)
    .then(_ => this.setMediaNotifications(trackInfos))
    .catch(err => {
      // 3. If fails, fallback to HLS format (safari mobile)
      this.player.unload().then(_ => this.fallbackToHLS(m3u8playlist, trackInfos));
      console.error(err);
    });
  }

  fallbackToHLS (m3u8playlist, trackInfos) {
    // Simply put it in src attribute
    // TODO: does not seem to work :(
    // maybe problem with <audio> element.
    this.audio.base.src = `${Constants.CDN_URL}/${m3u8playlist}`;
    this.play().then(_ => this.setMediaNotifications(trackInfos));
  }

  setMediaNotifications ({artist, album, title, coverURL}) {
    if (!Constants.SUPPORT_MEDIA_SESSION_API) {
      return;
    }

    navigator.mediaSession.metadata = new MediaMetadata({
      artist,
      album,
      title,
      artwork: [
        {src: `${Constants.CDN_URL}/${coverURL}`, sizes: '256x256', type: 'image/png'},
        {src: `${Constants.CDN_URL}/${coverURL}`, sizes: '512x512', type: 'image/png'}
      ]
    });
  }

  play () {
    this.audio.base.play();
  }

  pause () {
    this.audio.base.pause();
  }

  seekBackward () {
    this.audio.base.currentTime = Math.max(0, this.audio.base.currentTime - this.skipTime);
  }

  seekForward () {
    this.audio.base.currentTime = Math.min(this.audio.base.duration, this.audio.base.currentTime + this.skipTime);
  }

  setPrevTrack () {
    // update redux state, get new current track, play it
    this.props.setPrevTrack().then((manifestURL, playlistHLSURL, trackInfos) => {
      this.listen(manifestURL, m3u8playlist, trackInfos);
    });
  }

  setNextTrack (continuous) {
    this.props.setNextTrack(continuous).then(({manifestURL, playlistHLSURL, trackInfos}) => {
      console.log('next');
      this.listen(manifestURL, playlistHLSURL, trackInfos);
    });
  }

  chromecast () {
    const caster = new shaka.cast.CastProxy(this.audio.base, this.player);
    caster.cast();
    return;
    const url = this.audio.base.src;
    cast(url)
      .then(connexion => console.log(connexion))
      .catch(err => console.error(err));
  }

  render () {
    return (
      <div class="home">
        <Switch>
          <Route exact path="/" component={Library} />
          <Route exact path="/album/:id"
            render={props => <Album listen={this.listen} {...props} />}
          />
          <Route exact path="/settings" component={Settings} />
        </Switch>
        <MiniPlayer
          listen={this.listen}
          play={this.play}
          pause={this.pause}
          prev={this.setPrevTrack}
          next={this.setNextTrack}
          chromecast={this.chromecast}
        />
        <NavBar />
        {/*<Player ref={player => this.player = player} />*/}
        <Audio
          ref={audio => this.audio = audio}
          preload="metadata"
        />
      </div>
    );
  }
}

export default Home;
