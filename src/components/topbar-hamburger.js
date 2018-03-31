import { Component } from 'preact';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { TopBarContainer, TopBarButton, TopBarTitle } from './ui';

import {
  showSideNav
} from '../store/side-nav';

const mapDispatchToProps = dispatch => ({
  showSideNav: _ => dispatch(showSideNav())
});

const TopBarHamburger = ({showSideNav}) => (
  <TopBarContainer>
    <TopBarButton src="/assets/svg/hamburger.svg" onClick={showSideNav} />
    <TopBarTitle>
      Streamwave
    </TopBarTitle>
  </TopBarContainer>
);


export default connect(null, mapDispatchToProps)(TopBarHamburger);
