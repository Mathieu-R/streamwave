import { h } from 'preact';
import { Link } from 'react-router-dom';
import { TopBarContainer, TopBarButton, TopBarTitle } from './ui';

import arrow from '../assets/svg/arrow.svg';

const TopBarBack = props => (
    <TopBarContainer>
      <Link to="/">
        <TopBarButton src={arrow} />
      </Link>
      <TopBarTitle>
        Streamwave
      </TopBarTitle>
    </TopBarContainer>
);

export default TopBarBack;
