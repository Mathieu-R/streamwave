import store from '../store';
import Constants from '../constants';

import {
  setChromecastStatus,
  setChromecastAvailable
} from '../store/player';

class Chromecaster {
  constructor () {
    this.cast = this.cast.bind(this);

    window.__onGCastApiAvailable = (available) => {
      if (available) {
        this.init();
      }
    }
  }

  get CONTENT_TYPE () {
    return 'application/dash+xml';
  }

  init () {
    const options = {
      receiverApplicationId: Constants.PRESENTATION_ID,
      autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
    }

    cast.framework.CastContext.getInstance().setOptions(options);

    this.remote = new cast.framework.RemotePlayer();
    this.controller = new cast.framework.RemotePlayerController(this.remote);

    console.log(cast.framework.CastContext.getInstance().getCurrentSession());
  }

  cast (manifest) {
    const castSession = cast.framework.CastContext.getInstance().getCurrentSession();
    const mediaInfo = this.setMediaInfo(manifest);
    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    console.log(castSession);

    castSession.loadMedia(request)
      .then(() => {
        console.log('[Google Cast] Loaded.');
        this.controller.playOrPause();
      })
      .catch(err => console.error(err));
  }

  setMediaInfo (manifest) {
    const state = store.getState();
    const data = {
      artist: state.player.artist,
      album: state.player.album,
      year: state.player.year,
      track: state.player.track,
      currentTime: state.player.currentTime,
      playing: state.player.playing,
      primaryColor: state.player.primaryColor
    };

    const mediaInfo = new chrome.cast.media.MediaInfo(manifest, Chromecaster.CONTENT_TYPE);

    mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata();
    mediaInfo.metadata.metadataType = chrome.cast.media.MetadataType.GENERIC;
    mediaInfo.metadata.albumArtist = data.artist;
    mediaInfo.metadata.artist = data.artist;
    mediaInfo.metadata.albumName = data.album;
    mediaInfo.metadata.releaseYear = data.year;
    mediaInfo.metadata.title = data.track.title;
    mediaInfo.metadata.trackNumber = data.track.number;
    mediaInfo.metadata.images = [
      {'url': `${Constants.CDN_URL}/${data.track.coverURL}`}
    ];

    return mediaInfo;
  }

  pause () {
    this.controller.playOrPause();
  }

  seek (time) {
    this.remote.currentTime = time;
    this.controller.seek();
  }

  setVolume (volume) {
    this.remote.volumeLevel = volume;
    this.controller.setVolumeLevel();
  }

  stop () {
    this.controller.stop();
  }
}

export default Chromecaster;
