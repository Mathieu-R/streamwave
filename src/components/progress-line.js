import { h, Component } from 'preact';
import styled from 'styled-components';

const ProgressLineContainer = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
  display: flex;
  align-items: center;
  flex: 1;
  height: 3px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 5px;
  width: 100%;
`;

const ProgressTrack = styled.div`
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 100%;
  background: #FFF;
  border-radius: ${props => props.borderRadius ? '5px' : 0};
  transform: translate(0, -50%) scaleX(0);
  transform-origin: 0 50%;
  transition: transform 0.2s linear;
`;

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
      <ProgressLineContainer>
        <ProgressTrack innerRef={track => this.track = track} />
      </ProgressLineContainer>
    )
  }
}

export default ProgressLine;
