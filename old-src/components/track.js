import { h, Component } from 'preact';
import { formatDuration } from '../utils';

class Track extends Component {
  constructor () {
    super();
    this.onClick = this.onClick.bind(this);
  }

  shouldComponentUpdate (nextProps) {
    if (nextProps.title !== this.props.title) {
      return true;
    }

    if (nextProps.currentTrackId !== this.props.currentTrackId) {
      return true;
    }

    return false;
  }

  onClick (evt) {
    const {track} = this.props;
    this.props.handleTrackClick(track);
  }

  render ({number, title, duration, id, currentTrackId}) {
    return (
      <div class={
        id === currentTrackId ?
        'track track--active' :
        'track'
        } onClick={this.onClick}>
        <div class="track__number">{number}</div>
        <div class="track__title">{title}</div>
        <div class="track__duration">{formatDuration(duration)}</div>
      </div>
    );
  }
}

export default Track;
