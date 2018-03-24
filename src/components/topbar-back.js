import { Component } from 'preact';
import { Link } from 'react-router-dom';
import { TopBarContainer, TopBarButton, TopBarTitle } from './ui';

class TopBarBack extends Component {
  constructor () {
    super();
  }

  render () {
    return (
      <TopBarContainer>
        <TopBarButton src="/assets/svg/arrow.svg" />
        <TopBarTitle>
          Streamwave
        </TopBarTitle>
      </TopBarContainer>
    )
  }
}
