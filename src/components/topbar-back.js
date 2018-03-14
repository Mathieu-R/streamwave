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
        <TopBarButton></TopBarButton>
        <TopBarTitle>
          Streamwave
        </TopBarTitle>
      </TopBarContainer>
    )
  }
}
