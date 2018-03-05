// types
const SET_ARTIST = 'SET_ARTIST';
const SET_COVER_URL = 'SET_COVER_URL';
const SET_TRACK = 'SET_TRACK';
const SWITCH_PLAYING_STATUS = 'SWITCH_PLAYING_STATUS';
const SET_CHROMECAST_STATUS = 'SET_CHROMECAST_STATUS';
const SET_CURRENT_TIME = 'SET_CURRENT_TIME';

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

export function switchPlayingStatus () {
  return {
    type: SWITCH_PLAYING_STATUS
  }
}

export function setChromecastStatus (status) {
  return {
    type: SET_CHROMECAST_STATUS,
    status
  }
}

export function setCurrentTime (time) {
  return {
    type: SET_CURRENT_TIME,
    time
  }
}

// selectors
export const getCoverURL = state => state.player.coverURL;
export const getArtist = state => state.player.artist;
export const getTrack = state => state.player.track;
export const isMusicPlaying = state => state.player.playing;
export const isMusicChromecasting = state => state.player.chromecasting;
export const getDuration = state => getTrack(state) && getTrack(state).duration;
export const getCurrentTime = state => state.player.currentTime;


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
      return {
        ...state,
        playing: true,
        artist: action.artist,
        coverURL: action.coverURL,
        track: action.track
      }

    case SWITCH_PLAYING_STATUS:
      return {
        ...state,
        playing: !state.playing
      }

    case SET_CHROMECAST_STATUS:
      return {
        ...state,
        chromecasting: action.status
      }

    case SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.time
      }

    default:
      return state;
  }
}
