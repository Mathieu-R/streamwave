import { Component } from 'preact';
import { Link } from 'react-router-dom';

class TopBarHamburger extends Component {
  constructor () {
    super();
  }

  render () {
    return (
      <div class="topbar--hamburger">
        <div class="topbar--hamburger__hamburger-button"></div>
        <div className="topbar--hamburger__title">
          Streamwave
        </div>
      </div>
    )
  }
}

export default TopBarHamburger;
