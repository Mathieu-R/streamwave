import { Component } from 'preact';
import { Link } from 'react-router-dom';
import { TopBarContainer, TopBarButton, TopBarTitle } from './ui';

const TopBarBack = props => (
    <TopBarContainer>
      <Link to="/">
        <TopBarButton src="/assets/svg/arrow.svg" />
      </Link>
      <TopBarTitle>
        Streamwave
      </TopBarTitle>
    </TopBarContainer>
);

export default TopBarBack;
