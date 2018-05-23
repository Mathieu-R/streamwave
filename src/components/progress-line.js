import { h, Component } from 'preact';

class ProgressLine extends Component {
  shouldComponentUpdate () {
    return false;
  }

  componentWillReceiveProps (props) {
    const {progress} = props;
    this.track.style.transform = `translate(0, -50%) scaleX(${progress})`;
  }

  render () {
    return (
      <div class="progress-line">
        <div class="progress-line__track" ref={track => this.track = track} />
      </div>
    );
  }
}

export default ProgressLine;
