import { Component } from 'preact';
import { Link } from 'react-router-dom';
import Constants from '../constants';
import Cover from '../components/cover';
import TopBarHamburger from '../components/topbar-hamburger';
import Navbar from '../components/navbar';

class Library extends Component {
  constructor () {
    super();
    this.state = {
      albums: []
    }
  }

  componentDidMount () {
    fetch(`${Constants.API_URL}/`, {
      headers: {
        'authorization': `Bearer ${localStorage.getItem('streamwave-token')}`
      }
    })
    .then(response => response.json())
    .then(response => this.setState(response))
    .catch(err => console.error(err));
  }

  render ({}, {albums}) {
    return (
      <div class="library">
        <TopBarHamburger />
        <section class="library__gallery">
          {albums.map(album => (
            <Cover {...album} />
          ))}
        </section>
        <Navbar />
      </div>
    );
  }
}

export default Library;
