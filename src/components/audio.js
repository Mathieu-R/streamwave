import { Component } from 'preact';
import { connect } from 'react-redux';
import shaka from 'shaka-player';
import Constants from '../constants';

import {
  setCurrentTime, setTrack, setQueue
} from '../store/player';

const mapDispatchToProps = dispatch => ({
  setCurrentTime: time => dispatch(setCurrentTime(time)),
  setTrack: music => dispatch(setTrack(music)),
  setQueue: queue => dispatch(setQueue(queue))
});

class Audio extends Component {
  constructor () {
    super();

    this.player = null;
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

  }

  setNextTrack () {

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
    const {queue} = this.props;
    const {artist, coverURL, track} = queue[0];

    this.props.setTrack({
      artist,
      coverURL,
      track
    });

    this.props.setQueue([...queue.slice(1)]);
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

export default connect(null, mapDispatchToProps)(Audio);
