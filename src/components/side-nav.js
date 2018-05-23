import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
  getUser
} from '../store/user';

import {
  getShowSideNav,
  hideSideNav
} from '../store/side-nav';

const mapStateToProps = state => ({
  showSideNav: getShowSideNav(state),
  user: getUser(state)
});

const mapDispatchToProps = dispatch => ({
  hideSideNav: _ => dispatch(hideSideNav())
});

class SideNav extends Component {
  shouldComponentUpdate (nextProps) {
    if (nextProps.user !== this.props.user) {
      return true;
    }
    return false;
  }

  componentWillReceiveProps (props) {
    if (props.showSideNav) {
      this.overlay.classList.add('overlay--visible');
      this.container.classList.add('side-nav--visible');
      return;
    }

    this.overlay.classList.remove('overlay--visible');
    this.container.classList.remove('side-nav--visible');
  }

  render ({hideSideNav, user}) {
    return (
      <div class="overlay" ref={overlay => this.overlay = overlay}>
        <aside class="side-nav" ref={container => this.container = container}>
          <div class="side-nav__hamburger-container">
            <button class="side-nav__hamburger" onClick={hideSideNav} aria-label="hide sidenav"></button>
          </div>
          <div class="side-nav__user">
            <img class="side-nav__avatar" src={user.avatar} alt="avatar" />
            <div class="side-nav__infos">
              <p class="side-nav__username">{user.username}</p>
              <p class="side-nav__mail">{user.email ? user.email : ''}</p>
            </div>
          </div>
          <ul class="side-nav__menu">
            <li class="side-nav__element"><Link class="side-nav__link" to="/" onClick={hideSideNav} aria-label="home">Home</Link></li>
            <li class="side-nav__element"><Link class="side-nav__link" to="/about" onClick={hideSideNav} aria-label="about">A propos</Link></li>
            <li class="side-nav__element"><Link class="side-nav__link" to="/licences" onClick={hideSideNav} aria-label="licences">Licenses musicales</Link></li>
            <li class="side-nav__element"><Link class="side-nav__link" to="/demo" onClick={hideSideNav} aria-label="demo streaming">Demo</Link></li>
          </ul>
        </aside>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideNav);
