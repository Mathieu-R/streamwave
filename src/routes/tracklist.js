import { h, Component } from 'preact';
import { connect } from 'react-redux';
import { get, set } from 'idb-keyval';
import Constants from '../constants';
import Track from '../components/track';
import Switch from '../components/switch';
import TopBarBack from '../components/topbar-back';
import ProgressLine from '../components/progress-line';
import { shuffle } from '../utils';
import { simpleDownloadTracklist, downloadTracklist, downloadTracklistInBackground, removeTracklistFromCache } from '../utils/download';
import styled, { keyframes } from 'styled-components';

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

const fade = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div``;

const Infos = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 150px;
`;

const InfosWrapper = styled.div`
  display: flex;
  width: 100%;
`;

const Details = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: flex-start;
  flex-grow: 1;
  margin: 15px;
  animation: ${fade} linear .4s;
`;

const Cover = styled.img`
  max-height: 100px;
  object-fit: contain;
  animation: ${fade} linear .6s;
`;

const Title = styled.h1`
  font-size: 22px;
  font-weight: bold;
  margin: 5px 0;

  @media(max-width: ${props => props.theme.mobile}) {
    font-size: 18px;
  }
`;

const Artist = styled.h2`
  font-size: 14px;
  color: #D4D4D4;
  margin: 0;

  @media(max-width: ${props => props.theme.mobile}) {
    font-size: 12px;
  }
`;

const Line = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;

  @media(max-width: ${props => props.theme.mobile}) {
    font-size: 10px;
  }
`;

const Year = styled.span`
  margin: 5px 5px 5px 0;
`;

const TracksCount = styled.span`
  margin: 5px;
`;

const Genre = styled.span`
  margin: 5px;
`;

const Download = styled.div`
  position: relative;
  margin-right: 5px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 35px;
  width: 100%;
`;

const SwitchContainer = styled.div``;

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

class TrackList extends Component {
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

    Promise.all([
      this.fetchTracklist(id),
      // check if album is downloaded
      get(id)
    ]).then(([_, tracklist]) => {
      this.setState({downloaded: tracklist && tracklist.downloaded});
    });
  }

  fetchTracklist (id) {
    return fetch(`${Constants.API_URL}/${this.props.type}/${id}`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      }
    })
    .then(response => response.json())
    .then(response => {
      this.props.setPrimaryColor(response.primaryColor);
      this.setState({...response});
      return response;
    });
  }

  download (evt) {
    const id = this.props.match.params.id;
    const checked = evt.target.checked;

    console.log('connection type:', navigator.connection && navigator.connection.type);
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

    // browser has to support at least service-worker and http streaming
    if (!Constants.SUPPORT_CACHE_API) {
      this.props.toasting(['Votre navigateur ne supporte pas le téléchargement de musiques...']);
      return;
    }

    if (!checked) {
      removeTracklistFromCache(this.state.tracks, id);
      return;
    }

    const options = {
      tracklist: this.state.tracks,
      album: this.state.title,
      cover: this.state.coverURL,
      id,
      type: this.props.type
    };

    // prevent multiples downloads of the same album
    // to happen at the same time.
    if (this.isDownloading) {
      return;
    }

    let promise;
    this.isDownloading = true

    // TODO: support simple caching without bg-sync
    if (Constants.SUPPORT_BACKGROUND_FETCH) {
      // download the album in background
      promise = downloadTracklistInBackground(options);
    } else if (Constants.SUPPORT_BACKGROUND_SYNC) {
      // download the album in foreground
      promise = downloadTracklist(options);
    } else {
      promise = simpleDownloadTracklist(options);
    }

    promise.then(_ => {
      // put in cache that we have downloaded the album
      // so we can update the UI (e.g. show downloaded toggle at app launch)
      return set(id, {downloaded: true});
    }).then(_ => {
      this.setState({downloaded: true});
      this.isDownloading = false;
    }).catch(err => {
      console.error(err);
    });
  }

  handleTrackClick (track) {
    // title = title of album or playlist
    const {artist, title, coverURL} = this.state;
    this.listenToTrack(artist, title, coverURL, track)
  }

  listenToTrack (artist, album, coverURL, track) {
    const {tracks} = this.state;
    const {manifestURL, playlistHLSURL} = track;

    const index = tracks.findIndex(t => t.title === track.title);
    const queue = this.props.shuffle ? shuffle(tracks) : tracks;

    this.props.setQueue(queue);
    this.props.setTrack({
      artist,
      album,
      coverURL,
      track,
      index
    });

    this.props.listen(manifestURL, playlistHLSURL, {artist, album, title: track.title, coverURL});
  }

  render ({downloads}, {artist, coverURL, genre, primaryColor, title, tracks, year, downloaded}) {
    if (tracks === undefined) return null;
    return (
      <Container>
        <TopBarBack url='/' />
        <Infos>
          <InfosWrapper>
            {coverURL && <Cover alt="cover" src={`${Constants.CDN_URL}/${coverURL}`} />}
            <Details>
              <Title>{title}</Title>
              <Artist>{artist}</Artist>
              <Line>
                <Year>{year ? year : 'année de parution inconnue'}</Year>
                •
                <TracksCount>{tracks.length} titres</TracksCount>
                •
                <Genre>{genre ? genre : 'playlist'}</Genre>
              </Line>
            </Details>
          </InfosWrapper>
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
              number={track.number} title={track.title} duration={track.duration} track={track}
              handleTrackClick={this.handleTrackClick}
            />
          ))}
        </Tracks>
      </Container>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackList);
