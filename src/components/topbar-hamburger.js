import { Component } from 'preact';
import { Link } from 'react-router-dom';
import { TopBarContainer, TopBarButton, TopBarTitle } from './ui';

const TopBarHamburger = props => (
  <TopBarContainer>
    <TopBarButton src="/assets/svg/hamburger.svg" />
    <TopBarTitle>
      Streamwave
    </TopBarTitle>
  </TopBarContainer>
);


export default TopBarHamburger;
