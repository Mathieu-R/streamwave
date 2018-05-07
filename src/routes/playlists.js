import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Constants from '../constants';
import { Container } from '../components/ui';

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
    .then(response => console.log(responses));
  }

  render ({}, {playlists}) {
    return (
      <Container>
        {playlists.map((playlist, index) => (
          <Link to={`/playlist/:${playlist._id}`} key={playlist._id}>
            <Playlist>
              <Title>{playlist.title}</Title>
              <Counter>{100} titres</Counter>
            </Playlist>
          </Link>
        ))}
      </Container>
    )
  }
}

export default Playlists;
