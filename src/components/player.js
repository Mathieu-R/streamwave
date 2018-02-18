import { Component } from 'preact';
import { connect } from 'react-redux';
import Constants from '../constants';

class Player extends Component {
  render () {
    return (
      <div class="player">
        <div class="cover">
          <img class="cover__artwork" src={`${Constants.CDN_URL}/${coverURL}`}/>
          <div class="cover__infos-block">
            <div class="cover__infos">
              <span class="cover__artist">{artist}</span>
              <span class="cover__album-title">{title}</span>
            </div>
            <div class="track--add-to-playlist"></div>
          </div>
        </div>
        <div class="progress-container">
          <div class="progress__current-time"></div>
          <div class="progress-bar-container">
            <div class="progress-bar">
              <div class="progress-track"></div>
              <div class="progress-round-container">
                <div class="progress-round"></div>
              </div>
            </div>
          </div>
          <div class="progress__total-time"></div>
        </div>
        <div className="player__controls">
          <div className="player__controls-main">
            <button className="player__controls-shuffle">
            </button>
            <button className="player__controls-prev">
            </button>
            <button className="player__controls-play" onClick={evt => this.play(evt)}>
            </button>
            <button className="player__controls-next">
            </button>
            <button className="player__controls-repeat">
            </button>
          </div>
          <button className="player__controls-chromecast">
          </button>
        </div>
        <audio
          ref={audio => this.audioElement = audio}
          preload="metadata"
        >
        </audio>
      </div>
    );
  }
}

export default Player;
