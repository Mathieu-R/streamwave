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

    return false;
  }

  onClick (evt) {
    const {track} = this.props;
    this.props.handleTrackClick(track);
  }

  render ({number, title, duration}) {
    return (
      <div class="track" onClick={this.onClick}>
        <div class="track__number">{number}</div>
        <div class="track__title">{title}</div>
        <div class="track__duration">{formatDuration(duration)}</div>
      </div>
    );
  }
}

export default Track;
