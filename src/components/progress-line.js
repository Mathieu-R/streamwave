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

const ProgressTrack = styled.div.attrs({
  style: props => ({
    transform: `translate(0, -50%) scaleX(${props.progress})`
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

const ProgressLine = ({progress, value}) => (
  <ProgressLineContainer>
    <ProgressTrack progress={progress} />
  </ProgressLineContainer>
)

export default ProgressLine;
