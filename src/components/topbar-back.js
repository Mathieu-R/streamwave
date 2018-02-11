import { Component } from 'preact';
import { Link } from 'react-router-dom';

class TopBarBack extends Component {
  constructor () {
    super();
  }

  render () {
    return (
      <div class="topbar--back">
        <div class="topbar--back__back-button"></div>
        <div className="topbar--back__title">
          Streamwave
        </div>
      </div>
    )
  }
}
