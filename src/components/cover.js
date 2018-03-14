import { Component } from 'preact';
import { Link } from 'react-router-dom';
import Constants from '../constants';

const Cover = styled.div`
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
      <div class="cover">
        <Link to={`/album/${_id}`} class="cover__link">
          <img class="cover__artwork" data-src={`${Constants.CDN_URL}/${coverURL}`}/>
          <span class="cover__artist">{artist}</span>
          <span class="cover__album-title">{title}</span>
        </Link>
      </div>
    );
  }
}

export default Cover;
