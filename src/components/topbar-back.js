import { Component } from 'preact';
import { Link } from 'react-router-dom';
import { TopBarContainer, TopBarButton, TopBarTitle } from './ui';

const TopBarBack = props => (
    <TopBarContainer>
      <TopBarButton src="/assets/svg/arrow.svg" />
      <TopBarTitle>
        Streamwave
      </TopBarTitle>
    </TopBarContainer>
);
