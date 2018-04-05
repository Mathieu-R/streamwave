import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Constants from '../constants';
import Cover from '../components/cover';
import TopBarHamburger from '../components/topbar-hamburger';

import {
  storeLibrary
} from '../store/library';

const Gallery = styled.section`
  width: 100%;
  flex-grow: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  grid-gap: 20px;
`;

const mapStateToProps = state => ({
  library: state.library
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

  componentDidMount () {
    fetch(`${Constants.API_URL}/library`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      }
    })
    .then(response => response.json())
    .then(response => this.props.storeLibrary(response))
    .then(_ => this.lazyLoadArtworks())
    .catch(err => console.error(err));
  }

  lazyLoadArtworks () {
    // 1. select all images to lazy-load
    const artworks = Array.from(this.gallery.querySelectorAll('.cover__artwork'));

    // 2. detect IO feature
    if (Constants.SUPPORT_INTERSECTION_OBSERVER) {
      const config = {
        rootMargin: '50px 0px',
        treshold: 0.01
      };

      // 3. create a new observer
      this.observer = new IntersectionObserver(this.onIntersection, config);
      //console.log(this.observer);

      // 4. observe
      artworks.forEach(artwork => this.observer.observe(artwork));
    } else {
      artworks.forEach(artwork => this.preloadImage(artwork));
    }
  }

  onIntersection (entries) {
    //console.log(entries);
    // Loop all entries
    entries.forEach(entry => {
      // If we are in viewport
      if (entry.intersectionRatio > 0) {
        //console.log(entry)
        // stop observe and load image
        this.observer.unobserve(entry.target);
        this.preloadImage(entry.target);
      }
    });
  }

  preloadImage (target) {
    const src = target.dataset.src;
    target.src = src;
  }

  render ({library}, {}) {
    return (
      <div>
        <TopBarHamburger />
        <Gallery innerRef={gallery => this.gallery = gallery} >
          {library && library.map(album => (
            <Cover {...album} />
          ))}
        </Gallery>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Library);
