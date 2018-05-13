import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Constants from '../constants';
import { pluralize } from '../utils';
import { Container as UIContainer } from '../components/ui';
import TopBarHamburger from '../components/topbar-hamburger';

const Wrapper = styled(UIContainer)`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
`;

const CustomLink = styled(Link)`
  width: 100%;
  text-decoration: none;
  color: #FFF;
  padding: 10px 5px;

  &:hover, &:focus {
    background: #22242d;
  }
`;

const Playlist = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 10px;
`;

const Title = styled.span`
  font-size: 16px;
`;

const Counter = styled.span`
  font-size: 12px;
`;

class Playlists extends Component {
  constructor () {
    super();

    this.state = {
      playlists: []
    }
  }

  componentWillMount () {
    fetch(`${Constants.API_URL}/playlists`, {
      headers: {
        authorization: `Bearer ${localStorage.getItem('streamwave-token')}`
      }
    })
    .then(response => response.json())
    .then(playlists => this.setState({playlists}));
  }

  render ({}, {playlists}) {
    return (
      <div>
        <TopBarHamburger />
        <Wrapper>
          {playlists.map((playlist, index) => (
            <CustomLink to={`/playlist/${playlist._id}`} key={playlist._id}>
              <Playlist>
                <Title>{playlist.title}</Title>
                <Counter>{playlist.tracks.length} {pluralize('titres', playlist.tracks.length)}</Counter>
              </Playlist>
            </CustomLink>
          ))}
        </Wrapper>
      </div>
    )
  }
}

export default Playlists;
