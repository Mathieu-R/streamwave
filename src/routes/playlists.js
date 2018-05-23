import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import { pluralize } from '../utils';
import TopBarHamburger from '../components/topbar-hamburger';
import Constants from '../constants';

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
        <section class="container playlists__wrapper">
          {playlists.map((playlist, index) => (
            <Link class="playlists__link" to={`/playlist/${playlist._id}`} key={playlist._id}>
              <div class="playlists__playlist">
                <span class="playlists__title">{playlist.title}</span>
                <span class="playlists__tracks-counter">{playlist.tracks.length} {pluralize('titre', playlist.tracks.length)}</span>
              </div>
            </Link>
          ))}
        </section>
      </div>
    )
  }
}

export default Playlists;
