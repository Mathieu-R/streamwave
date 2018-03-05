import { Component } from 'preact';
import { connect } from 'react-redux';

import {
  setCurrentTime
} from '../store/player';

const mapDispatchToProps = dispatch => ({
  setCurrentTime: time => dispatch(setCurrentTime(time))
});

class Audio extends Component {
  constructor () {
    super();

    this.onPlay = this.onPlay.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onLoadedMetadata = this.onLoadedMetadata.bind(this);
  }

  onPlay (evt) {
    // const duration = this.audio.duration;
    // if (duration !== this.props.duration) {
    //   this.props.setDuration(duration);
    // }
  }

  onPause (evt) {

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
      />
    );
  }
}

export default connect(null, mapDispatchToProps)(Audio);
