import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import pure from 'recompose/pure';
import styled, { keyframes } from 'styled-components';
import Constants from '../constants';

import playIcon from '../assets/svg/play.svg';

const fade = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  animation: ${fade} 1s linear 1s;
`;

const CoverLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #FFF;
  margin-bottom: 10px;
`;

const ArtworkContainer = styled.div`
  position: relative;
`;

const Artwork = styled.img`
  max-height: 150px;
  min-height: 100px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);

  &:hover {
    filter: brightness(0.3);
  }
`;

const Play = styled.button`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: url(${playIcon}) no-repeat no-repeat center;
  width: 48px;
  height: 48px;
  border: none;
  opacity: 0;
  transition: opacity .2s cubic-bezier(0, 0, 0.3, 1);

  ${Artwork}:hover &${Play}{
    opacity: 1;
  }
`;

const InfosContainer = styled.div`
  height: 50px;
  margin-top: 10px;
`;

const Title = styled.div`
  text-align: center;
  font-weight: bold;
`;

const Artist = styled.div`
  text-align: center;
`;

class Cover extends Component {
  render ({artist, title, coverURL, id}) {
    return (
      <Container>
        <CoverLink to={`/album/${id}`} >
          {/* cover__artwork class is useful for lazy-loading (at less until if find a better solution) */}
          <ArtworkContainer>
            <Artwork data-src={`${Constants.CDN_URL}/${coverURL}`} alt="cover artwork" className="cover__artwork" />
            <Play aria-label="play the music" />
          </ArtworkContainer>
          <InfosContainer>
            <Title>{title}</Title>
            <Artist>{artist}</Artist>
          </InfosContainer>
        </CoverLink>
      </Container>
    );
  }
}

export default pure(Cover);
