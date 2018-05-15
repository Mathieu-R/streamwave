import { h, Component } from 'preact';
import { Link } from 'react-router-dom';
import { TopBarContainer, TopBarButton, TopBarTitle } from './ui';

import arrow from '../assets/svg/arrow.svg';

class TopBarBack extends Component {
  shouldComponentUpdate () {
    return false;
  }

  render ({url}) {
    return (
      <TopBarContainer>
        <Link to={url}>
          <TopBarButton role="button" src={arrow} alt="arrow back to home" />
        </Link>
        <TopBarTitle>
          Streamwave
        </TopBarTitle>
      </TopBarContainer>
    )
  }
}

export default TopBarBack;
