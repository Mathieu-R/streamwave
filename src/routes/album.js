import { Component } from 'preact';
import { connect } from 'unistore/preact';
import Track from '../components/track';

@connect(['library'])
class Album extends Component {
  componentDidMount () {
    const id = this.props.match.params.id;
    const album = this.props.library.find(album => album._id === id);
    console.log(album);
    this.setState({...album});
  }

  render ({}, {artist, coverURL, genre, primaryColor, title, tracks, year}) {
    console.log(this.state, tracks);
    return (
      <div className="album">
        <div className="album__info-block">
          <h1 className="album__title">{title}</h1>
          <h2 className="album__artist">{artist}</h2>
          <div className="album__download-container">
            <div class="album__download-container__progress"></div>
            <div className="album__download-container__toggle">
              <input type="checkbox" className="album__download-container__toggle-checkbox" />
              <div className="album__download-container__toggle-label"></div>
            </div>
          </div>
        </div>
        {tracks.map(track => (
          <Track {...track} />
        ))}
      </div>
    );
  }
}

export default Album;
