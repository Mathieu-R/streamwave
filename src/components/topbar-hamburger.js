import { Component } from 'preact';
import { Link } from 'react-router-dom';

class TopBarHamburger extends Component {
  constructor () {
    super();
  }

  render () {
    return (
      <div class="topbar--hamburger">
        <img class="topbar--hamburger__button" src="/assets/svg/ic_menu_white_24px.svg" />
        <div className="topbar--hamburger__title">
          Streamwave
        </div>
      </div>
    )
  }
}

export default TopBarHamburger;
