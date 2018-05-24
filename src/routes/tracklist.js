import { h, Component } from 'preact';
import { connect } from 'react-redux';
import { get, set } from 'idb-keyval';
import Track from '../components/track';
import Switch from '../components/switch';
import ProgressLine from '../components/progress-line';
import { shuffle } from '../utils';
import {
  simpleDownloadTracklist,
  downloadTracklist,
  downloadTracklistInBackground,
  removeTracklistFromCache
} from '../utils/download';
import Constants from '../constants';

import {
  setTrack,
  setQueue,
  setPrimaryColor,
  isShuffle,
  getDownloads,
  getTrackId
} from '../store/player';

import {
  toasting
} from '../store/toast';

import {
  getDownloadWithMobileNetwork
} from '../store/settings';

const mapStateToProps = state => ({
  shuffle: isShuffle(state),
  downloads: getDownloads(state),
  downloadWithMobileNetwork: getDownloadWithMobileNetwork(state),
  currentTrackId: getTrackId(state)
});

const mapDispatchToProps = dispatch => ({
  toasting: (messages, buttons, duration) => dispatch(toasting(messages, buttons, duration)),
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
    const {type} = this.props;

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

    // browser has to support at least service-worker
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
      type
    };

    // prevent multiples downloads of the same album
    // to happen at the same time.
    if (this.isDownloading) {
      return;
    }

    let promise;
    this.isDownloading = true

    if (Constants.SUPPORT_BACKGROUND_FETCH) {
      // download the album in background
      promise = downloadTracklistInBackground(options);
    } else if (Constants.SUPPORT_BACKGROUND_SYNC) {
      // download the album with retry if offline
      promise = downloadTracklist(options);
    } else {
      // simple download (requires connectivity)
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

    this.props.listen(manifestURL, playlistHLSURL, {artist, album, title: track.title, coverURL}, true);
  }

  render ({downloads, currentTrackId}, {artist, coverURL, genre, primaryColor, title, tracks, year, downloaded}) {
    if (tracks === undefined) return null;
    return (
      <div class="tracklist">
        <section class="tracklist__infos">
          <div class="tracklist__infos-wrapper">
            {coverURL && <img class="tracklist__cover" alt="cover" src={`${Constants.CDN_URL}/${coverURL}`} />}
            <div class="tracklist__details">
              <div class="tracklist__title">{title}</div>
              <div class="tracklist__artist">{artist}</div>
              <div class="tracklist__line">
                <span class="tracklist__year">{year ? year : 'année de parution inconnue'}</span>
                •
                <span class="tracklist__tracks-counter">{tracks.length} titres</span>
                •
                <span class="tracklist__genre">{genre ? genre : 'playlist'}</span>
              </div>
            </div>
          </div>
          <div class="tracklist__download">
            {
              downloads[this.props.match.params.id] ?
              <ProgressLine
                progress={(downloads[this.props.match.params.id])}
                value={Math.round((downloads[this.props.match.params.id]) * 100) + '%'}
              /> : ''
            }
            <div class="tracklist__toggle-container">
              <Switch label="Télécharger" onChange={this.download} value={downloaded} />
            </div>
          </div>
        </section>
        <section class="tracklist__tracks">
          {tracks.map(track => (
            <Track
              key={track._id} id={track._id} currentTrackId={currentTrackId}
              number={track.number} title={track.title} duration={track.duration}
              track={track} handleTrackClick={this.handleTrackClick}
            />
          ))}
        </section>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TrackList);
