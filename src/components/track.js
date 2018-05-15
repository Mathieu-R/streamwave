import { h, Component } from 'preact';
import { formatDuration } from '../utils';
import styled, { keyframes } from 'styled-components';

const PADDING = '5px';

const fade = keyframes`
  0% {
    opacity: 0;
    transform: scale(0.98);
  }
  75% {
    opacity: 1;
    transform: scale(1.01);
  }
  100% {
    opaity: 1;
    transform: scale(1);
  }
`;

const Container = styled.div`
  display: grid;
  grid-template-columns: 20px 1fr;
  grid-auto-flow: column;
  height: 45px;
  font-weight: bold;
  grid-gap: 20px;
  cursor: pointer;
  opacity: 1;
  transform: scale(1);
  animation: ${fade} linear .5s;

  &:hover, &:focus {
    background: #22242d;
  }
`;

const Number = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${PADDING};
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  padding: ${PADDING};
`;

const Duration = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${PADDING};
`;

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
      <Container onClick={this.onClick}>
        <Number>{number}</Number>
        <Title>{title}</Title>
        <Duration>{formatDuration(duration)}</Duration>
      </Container>
    );
  }
}

export default Track;
