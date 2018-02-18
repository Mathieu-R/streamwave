import { Component } from 'preact';

class Track extends Component {

  listenToTrack (evt) {

  }

  formatDuration (duration) {
    const min = Math.floor(duration / 60);
    let sec = duration % 60;
    sec = sec < 10 ? "0" + sec : sec;
    return `${min}:${sec}`;
  }

  render ({number, title, duration, manifestURL, playlistHLSURL, audio128URL, audio192URL, audio256URL}) {
    return (
      <div className="track" onClick={evt => this.listenToTrack(evt)}>
        <div className="track__number">{number}</div>
        <div className="track__name">{title}</div>
        <div className="track__is-offline"></div>
        <div className="track__duration">{this.formatDuration(duration)}</div>
      </div>
    );
  }
}

export default Track;
