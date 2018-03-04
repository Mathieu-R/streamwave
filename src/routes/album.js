import { Component } from 'preact';
import { connect } from 'react-redux';
import Constants from '../constants';
import Track from '../components/track';
import Player from '../player';

import {
  setTrack
} from '../store/player';

const mapStateToProps = state => ({
  library: state.library
});

const mapDispatchToProps = dispatch => ({
  setTrack: (music) => dispatch(setTrack(music))
});

class Album extends Component {
  constructor () {
    super();

    this.handleTrackClick = this.handleTrackClick.bind(this);
    this.listenToTrack = this.listenToTrack.bind(this);
  }

  componentWillMount () {
    this.player = new Player();

    const id = this.props.match.params.id;
    fetch(`${Constants.API_URL}/album/${id}`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      }
    })
      .then(response => response.json())
      .then(response => this.setState({...response}));
  }

  handleTrackClick () {
    //const {artist, coverURL, track} = this.props;
    //this.listenToTrack()
  }

  listenToTrack (artist, coverURL, track) {
    const {manifestURL, playlistHLSURL} = track;

    this.props.setTrack({
      artist,
      coverURL,
      track
    });

    this.player.listen(manifestURL, playlistHLSURL, track);
    this.player.watchRemoteAvailability();
  }

  render ({}, {artist, coverURL, genre, primaryColor, title, tracks, year}) {
    return (
      <div class="album">
        <div class="album__info-block">
          <h1 class="album__title">{title}</h1>
          <h2 class="album__artist">{artist}</h2>
          <div class="album__download-container">
            <div class="album__download-container__progress"></div>
            <div class="album__download-container__toggle">
              <input type="checkbox" class="album__download-container__toggle-checkbox" id="toggle-download" />
              <label class="album__download-container__toggle-label" for="toggle-download">Télécharger</label>
            </div>
          </div>
        </div>
        <div className="album-tracks">
          {tracks && tracks.map(track => (
            <Track
              {...track}
              onClick={_ => this.listenToTrack(artist, coverURL, track)}/>
          ))}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Album);
