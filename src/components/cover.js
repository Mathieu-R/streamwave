import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import pure from 'recompose/pure';
import styled, { keyframes } from 'styled-components';
import { getRGBCssFromObject } from '../utils';
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
  opacity: 1;
  animation: ${fade} linear 1s;
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
  width: 150px;
  height: 150px;
  /* background as placeholder (primary-color) */
  background: ${props => props.placeholderRGB};
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transition: transform 0.2s cubic-bezier(0, 0, 0.3, 1);
  will-change: transform;

  &:hover {
    transform: scale(1.05);
  }
`;

const Artwork = styled.img`
  width: 100%;
  height: 100%;
  opacity: 1;
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
  font-size: 12px;
  font-weight: 500;
`;

const Artist = styled.div`
  text-align: center;
  font-size: 14px;
`;

class Cover extends Component {
  render ({artist, title, coverURL, id, primaryColor}) {
    const placeholderRGB = getRGBCssFromObject(primaryColor);
    return (
      <Container>
        <CoverLink to={`/album/${id}`} >
          {/* cover__artwork class is useful for lazy-loading (at less until if find a better solution) */}
          <ArtworkContainer placeholderRGB={placeholderRGB}>
            <Artwork data-src={`${Constants.CDN_URL}/${coverURL}`} alt="cover artwork" className="cover__artwork lazy" />
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
