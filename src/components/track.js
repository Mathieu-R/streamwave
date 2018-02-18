import { Component } from 'preact';

class Track extends Component {
  formatDuration (duration) {
    return `${Math.floor(duration / 60)}:${duration % 60}`;
  }

  render ({number, title, duration, manifestURL, playlistHLSURL, audio128URL, audio192URL, audio256URL}) {
    return (
      <div className="track">
        <div className="track__number">{number}</div>
        <div className="track__name">{title}</div>
        <div className="track__is-offline"></div>
        <div className="track__duration">{this.formatDuration(number)}</div>
      </div>
    );
  }
}

export default Track;
