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

const Container = styled.div``;

const Infos = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  height: 150px;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: bold;
  margin: 5px 0;
`;

const Artist = styled.h2`
  font-weight: 18px;
  color: #7C7C7C;
  margin: 0;
`;

const Download = styled.div`
  position: absolute;
  bottom: 0;
  right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 35px;
`;

const Tracks = styled.section`
  margin: 0 10px;
`;


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
      <Container>
        <Infos>
          <Title>{title}</Title>
          <Artist>{artist}</Artist>
          <Download>
            {
              downloads[this.props.match.params.id] ?
                <ProgressRound
                  progress={(downloads[this.props.match.params.id])}
                  value={Math.round((downloads[this.props.match.params.id]) * 100) + '%'}
                /> : ''
            }
            <Switch label="Télécharger" onChange={this.download} />
          </Download>
        </Infos>
        <Tracks>
          {tracks && tracks.map(track => (
            <Track
              {...track}
              onClick={_ => this.listenToTrack(artist, title, coverURL, track)}/>
          ))}
        </Tracks>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Album);
