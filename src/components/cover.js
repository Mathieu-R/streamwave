import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Constants from '../constants';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoverLink = styled(Link)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #FFF;
  margin-bottom: 10px;
`;

const Artwork = styled.img`
  max-height: 150px;
  min-height: 100px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.5);
  margin-bottom: 10px;
`;

const Artist = styled.span`
  font-weight: bold;
`;

const Title = styled.span``;


class Cover extends Component {
  render ({artist, title, coverURL, _id}) {
    return (
      <Container>
        <CoverLink to={`/album/${_id}`} >
          {/* cover__artwork class is useful for lazy-loading (at less until if find a better solution) */}
          <Artwork data-src={`${Constants.CDN_URL}/${coverURL}`} className="cover__artwork" />
          <Artist>{artist}</Artist>
          <Title>{title}</Title>
        </CoverLink>
      </Container>
    );
  }
}

export default Cover;
