import { h, Component } from 'preact';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import pure from 'recompose/pure';
import { TopBarContainer, TopBarButton, TopBarTitle } from './ui';

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

  // componentDidUpdate () {
  //   console.log('lolololol');
  // }

  render ({showSideNav}) {
    return (
      <TopBarContainer>
        <TopBarButton role="button" src={hamburger} onClick={showSideNav} alt="hamburger open menu" />
        <TopBarTitle>
          Streamwave
        </TopBarTitle>
      </TopBarContainer>
    );
  }
}

export default connect(null, mapDispatchToProps)(TopBarHamburger);
