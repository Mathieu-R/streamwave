import { h } from 'preact';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TopBarContainer, TopBarButton, TopBarTitle } from './ui';

import hamburger from '../assets/svg/hamburger.svg';

import {
  showSideNav
} from '../store/side-nav';

const mapDispatchToProps = dispatch => ({
  showSideNav: _ => dispatch(showSideNav())
});

const TopBarHamburger = ({showSideNav}) => (
  <TopBarContainer>
    <TopBarButton role="button" src={hamburger} onClick={showSideNav} alt="hamburger open menu" />
    <TopBarTitle>
      Streamwave
    </TopBarTitle>
  </TopBarContainer>
);


export default connect(null, mapDispatchToProps)(TopBarHamburger);
