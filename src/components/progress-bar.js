import { h, Component } from 'preact';
import { connect } from 'react-redux';
import styled from 'styled-components';

import {
  getDuration,
  getCurrentTime,
  setCurrentTime
} from '../store/player';

const mapStateToProps = state => ({
  duration: getDuration(state),
  currentTime: getCurrentTime(state)
});

const mapDispatchToProps = dispatch => ({
  setCurrentTime: time => dispatch(setCurrentTime(time))
});

const ProgressBarContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  height: 100%;
  background: rgba(255,255,255,0.5);
  border-radius: ${props => props.borderRadius ? '5px' : 0};
`;

const ProgressTrack = styled.div.attrs({
  style: props => ({
    transform: `translate(0, -50%) scaleX(${props.position})`
  })
})`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FFF;
  border-radius: ${props => props.borderRadius ? '5px' : 0};
  transform-origin: 0 50%;
  will-change: transform;
`;

const ProgressRoundContainer = styled.div.attrs({
  style: props => ({
    transform: `translateX(${props.position * 100}%)`
  })
})`
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
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  transform: translateY(-50%) scale(0.7);
  transition: transform .2s cubic-bezier(0, 0, 0.3, 1);
  will-change: transform;

  &:hover, &:focus, &:active {
    transform: translateY(-50%) scale(1);
    box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.2);
  }

  ${ProgressRoundContainer}:hover, ${ProgressRoundContainer}:focus, ${ProgressRoundContainer}:active {
    transform: translateY(-50%) scale(1);
    box-shadow: 0 0 0 5px rgba(255, 255, 255, 0.2);
  }
`;

class ProgressBar extends Component {
  constructor () {
    super();
    this.onResize = this.onResize.bind(this);
    this.updatePosition = this.updatePosition.bind(this);
    this.onSwipeStart = this.onSwipeStart.bind(this);
    this.onSwipeMove = this.onSwipeMove.bind(this);
    this.onSwipeEnd = this.onSwipeEnd.bind(this);

    this.state = {
      dragging: false,
      bcr: null
    }
  }

  componentDidMount () {
    document.addEventListener('touchmove', this.onSwipeMove);
    document.addEventListener('touchend', this.onSwipeEnd);
    document.addEventListener('mousemove', this.onSwipeMove);
    document.addEventListener('mouseup', this.onSwipeEnd);
    window.addEventListener('resize', this.onResize);
    this.onResize();
  }

  componentWillUnmount () {
    document.removeEventListener('touchmove', this.onSwipeMove);
    document.removeEventListener('touchend', this.onSwipeEnd);
    document.removeEventListener('mousemove', this.onSwipeMove);
    document.removeEventListener('mouseup', this.onSwipeEnd);
    window.removeEventListener('resize', this.onResize);
  }

  // shouldComponentUpdate (nextProps) {
  //   if (nextProps.duration !== this.props.duration) return false;
  //   if (nextProps.currentTime !== this.props.currentTime) return false;
  //   return true;
  // }

  componentWillReceiveProps (nextProps) {
    if (!this.state.bcr) {
      this.onResize();
    }
  }

  onResize () {
    if (!this.container) return;
    const bcr = this.container.getBoundingClientRect();
    this.setState({bcr});
  }

  findCandidate (evt) {
    if (evt.touches && evt.touches.length) {
      return evt.touches[0];
    }

    if (evt.changedTouches && evt.changedTouches.length) {
      return evt.changedTouches[0];
    }

    return evt;
  }

  updatePosition (evt) {
    const position = this.findCandidate(evt).pageX;
    const normalizedPosition = ((position - this.state.bcr.left) / this.state.bcr.width);
    const clampedPosition = Math.max(0, Math.min(normalizedPosition, 1));
    const currentTime = clampedPosition * this.props.duration;
    this.props.setCurrentTime(currentTime);
    // should set the current time of audio element => this.audio.currentTime = currentTime
    this.props.seek(currentTime);
  }

  onSwipeStart (evt) {
    evt.stopPropagation();
    this.setState({dragging: true});
  }

  onSwipeMove (evt) {
    evt.stopPropagation();
    if (!this.state.dragging) {
      return;
    }

    this.updatePosition(evt);
  }

  onSwipeEnd (evt) {
    evt.stopPropagation();
    if (!this.state.dragging) {
      return;
    }

    this.setState({dragging: false});
    this.updatePosition(evt);
  }

  render ({duration, currentTime}) {
    // do not render component if not necessary
    if (!duration && !currentTime) return null;

    const clampedPosition = currentTime / duration;

    return (
      <ProgressBarContainer
        innerRef={container => this.container = container}
        onTouchStart={this.onSwipeStart}
        onMouseDown={this.onSwipeStart}
        borderRadius={this.props.borderRadius}
      >
        <ProgressTrack position={clampedPosition} borderRadius={this.props.borderRadius} />
        <ProgressRoundContainer position={clampedPosition} onFocus={evt => console.log('focus')} onBlur={evt => console.log('blur')}>
          <ProgressRound className="progress-bar" />
        </ProgressRoundContainer>
      </ProgressBarContainer>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProgressBar);
