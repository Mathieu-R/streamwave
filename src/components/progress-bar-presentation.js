import { h, Component } from 'preact';
import styled from 'styled-components';

const ProgressBarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;
  background: rgba(255,255,255,0.5);
`;

const ProgressTrack = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FFF;
  transform: translate(0, -50%);
  transform-origin: 0 50%;
`;

const ProgressRoundContainer = styled.div`
  position: relative;
  width: 100%;
  background: 0 0;
  border: none;
  outline: none;
  pointer-events: none;
`;

const ProgressRound = styled.div`
  position: absolute;
  top: 50%;
  left: -5px;
  height: 15px;
  width: 15px;
  outline: 0;
  border-radius: 50%;
  background: #FFF;
  transform: translateY(-50%) scale(0.7);
  transition: transform .2s cubic-bezier(0, 0, 0.3, 1);
`;

class ProgressBar extends Component {
  constructor () {
    super();

    this.bcr = null;
    this.track = null;
    this.round = null;
  }

  componentDidMount () {
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount () {
    window.removeEventListener('resize', this.onResize);
  }

  shouldComponentUpdate (nextProps) {
    if (this.props.duration === null && nextProps.duration !== null) {
      return true;
    }

    if (this.props.currentTime === null && nextProps.currentTime !== null) {
      return true;
    }

    return false;
  }

  componentWillReceiveProps (props) {
    if (!this.bcr) {
      this.onResize();
    }

    const clampedPosition = props.currentTime / props.duration;
    requestAnimationFrame(() => this.update(clampedPosition));
  }

  onResize () {
    if (!this.container) return;
    const bcr = this.container.getBoundingClientRect();
    this.bcr = bcr;
  }

  update (position) {
    this.track.style.transform = `translate(0, -50%) scaleX(${position})`;
    this.round.style.transform = `translateX(${position * 100}%)`;
  }

  render ({duration, currentTime}) {
    // do not render component if not necessary
    if (!duration && !currentTime) return null;

    return (
      <ProgressBarContainer
        innerRef={container => this.container = container}
      >
        <ProgressTrack innerRef={track => this.track = track} />
        <ProgressRoundContainer innerRef={container => this.round = container}>
          <ProgressRound />
        </ProgressRoundContainer>
      </ProgressBarContainer>
    )
  }
}

export default ProgressBar;
