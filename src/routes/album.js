import { Component } from 'preact';
import { connect } from 'react-redux';
import Constants from '../constants';
import Track from '../components/track';
import Switch from '../components/switch';
import Player from '../player';
import { shuffle } from '../utils';

import {
  setTrack,
  setQueue
} from '../store/player';

const mapStateToProps = state => ({
  library: state.library,
  shuffle: state.shuffle
});

const mapDispatchToProps = dispatch => ({
  setTrack: (music) => dispatch(setTrack(music)),
  setQueue: (queue) => dispatch(setQueue(queue))
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
    const {tracks} = this.state;
    const {manifestURL, playlistHLSURL} = track;

    const index = tracks.findIndex(t => t.title === track.title);
    const queue = this.props.shuffle ? shuffle(tracks) : tracks;

    this.props.setQueue(queue);
    this.props.setTrack({
      artist,
      coverURL,
      track,
      index
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
            <Switch label="Télécharger" />
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
