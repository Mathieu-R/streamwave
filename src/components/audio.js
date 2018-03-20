import { Component } from 'preact';
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

    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
    this.onEnded = this.onEnded.bind(this);
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

  onEnded (evt) {
    console.log(evt);
    this.props.next({continuous: true});
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
