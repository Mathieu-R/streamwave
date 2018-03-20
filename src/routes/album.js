import { Component } from 'preact';
import { connect } from 'react-redux';
import Constants from '../constants';
import Track from '../components/track';
import Switch from '../components/switch';
import ProgressRound from '../components/progress-round';
import { shuffle } from '../utils';
import { downloadTracklist, removeTracklistFromCache } from '../utils/download';
import styled from 'styled-components';

import {
  setTrack,
  setQueue,
  isShuffle,
  getDownloads
} from '../store/player';

import {
  toasting
} from '../store/toast';



const mapStateToProps = state => ({
  shuffle: isShuffle(state),
  downloads: getDownloads(state)
});

const mapDispatchToProps = dispatch => ({
  toasting: (messages, duration) => dispatch(toasting(messages, duration)),
  setTrack: (music) => dispatch(setTrack(music)),
  setQueue: (queue) => dispatch(setQueue(queue))
});

class Album extends Component {
  constructor () {
    super();

    this.handleTrackClick = this.handleTrackClick.bind(this);
    this.listenToTrack = this.listenToTrack.bind(this);
    this.download = this.download.bind(this);
  }

  componentWillMount () {
    const id = this.props.match.params.id;
    fetch(`${Constants.API_URL}/album/${id}`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      }
    })
      .then(response => response.json())
      .then(response => this.setState({...response}));
  }

  download (evt) {
    if (!Constants.SUPPORT_CACHE_API) {
      this.props.toasting(['Votre navigateur ne supporte pas le téléchargement de musiques...']);
      return;
    }

    const checked = evt.target.checked;
    if (checked) {
      // prevent multiples downloads of the same album to happen at the same time.
      if (this.isDownloading) {
        return;
      }

      this.isDownloading = true

      // download the album
      downloadTracklist(this.state.tracks, this.props.match.params.id).then(_ => {
        this.isDownloading = false
      });
      return;
    }

    removeTracklistFromCache(this.state.tracks);
  }

  handleTrackClick () {
    //const {artist, coverURL, track} = this.props;
    //this.listenToTrack()
  }

  listenToTrack (artist, title, coverURL, track) {
    const {tracks} = this.state;
    const {manifestURL, playlistHLSURL} = track;

    const index = tracks.findIndex(t => t.title === track.title);
    const queue = this.props.shuffle ? shuffle(tracks) : tracks;

    this.props.setQueue(queue);
    this.props.setTrack({
      artist,
      album: title,
      coverURL,
      track,
      index
    });

    this.props.listen(manifestURL, playlistHLSURL, {artist, album: title, title: track.title, coverURL});
  }

  render ({downloads}, {artist, coverURL, genre, primaryColor, title, tracks, year}) {
    return (
      <div class="album">
        <div class="album__info-block">
          <h1 class="album__title">{title}</h1>
          <h2 class="album__artist">{artist}</h2>
          <div class="album__download-container">
            <div class="album__download-container__progress">
            {
              downloads[this.props.match.params.id] ?
                <ProgressRound
                  progress={(downloads[this.props.match.params.id])}
                  value={Math.round((downloads[this.props.match.params.id]) * 100) + '%'}
                /> : ''
            }
            </div>
            <Switch label="Télécharger" onChange={this.download} />
          </div>
        </div>
        <div className="album-tracks">
          {tracks && tracks.map(track => (
            <Track
              {...track}
              onClick={_ => this.listenToTrack(artist, title, coverURL, track)}/>
          ))}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Album);
