// types
const SET_ARTIST = 'SET_ARTIST';
const SET_COVER_URL = 'SET_COVER_URL';
const SET_TRACK = 'SET_TRACK';
const SET_PLAYING_STATUS = 'SET_PLAYING_STATUS';
const SET_CHROMECAST_STATUS = 'SET_CHROMECAST_STATUS';

// actions
export function setArtist (artist) {
  return {
    type: SET_ARTIST,
    artist
  }
}

export function setCoverURL (cover) {
  return {
    type: SET_COVER_URL,
    cover
  }
}

export function setTrack ({artist, coverURL, track}) {
  return {
    type: SET_TRACK,
    artist,
    coverURL,
    track
  }
}

export function setPlayingStatus (status) {
  return {
    type: SET_PLAYING_STATUS,
    status
  }
}

export function setChromecastStatus (status) {
  return {
    type: SET_CHROMECAST_STATUS,
    status
  }
}

// selectors
export const getCoverURL = state => state.player.coverURL;
export const getArtist = state => state.player.artist;
export const getTrack = state => state.player.track;
export const isMusicPlaying = state => state.player.playing;
export const isMusicChromecasting = state => state.player.chromecasting;


// reducers
export default (state = {}, action) => {
  const { type } = action;
  switch (type) {
    case SET_ARTIST:
      return {
        ...state,
        artist: action.artist
      }

    case SET_COVER_URL:
      return {
        ...state,
        coverURL: action.cover
      }

    case SET_TRACK:
      console.log(action);
      return {
        ...state,
        playing: true,
        artist: action.artist,
        coverURL: action.coverURL,
        track: action.track
      }

    case SET_PLAYING_STATUS:
      return {
        ...state,
        playing: action.status
      }

    case SET_CHROMECAST_STATUS:
      return {
        ...state,
        chromecasting: action.status
      }

    default:
      return state;
  }
}
