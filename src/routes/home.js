import { h, Component } from 'preact';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import shaka from 'shaka-player';
import settingsManager from '../utils/settings-manager';
import Loadable from '@7rulnik/react-loadable';
import Chromecaster from '../utils/chromecast';
import Constants from '../constants';

import Loading from '../components/loading';
import SideNav from '../components/side-nav';
import MiniPlayer from '../components/mini-player';
import Player from '../components/player';
import NavBar from '../components/navbar';
import Audio from '../components/audio';

// TODO: webpackPrefetch: true
const Library = Loadable({
  loader: () => import('./library' /* webpackChunkName: "route-library" */),
  loading: Loading,
  timeout: 10000
});

const Album = Loadable({
  loader: () => import('./album' /* webpackChunkName: "route-album" */),
  loading: Loading,
  timeout: 10000
});

import Settings from './settings';
import Search from './search';

import About from './about';
import Licences from './licences';

import {
  restoreSettings
} from '../store/settings';

import {
  setPlayingStatus,
  switchPlayingStatus,
  setPrevTrack,
  setNextTrack
} from '../store/player';

const Container = styled.section`
  height: 100%;
  /* prevent navbar and mini-player to overlap */
  margin-bottom: 100px;
`;

const MiniPlayerAndNavBarContainer = styled.section`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100px;
  width: 100%;
  background: #212121;
`;

const mapDispatchToProps = dispatch => ({
  restoreSettings: _ => dispatch(restoreSettings()),
  setPlayingStatus: payload => dispatch(setPlayingStatus(payload)),
  setPrevTrack: _ => dispatch(setPrevTrack()),
  setNextTrack: payload => dispatch(setNextTrack(payload)),
  switchPlayingStatus: _ => dispatch(switchPlayingStatus())
});

class Home extends Component {
  constructor () {
    super();

    this.context = null;
    this.source = null;

    this.chromecaster = null;

    this.audio = null;
    this.player = null;
    this.skipTime = 15;

    this.listen = this.listen.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.onPlayClick = this.onPlayClick.bind(this);
    this.seekBackward = this.seekBackward.bind(this);
    this.seekForward = this.seekForward.bind(this);
    this.setPrevTrack = this.setPrevTrack.bind(this);
    this.setNextTrack = this.setNextTrack.bind(this);
    this.chromecast = this.chromecast.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
    this.seek = this.seek.bind(this);
    this.crossFade = this.crossFade.bind(this);
  }

  componentDidMount () {
    this.initWebAudioApi();
    this.initShakaPlayer();
    this.initMediaSession();
    this.props.restoreSettings();

    this.chromecaster = new Chromecaster();
    console.log('home');
  }

  initWebAudioApi () {
    // create a new audio context
    this.context = new (AudioContext || webkitAudioContext)();
    // bind the context to our <audio /> element
    this.source = this.context.createMediaElementSource(this.audio.base);
    // connect source to context
    // otherwise we could'nt hear anything from the audio element
    this.source.connect(this.context.destination);
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
    //this.player.addEventListener('buffering', evt => console.log(evt));

    // register a response filter in order to track streaming
    // chunk downloaded
    // https://github.com/google/shaka-player/issues/1416
    const networkEngine = this.player.getNetworkingEngine();
    networkEngine.registerResponseFilter((type, response) => {
      // we're only interested in segments requests
      if (type == shaka.net.NetworkingEngine.RequestType.SEGMENT) {
        // bytes downloaded
        const value = response.data.byteLength;
        console.log(value);
        // TODO: update idb cache to save the user data volume consumed
      }
    })
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

  crossFade (fade) {
    const FADE_TIME = fade;
    const audio = this.audio.base;

    // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#webaudio
    this.context.resume().then(_ => {
      // gain node
      const gainNode = this.context.createGain();
      // current time
      const currentTime = audio.currentTime;
      // duration
      const duration = audio.duration;

      // fade in launched track
      gainNode.gain.linearRampToValueAtTime(0, currentTime);
      gainNode.gain.linearRampToValueAtTime(1, currentTime + FADE_TIME);

      // fade out
      gainNode.gain.linearRampToValueAtTime(1, duration - FADE_TIME / 2);
      gainNode.gain.linearRampToValueAtTime(0, duration);

      // call this function when current music is finished playing (next is playing so ;))
      //setTimeout(this.crossFade(), (duration - FADE_TIME) * 1000);
    });
  }

  equalizeVolume () {

  }

  setEqualizer () {

  }

  onPlayClick ({playing}) {
    // switch status in store
    this.props.switchPlayingStatus();
    // update audio
    playing ? this.pause() : this.play();
  }

  play () {
    return this.audio.base.play();
    // const settings = await (new settingsManager().getAll());
    // const fade = settings['fade'];

    // // if fade = 0, we consider it as disabled
    // if (fade > 0) {
    //   this.crossFade(fade);
    // }
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

  changeVolume (volume) {
    this.audio.base.volume = volume / 100;
  }

  seek (time) {
    this.audio.base.currentTime = time
  }

  setPrevTrack () {
    const currentTime = this.audio.base.currentTime;
    // if we have listened more than 2 sec, simply replay the current audio
    if (currentTime > 2) {
      this.seek(0);
      return;
    }

    // update redux state, get new current track, play it
    this.props.setPrevTrack().then(({manifestURL, playlistHLSURL, trackInfos}) => {
      this.listen(manifestURL, playlistHLSURL, trackInfos);
    });
  }

  setNextTrack (continuous) {
    this.props.setNextTrack(continuous).then(({manifestURL, playlistHLSURL, trackInfos}) => {
      this.listen(manifestURL, playlistHLSURL, trackInfos);
    });
  }

  chromecast ({chromecasting}) {
    if (chromecasting) {
      this.chromecaster.stop();
      return;
    }

    const url = '/chromecast';
    this.chromecaster.cast(url)
      .then(connexion => console.log(connexion))
      .catch(err => console.error(err));
  }

  render () {
    return (
      <Container>
        <SideNav />
        <Switch>
          <Route exact path="/" component={Library} />
          <Route exact path="/album/:id"
            render={props => <Album listen={this.listen} {...props} />}
          />
          <Route exact path="/search" component={Search} />
          <Route exact path="/settings" component={Settings} />
          <Route exact path="/about" component={About} />
          <Route exact path="/licences" component={Licences} />
        </Switch>
        <Player
          onPlayClick={this.onPlayClick}
          prev={this.setPrevTrack}
          next={this.setNextTrack}
          chromecast={this.chromecast}
          onVolumeChange={this.changeVolume}
          seek={this.seek}
        />
        <MiniPlayerAndNavBarContainer>
          <MiniPlayer
            listen={this.listen}
            onPlayClick={this.onPlayClick}
            prev={this.setPrevTrack}
            next={this.setNextTrack}
            chromecast={this.chromecast}
            seek={this.seek}
          />
          <NavBar />
        </MiniPlayerAndNavBarContainer>
        <Audio
          ref={audio => this.audio = audio}
          preload="metadata"
          next={this.setNextTrack}
          crossFade={this.crossFade}
        />
      </Container>
    );
  }
}

export default connect(null, mapDispatchToProps)(Home);
