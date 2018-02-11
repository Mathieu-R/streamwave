import { Component } from 'preact';
import { Link } from 'react-router-dom';
import Constants from '../constants';
import Cover from '../components/cover';

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
      .then(response => this.setState(response));
  }

  render ({}, {albums}) {
    return (
      <div class="library">
      {albums.map(album => (
        <Cover {...album} />
      ))}
      </div>
    );
  }
}

export default Library;
