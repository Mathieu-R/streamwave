import { Component } from 'preact';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  constructor () {
    super();
  }

  render () {
    return (
      <div class="navbar">
        <div class="navbar__library-button">
          <div class="navbar__library-button__icon"></div>
          <div class="navbar__library-button__title">
            Bibliothèque
          </div>
        </div>
        <div class="navbar__library-button">
          <div class="navbar__library-button__icon"></div>
          <div class="navbar__library-button__title">
            Playlists
          </div>
        </div>
        <div class="navbar__library-button">
          <div class="navbar__library-button__icon"></div>
          <div class="navbar__library-button__title">
            En écoute
          </div>
        </div>
        <div class="navbar__library-button">
          <div class="navbar__library-button__icon"></div>
          <div class="navbar__library-button__title">
            Rechercher
          </div>
        </div>
        <div class="navbar__library-button">
          <div class="navbar__library-button__icon"></div>
          <div class="navbar__library-button__title">
            Paramètres
          </div>
        </div>
      </div>
    )
  }
}

export default Navbar;
