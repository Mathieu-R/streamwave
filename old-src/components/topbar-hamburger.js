import { h, Component } from 'preact';
import { connect } from 'react-redux';

import hamburger from '../assets/svg/hamburger.svg';

import {
  showSideNav
} from '../store/side-nav';

const mapDispatchToProps = dispatch => ({
  showSideNav: _ => dispatch(showSideNav())
});

class TopBarHamburger extends Component {
  shouldComponentUpdate (nextProps) {
    return false;
  }

  render ({showSideNav}) {
    return (
      <div class="top-bar">
        <img class="top-bar__button" role="button" src={hamburger} onClick={showSideNav} alt="hamburger open menu" />
        <div class="top-bar__title">
          Streamwave
        </div>
      </div>
    );
  }
}

export default connect(null, mapDispatchToProps)(TopBarHamburger);
