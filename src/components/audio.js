import { h, Component } from 'preact';
import { connect } from 'react-redux';
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
  setCurrentTime: time => dispatch(setCurrentTime(time))
});

class Audio extends Component {
  constructor () {
    super();
    this.audio = null;

    this.trackTimeUpdate = this.trackTimeUpdate.bind(this);
    this.onEnded = this.onEnded.bind(this);
  }

  shouldComponentUpdate () {
    // audio has no ui
    // should not rerender
    return false;
  }

  componentDidMount () {
    requestAnimationFrame(this.trackTimeUpdate);
  }

  trackTimeUpdate () {
    if (!this.audio) {
      return;
    }
    // onTimeUpdate event does not allow me to have 60fps
    // cause it does not fire enough
    const {duration, currentTime} = this.audio;
    requestAnimationFrame(this.trackTimeUpdate);

    // bail if no music played
    if (!duration) {
      return;
    }

    // bail if audio paused
    if (this.audio.paused) {
      return;
    }

    this.props.setCurrentTime(currentTime);
  }

  onEnded (evt) {
    this.props.next({continuous: true});
  }

  render () {
    return (
      <audio
        ref={audio => this.audio = audio}
        preload="metadata"
        onEnded={this.onEnded}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Audio);
