import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import debounce from 'debounce';
import styled from 'styled-components';
import { Loader } from '../components/loading';
import { fade } from '../components/ui';
import Constants from '../constants';
import { formatDuration } from '../utils';

import {
  setTrack,
  setQueue
} from '../store/player';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
`;

const SearchBarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 5px;
`;

const SearchBar = styled.input`
  outline: none;
  height: 40px;
  width: 100%;
  padding: 5px 10px;
  border-radius: 5px;
  border: none;
  background: #2D3535;
  color: #FFF;
  font-size: 16px;
  transform: scale(0.97);
  transition: transform .2s ease-out;
  will-change: transform;
`;

const Center = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  font-size: 22px;
`;

const SearchResults = styled.section`
  width: 100%;
  height: 100%;
  margin-top: 50px;
  margin-bottom: 100px;
`;

const AlbumsHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFF;
  height: 40px;
  color: #000;
`;

const TracksHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: #FFF;
  height: 40px;
  color: #000;
`;

const Cover = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const Infos = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  color: #FFF;
`;

const Artist = styled.div`

`;

const Album = styled.div``;

const AlbumResults = styled(Link)`
  display: grid;
  grid-template-columns: 50px 1fr;
  grid-auto-flow: column;
  height: 50px;
  font-weight: 400;
  grid-gap: 20px;
  margin: 8px 0;
  padding: 0 20px;
  animation: ${fade} linear .3s;
`;

const TrackResult = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 50px;
  font-weight: 400;
  background: none;
  border: none;
  font-size: 15px;
  padding: 0 20px;
  animation: ${fade} linear .3s;
`;

const TrackTitle = styled.div`
  font-size: 16px;
  margin-bottom: 3px;
`;

const TrackInline = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 13px;
  color: #c3c3c3;
`;

const TrackArtist = styled.div`
  margin-right: 7px;
`;

const TrackAlbum = styled.div`
  margin: 0 7px;
`;

const Duration = styled.div`

`;

const Artwork = styled.div``;

const mapDispatchToProps = dispatch => ({
  setTrack: (music) => dispatch(setTrack(music)),
  setQueue: (queue) => dispatch(setQueue(queue)),
});

class Search extends Component {
  constructor () {
    super();

    this.onOpenSearchBar = this.onOpenSearchBar.bind(this);
    this.onCloseSearchBar = this.onCloseSearchBar.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.search = this.search.bind(this);

    this.state = {
      loading: false,
      albums: [],
      tracks: []
    };
  }

  onOpenSearchBar () {
    this.searchBar.style.transform = `scale(1)`;
  }

  onCloseSearchBar () {
    this.searchBar.style.transform = 'scale(0.97)';
  }

  onInputChange (evt) {
    const term = evt.target.value;
    if (term === '') return;
    // avoid doing too much api calls
    const search = debounce(_ => this.search(term), 150);
    search();
  }

  search (term) {
    // show a spinner if loading is too long
    const timeout = setTimeout(_ => this.setState({loading: true}), 500);

    fetch(`${Constants.API_URL}/search/${term}`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      }
    }).then(response => response.json())
      .then(({results: {albums, tracks}}) => {
        return this.setState({albums, tracks});
      })
      .then(_ => {
        clearTimeout(timeout);
        if (this.state.loading) {
          this.setState({
            loading: false
          });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  listen (track) {
    const {tracks} = this.state;
    const {artist, album, coverURL, manifestURL, playlistHLSURL} = track;

    const index = tracks.findIndex(t => t.title === track.title);
    this.props.setQueue(tracks);

    this.props.setTrack({
      artist,
      album,
      coverURL,
      track,
      index: 0
    });

    this.props.listen(manifestURL, playlistHLSURL, {artist, album, title: track.title, coverURL});
  }

  renderResults (albums, tracks) {
    return (
      <div>
        {albums.length > 0 && <AlbumsHeader>Albums</AlbumsHeader>}
        {this.renderAlbums(albums)}
        {tracks.length > 0 && <TracksHeader>Pistes</TracksHeader>}
        {this.renderTracks(tracks)}
      </div>
    )
  }

  renderAlbums (albums) {
    return (
      albums.map(album => (
        <AlbumResults key={album._id} to={`/album/${album._id}`}>
          <Cover src={`${Constants.CDN_URL}/${album.coverURL}`}></Cover>
          <Infos>
            <Artist>{album.artist}</Artist>
            <Album>{album.title}</Album>
          </Infos>
        </AlbumResults>
      ))
    );
  }

  renderTracks (tracks) {
    // TODO: remove arrow function for binded stuff
    return (
      tracks.map(track => (
        <TrackResult onClick={() => this.listen(track)}>
          <Infos>
            <TrackTitle>{track.title}</TrackTitle>
            <TrackInline><TrackArtist>{track.artist}</TrackArtist>•<TrackAlbum>{track.album}</TrackAlbum></TrackInline>
          </Infos>
          <Duration>
            {formatDuration(track.duration)}
          </Duration>
        </TrackResult>
      ))
    )
  }

  render ({}, {loading, albums, tracks}) {
    return (
      <Container>
        <SearchBarContainer>
          <SearchBar
            type="text"
            placeholder="Rechercher"
            innerRef={searchBar => this.searchBar = searchBar}
            onInput={this.onInputChange}
            onClick={this.onOpenSearchBar}
            onBlur={this.onCloseSearchBar}
          />
        </SearchBarContainer>
        <SearchResults>
          {
            loading ?
            <Center><Loader color='#FFF' /></Center>
            :
            this.renderResults(albums, tracks)
          }
        </SearchResults>
      </Container>
    );
  }
}

export default connect(null, mapDispatchToProps)(Search);
