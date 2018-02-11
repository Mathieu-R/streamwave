import { Component } from 'preact';
import { Link } from 'react-router-dom';

class Cover extends Component {
  render ({}) {
    return (
      <div class="cover">
        <img class="cover__artwork" />
        <span class="cover__artist"></span>
        <span class="cover__album-title"></span>
      </div>
    );
  }
}

export default Cover;
