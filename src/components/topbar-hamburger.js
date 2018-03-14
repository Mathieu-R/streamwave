import { Component } from 'preact';
import { Link } from 'react-router-dom';
import { TopBarContainer, TopBarButton, TopBarTitle } from './ui';

class TopBarHamburger extends Component {
  constructor () {
    super();
  }

  render () {
    return (
      <TopBarContainer>
        <TopBarButton src="/assets/svg/ic_menu_white_24px.svg" />
        <TopBarTitle>
          Streamwave
        </TopBarTitle>
      </TopBarContainer>
    )
  }
}

export default TopBarHamburger;
