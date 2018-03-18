import { Component } from 'preact';
import { connect } from 'react-redux';
import shaka from 'shaka-player';
import Constants from '../constants';

import {
  setCurrentTime, setTrack, setQueue, setPrevTrack, setNextTrack, getTrack, getTrackInfos, isMusicPlaying
} from '../store/player';

const mapStateToProps = state => ({
  trackInfos: getTrackInfos(state),
  track: getTrack(state),
  isMusicPlaying: isMusicPlaying(state)
});

const mapDispatchToProps = dispatch => ({
  setCurrentTime: time => dispatch(setCurrentTime(time)),
  setTrack: music => dispatch(setTrack(music)),
  setQueue: queue => dispatch(setQueue(queue)),
  setPrevTrack: _ => dispatch(setPrevTrack()),
  setNextTrack: payload => dispatch(setNextTrack(payload))
});

class Audio extends Component {
  constructor () {
    super();

    this.audio = null;
    this.player = null;
    this.currentTrack = null;
    this.isPlaying = false;

    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.listen = this.listen.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onLoadedMetadata = this.onLoadedMetadata.bind(this);

    this.state = {
      skipTime: 15
    }
  }

  componentDidMount () {
    this.initShakaPlayer();
    this.initMediaSession();
  }

  componentWillReceiveProps (props) {
    // compoare track id
    if (props.track['_id'] !== this.currentTrack) {
      this.currentTrack = props.track['_id'];
      this.isPlaying = true;

      const {manifestURL, playlistHLSURL} = props.track;
      this.listen(manifestURL, playlistHLSURL, props.trackInfos);
      return;
    }

    console.log(props.isMusicPlaying)

    if (props.isMusicPlaying !== this.isPlaying) {
      if (props.isMusicPlaying) {
        this.audio.play();
        return;
      }

      this.audio.pause();
    }
  }

  initShakaPlayer () {
    // install shaka player polyfills
    shaka.polyfill.installAll();

    if (!shaka.Player.isBrowserSupported()) {
      console.error('Browser not supported by shaka-player...');
      return;
    }

    this.player = new shaka.Player(this.audio);

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

    navigator.mediaSession.setActionHandler('play', this.play);
    navigator.mediaSession.setActionHandler('pause', this.pause);
    navigator.mediaSession.setActionHandler('seekbackward', this.seekBackward);
    navigator.mediaSession.setActionHandler('seekforward', this.seekForward);
    navigator.mediaSession.setActionHandler('previoustrack', this.setPreviousTrack);
    navigator.mediaSession.setActionHandler('nexttrack', this.setNextTrack);
  }

  listen (manifest, m3u8playlist, trackInfos) {
    // load the player
    return this.player.load(`${Constants.CDN_URL}/${manifest}`).then(_ => {
      console.log(`[shaka-player] Music loaded: ${manifest}`);
      return this.audio.play();
    })
    .then(_ => this.setMediaNotifications(trackInfos))
    .catch(err => {
      console.error(err);
      // if fail, fallback to HLS format (safari mobile)
      this.player.unload().then(_ => this.fallbackToHLS(m3u8playlist, trackInfos))
    });
  }

  fallbackToHLS (m3u8playlist, trackInfos) {
    // simply put it in src attribute
    this.audio.src = `${Constants.CDN_URL}/${m3u8playlist}`;
    this.audio.play().then(_ => this.setMediaNotifications(trackInfos));
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

  play () {
    this.audio.play();
  }

  pause () {
    this.audio.pause();
  }

  seekBackward () {
    this.audio.currentTime = Math.max(0, this.audio.currentTime - this.state.skipTime);
  }

  seekForward () {
    this.audio.currentTime = Math.min(this.audio.duration, this.audio.currentTime + this.state.skipTime);
  }

  setPreviousTrack () {
    this.props.setPrevTrack();
  }

  setNextTrack () {
    this.props.setNextTrack({continuous: false});
  }

  onPlay (evt) {
    // const duration = this.audio.duration;
    // if (duration !== this.props.duration) {
    //   this.props.setDuration(duration);
    // }
  }

  onPause (evt) {

  }

  onEnded (evt) {
    console.log(evt);
    this.props.setNextTrack({continuous: true});
  }

  onTimeUpdate (evt) {
    const {duration, currentTime} = this.audio;
    // onTimeUpdate fires up even when no audio is played.
    if (!duration) return;

    this.props.setCurrentTime(currentTime);
  }

  onLoadedMetadata (evt) {
    this.onTimeUpdate(evt);
  }

  render () {
    return (
      <audio
        ref={audio => this.audio = audio}
        preload="metadata"
        onTimeUpdate={this.onTimeUpdate}
        onLoadedMetadata={this.onLoadedMetadata}
        onEnded={this.onEnded}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Audio);
