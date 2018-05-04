import { h, Component } from 'preact';
import { connect } from 'react-redux';
import { get, set } from 'idb-keyval';
import Constants from '../constants';
import Track from '../components/track';
import Switch from '../components/switch';
import TopBarBack from '../components/topbar-back';
import ProgressLine from '../components/progress-line';
import { shuffle } from '../utils';
import { downloadTracklist, downloadTracklistInBackground, removeTracklistFromCache } from '../utils/download';
import styled from 'styled-components';

import {
  setTrack,
  setQueue,
  setPrimaryColor,
  isShuffle,
  getDownloads
} from '../store/player';

import {
  toasting
} from '../store/toast';

import {
  getDownloadWithMobileNetwork
} from '../store/settings';

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
  font-size: 18px;
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
  width: 100%;
`;

const SwitchContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const Tracks = styled.section`
  margin: 0 10px;
`;

const mapStateToProps = state => ({
  shuffle: isShuffle(state),
  downloads: getDownloads(state),
  downloadWithMobileNetwork: getDownloadWithMobileNetwork(state)
});

const mapDispatchToProps = dispatch => ({
  toasting: (messages, duration) => dispatch(toasting(messages, duration)),
  setTrack: (music) => dispatch(setTrack(music)),
  setQueue: (queue) => dispatch(setQueue(queue)),
  setPrimaryColor: primaryColor => dispatch(setPrimaryColor(primaryColor))
});

class Album extends Component {
  constructor () {
    super();

    this.handleTrackClick = this.handleTrackClick.bind(this);
    this.listenToTrack = this.listenToTrack.bind(this);
    this.download = this.download.bind(this);

    this.state = {
      downloaded: false
    }
  }

  componentWillMount () {
    const id = this.props.match.params.id;
    const IDB_KEY = `album-${id}`;

    // // 1. Try to retrieve album infos
    // // from the cache
    // get(IDB_KEY).then(response => {
    //   if (response) {
    //     this.props.setPrimaryColor(response.primaryColor);
    //     this.setState({...response});
    //     return;
    //   }

    //   // 2. If not in the cache, fetch it, store in the cache.
    //   return this.fetchAlbumAndStoreInTheCache(id, IDB_KEY)
    // }).catch(err => console.error(err));
    Promise.all([
      this.fetchAlbumAndStoreInTheCache(id, IDB_KEY),
      // check if album is downloaded
      get(id)
    ]).then(([_, album]) => {
      this.setState({downloaded: album && album.downloaded});
    });
  }

  fetchAlbumAndStoreInTheCache (id, idbKey) {
    return fetch(`${Constants.API_URL}/album/${id}`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      }
    })
    .then(response => response.json())
    .then(response => {
      // TODO: refactoring.
      this.props.setPrimaryColor(response.primaryColor);
      this.setState({...response});
      return response;
    })
    .then(response => set(idbKey, response));
  }

  download (evt) {
    console.log('connection type:', navigator.connection.type);
    // if user is on mobile, on mobile network
    // and do not want to download on mobile network
    if (Constants.SUPPORT_NETWORK_INFORMATION_API) {
      if (navigator.connection.type
        && navigator.connection.type === 'cellular'
        && !this.props.downloadWithMobileNetwork
      ) {
        this.props.toasting(['Vous êtes sur un réseau mobile', 'Autorisez le téchargement sur ce type de réseau et réessayez']);
        return;
      }
    }

    if (!Constants.SUPPORT_BACKGROUND_SYNC) {
      this.props.toasting(['Votre navigateur ne supporte pas le téléchargement de musiques...']);
      return;
    }

    const id = this.props.match.params.id;
    const checked = evt.target.checked;

    if (checked) {
      // prevent multiples downloads of the same album to happen at the same time.
      if (this.isDownloading) {
        return;
      }

      this.isDownloading = true

      if (Constants.SUPPORT_BACKGROUND_FETCH) {
        // download the album in background
        downloadTracklistInBackground({tracklist: this.state.tracks, cover: this.state.coverURL, id})
          .catch(err => console.error(err));
      } else {
        // download the album in foreground
        downloadTracklist({tracklist: this.state.tracks, album: this.state.title,
          cover: this.state.coverURL, id: this.props.match.params.id}).then(_ => {
          // put in cache that we have downloaded the album
          // so we can update the UI (e.g. show downloaded toggle at app launch)
          set(id, {downloaded: true}).then(_ => {
            this.setState({downloaded: true});
            this.isDownloading = false;
          });
        }).catch(err => console.error(err));
      }
      return;
    }

    removeTracklistFromCache(this.state.tracks, this.props.match.params.id);
  }

  handleTrackClick () {
    //const {artist, coverURL, track} = this.props;
    //this.listenToTrack()
  }

  listenToTrack (artist, title, coverURL, track) {
    console.log(title, track.title);
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

    this.props.listen(manifestURL, playlistHLSURL, {artist, album: title, title: track.title, coverURL})
      //.then(_ => this.props.crossFade());
  }

  render ({downloads}, {artist, coverURL, genre, primaryColor, title, tracks, year, downloaded}) {
    if (tracks === undefined) return null;
    return (
      <Container>
        <TopBarBack />
        <Infos>
          <Title>{title}</Title>
          <Artist>{artist}</Artist>
          <Download>
            {
              downloads[this.props.match.params.id] ?
              <ProgressLine
                progress={(downloads[this.props.match.params.id])}
                value={Math.round((downloads[this.props.match.params.id]) * 100) + '%'}
              /> : ''
            }
            <SwitchContainer>
              <Switch label="Télécharger" onChange={this.download} value={downloaded} />
            </SwitchContainer>
          </Download>
        </Infos>
        <Tracks>
          {tracks.map(track => (
            <Track
              number={track.number} title={track.title} artist={artist} coverURL={coverURL} duration={track.duration} track={track}
              onClick={_ => this.listenToTrack(artist, title, coverURL, track)} />
          ))}
        </Tracks>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Album);
