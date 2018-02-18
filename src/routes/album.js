import { Component } from 'preact';
import { connect } from 'react-redux';
import Constants from '../constants';
import Track from '../components/track';

const mapStateToProps = state => ({
  library: state.library
});

class Album extends Component {
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

  render ({}, {artist, coverURL, genre, primaryColor, title, tracks, year}) {
    return (
      <div class="album">
        <div class="album__info-block">
          <h1 class="album__title">{title}</h1>
          <h2 class="album__artist">{artist}</h2>
          <div class="album__download-container">
            <div class="album__download-container__progress"></div>
            <div class="album__download-container__toggle">
              <input type="checkbox" class="album__download-container__toggle-checkbox" id="toggle-download" />
              <label class="album__download-container__toggle-label" for="toggle-download">Télécharger</label>
            </div>
          </div>
        </div>
        <div className="album-tracks">
          {tracks && tracks.map(track => (
            <Track {...track} />
          ))}
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Album);
