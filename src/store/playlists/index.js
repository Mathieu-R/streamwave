const CREATE_PLAYLIST = 'CREATE_PLAYLIST';

export function createPlaylist ({title}) {
  return new Promise((resolve, reject) => {
    return async dispatch => {
      const response = await fetch('/playlist', {
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
        reject('Titre de la playlist manquant...');
      }

      const data = await response.json();
      return {
        type: CREATE_PLAYLIST,
        playlist: data
      }
    }
  });
}

export default (state = {}, action) => {
  const {type} = action;
  switch (type) {
    case CREATE_PLAYLIST:
      return {
        ...state.playlists,
        [action.playlist._id]: {
          title: action.playlist.title,
          tracks: action.playlist.tracks
        }
      }

    default:
      return state;
  }
}
