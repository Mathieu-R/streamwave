import { h } from 'preact';
import { formatDuration } from '../utils';
import styled from 'styled-components';

const PADDING = '5px';

const Container = styled.div`
  display: grid;
  grid-template-columns: 20px 1fr;
  grid-auto-flow: column;
  height: 45px;
  font-weight: bold;
  grid-gap: 20px;
  cursor: pointer;

  &:hover, &:focus {
    background: #262D4D;
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

const IsOffline = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${PADDING};
`;

const Duration = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${PADDING};
`;

const Track = ({
  number, title, duration, manifestURL,
  playlistHLSURL, audio128URL, audio192URL,
  audio256URL, onClick
}) => (
  <Container onClick={onClick}>
    <Number>{number}</Number>
    <Title>{title}</Title>
    <IsOffline></IsOffline>
    <Duration>{formatDuration(duration)}</Duration>
  </Container>
);

export default Track;
