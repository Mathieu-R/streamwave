import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { get, set } from 'idb-keyval';
import styled from 'styled-components';
import Constants from '../constants';
import Cover from '../components/cover';
import TopBarHamburger from '../components/topbar-hamburger';

import {
  storeLibrary,
  getLibrary
} from '../store/library';

const Gallery = styled.section`
  width: 100%;
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 20px;
  padding: 0 2%;
`;

const mapStateToProps = state => ({
  library: getLibrary(state)
});

const mapDispatchToProps = dispatch => ({
  storeLibrary: albums => dispatch(storeLibrary(albums))
});

class Library extends Component {
  constructor () {
    super();
    this.onIntersection = this.onIntersection.bind(this);

    this.observer = null;
    this.state = {
      albums: []
    }
  }

  componentWillMount () {
    this.fetchGallery()
      .then(response => this.props.storeLibrary(response))
      .then(_ => this.lazyLoadArtworks())
      .catch(err => console.error(err));
  }

  componentWillUnmount () {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  getGalleryFromCache () {
    return get('library');
  }

  fetchGallery () {
    return fetch(`${Constants.API_URL}/library`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      }
    })
    .then(response => response.json())
  }

  lazyLoadArtworks () {
    // 1. select all images to lazy-load
    const artworks = Array.from(this.gallery.querySelectorAll('.cover__artwork'));

    // 2. detect IO feature
    if (Constants.SUPPORT_INTERSECTION_OBSERVER) {
      const config = {
        rootMargin: '150px 0px',
        treshold: 0.01
      };

      // 3. create a new observer
      this.observer = new IntersectionObserver(this.onIntersection);

      // 4. observe
      artworks.forEach(artwork => this.observer.observe(artwork));
    } else {
      artworks.forEach(artwork => this.preloadImage(artwork));
    }
  }

  onIntersection (entries) {
    // Loop all entries
    entries.forEach(entry => {
      // If we are in viewport
      if (entry.isIntersecting) {
        // stop observe and load image
        this.observer.unobserve(entry.target);
        this.preloadImage(entry.target);
      }
    });
  }

  preloadImage (target) {
    const src = target.dataset.src;
    target.src = src;
    target.classList.remove('lazy');
  }

  render ({library}) {
    return (
      <div>
        <TopBarHamburger />
        <Gallery innerRef={gallery => this.gallery = gallery}>
          {library.map(({artist, title, coverURL, primaryColor, _id}) => (
            <Cover
              key={_id}
              artist={artist}
              title={title}
              coverURL={coverURL}
              primaryColor={primaryColor}
              id={_id}
            />
          ))}
        </Gallery>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Library);
