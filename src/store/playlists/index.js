import Constants from '../../constants';

// types
const FETCH_PLAYLISTS = 'FETCH_PLAYLISTS';
const CREATE_PLAYLIST = 'CREATE_PLAYLIST';
const ADD_TRACK_TO_PLAYLIST = 'ADD_TRACK_TO_PLAYLIST';

// actions
export function createPlaylist ({title}) {
  return dispatch => {
    return new Promise(async (resolve, reject) => {
      const response = await fetch(`${Constants.API_URL}/playlist`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
        },
        body: JSON.stringify({
          title
        })
      });

      if (response.status === 422) {
        reject(['Titre de la playlist manquant...']);
      }

      const data = await response.json();

      dispatch({
        type: CREATE_PLAYLIST,
        playlist: data
      });
    });
  }
}

export function fetchPlaylists () {
  return dispatch => {
    fetch(`${Constants.API_URL}/playlists`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      }
    })
    .then(response => response.json())
    .then(response => {
      dispatch({
        type: FETCH_PLAYLISTS,
        playlists: response
      });
    })
    .catch(err => console.error(err));
  }
}

export function addTrackToPlaylist ({playlistId, track}) {
  return dispatch => {
    return new Promise((resolve, reject) => {
      return fetch(`${Constants.API_URL}/playlist/${playlistId}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
        },
        body: JSON.stringify(track)
      })
      .then(response => response.json())
      .then(response => {
        if (!response) {
          reject();
        }
        resolve();
      });
    })

  }
}

// selectors
export const getPlaylists = state => state.playlists;

// reducers
export default (state = [], action) => {
  const {type} = action;
  switch (type) {
    case FETCH_PLAYLISTS:
      return [
        ...action.playlists
      ]

    case CREATE_PLAYLIST:
      return [
        ...state,
        action.playlist
      ]

    default:
      return state;
  }
}
